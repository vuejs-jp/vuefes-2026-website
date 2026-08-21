import { describe, expect, it } from "vite-plus/test";
import type { NameBadgeUserRole } from "../types";
import { resolveAvatarBox, resolveLangOrigin, resolveNameOrigin } from "./badgeFaceLayout";
import { drawBadgeFace, type BadgeFaceContent } from "./drawBadgeFace";

const SIZE = { width: 400, height: 600 };

type DrawOp = Record<string, unknown> & { type: string };

/**
 * A 2D context stand-in that records the calls made against it, along with the
 * style properties that were in effect at the time.
 */
function createRecordingContext() {
  const ops: DrawOp[] = [];

  const ctx = {
    fillStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
    clearRect: (...args: number[]) => ops.push({ type: "clearRect", args }),
    fillRect: (...args: number[]) => ops.push({ type: "fillRect", args, fillStyle: ctx.fillStyle }),
    drawImage: (image: unknown, ...args: number[]) => ops.push({ type: "drawImage", image, args }),
    fillText: (text: string, x: number, y: number) =>
      ops.push({
        type: "fillText",
        text,
        x,
        y,
        fillStyle: ctx.fillStyle,
        font: ctx.font,
        textAlign: ctx.textAlign,
        textBaseline: ctx.textBaseline,
      }),
    save: () => ops.push({ type: "save" }),
    restore: () => ops.push({ type: "restore" }),
    beginPath: () => ops.push({ type: "beginPath" }),
    closePath: () => ops.push({ type: "closePath" }),
    clip: () => ops.push({ type: "clip" }),
    ellipse: (...args: number[]) => ops.push({ type: "ellipse", args }),
    translate: (...args: number[]) => ops.push({ type: "translate", args }),
    scale: (...args: number[]) => ops.push({ type: "scale", args }),
  };

  return { ctx: ctx as unknown as CanvasRenderingContext2D, ops };
}

function fakeImage(width: number, height: number, label: string) {
  return { width, height, label } as unknown as HTMLImageElement;
}

/** Resolves only for the URLs listed in `available`. */
function createLoader(available: Record<string, HTMLImageElement>) {
  const requested: string[] = [];

  const loadImage = async (url: string) => {
    requested.push(url);
    const image = available[url];
    if (!image) throw new Error(`missing: ${url}`);
    return image;
  };

  return { loadImage, requested };
}

function createContent(overrides: Partial<BadgeFaceContent> = {}): BadgeFaceContent {
  return {
    userRole: "Attendee",
    name: "Evan",
    color: "#385FCC",
    nameScaleX: 1,
    baseImageUrls: ["/role.png", "/default.png"],
    avatarImageUrls: ["/avatar.png", "/placeholder.png"],
    ...overrides,
  };
}

type DrawResult = {
  ops: DrawOp[];
  requested: string[];
  fallbackReports: boolean[];
  result: Awaited<ReturnType<typeof drawBadgeFace>>;
};

async function draw(
  content: BadgeFaceContent,
  available: Record<string, HTMLImageElement>,
  options: { staleAfter?: number } = {},
): Promise<DrawResult> {
  const { ctx, ops } = createRecordingContext();
  const { loadImage, requested } = createLoader(available);
  const fallbackReports: boolean[] = [];

  const result = await drawBadgeFace(ctx, SIZE, content, {
    loadImage,
    isStale: () => options.staleAfter !== undefined && requested.length > options.staleAfter,
    onBaseImageFallback: (value) => fallbackReports.push(value),
  });

  return { ops, requested, fallbackReports, result };
}

const ROLE_ARTWORK = { "/role.png": fakeImage(400, 600, "role") };
const AVATAR = { "/avatar.png": fakeImage(100, 100, "avatar") };
const PLACEHOLDER = { "/placeholder.png": fakeImage(100, 100, "placeholder") };
const ALL_ASSETS = { ...ROLE_ARTWORK, ...AVATAR, ...PLACEHOLDER };

const opsOfType = (ops: DrawOp[], type: string) => ops.filter((op) => op.type === type);

describe("drawBadgeFace", () => {
  it("clears the canvas before painting anything", async () => {
    const { ops } = await draw(createContent(), ALL_ASSETS);

    expect(ops[0]).toEqual({ type: "clearRect", args: [0, 0, SIZE.width, SIZE.height] });
  });

  describe("badge artwork", () => {
    it("draws the role artwork across the whole texture", async () => {
      const { ops } = await draw(createContent(), ALL_ASSETS);
      const drawn = opsOfType(ops, "drawImage")[0]!;

      expect(drawn.image).toBe(ROLE_ARTWORK["/role.png"]);
      expect(drawn.args).toEqual([0, 0, SIZE.width, SIZE.height]);
    });

    it("reports that no fallback was needed", async () => {
      const { fallbackReports } = await draw(createContent(), ALL_ASSETS);

      expect(fallbackReports).toEqual([false, false]);
    });

    it("does not request the default artwork when the role artwork loads", async () => {
      const { requested } = await draw(createContent(), ALL_ASSETS);

      expect(requested).not.toContain("/default.png");
    });

    it("falls back to the default artwork and reports it", async () => {
      const defaultArtwork = { "/default.png": fakeImage(400, 600, "default") };
      const { ops, fallbackReports } = await draw(createContent(), {
        ...defaultArtwork,
        ...AVATAR,
      });

      expect(opsOfType(ops, "drawImage")[0]!.image).toBe(defaultArtwork["/default.png"]);
      expect(fallbackReports.at(-1)).toBe(true);
    });

    it("paints a flat placeholder when no artwork loads at all", async () => {
      const { ops } = await draw(createContent(), AVATAR);
      const fills = opsOfType(ops, "fillRect");

      expect(fills[0]).toMatchObject({
        args: [0, 0, SIZE.width, SIZE.height],
        fillStyle: "#f2f5ff",
      });
    });

    it("still draws the name when no artwork loads", async () => {
      const { ops } = await draw(createContent(), {});

      expect(opsOfType(ops, "fillText").map((op) => op.text)).toEqual(["Evan"]);
    });
  });

  describe("avatar", () => {
    it("clips the avatar to the tuned circle", async () => {
      const { ops } = await draw(createContent(), ALL_ASSETS);
      const box = resolveAvatarBox(SIZE.width, SIZE.height);
      const ellipse = opsOfType(ops, "ellipse")[0]!;

      expect(ellipse.args).toEqual([
        box.x + box.width / 2,
        box.y + box.height / 2,
        box.width / 2,
        box.height / 2,
        0,
        0,
        Math.PI * 2,
      ]);
      expect(opsOfType(ops, "clip")).toHaveLength(1);
    });

    it("draws the attendee's own avatar when it loads", async () => {
      const { ops } = await draw(createContent(), ALL_ASSETS);

      expect(opsOfType(ops, "drawImage")[1]!.image).toBe(AVATAR["/avatar.png"]);
    });

    it("falls back to the role placeholder", async () => {
      const { ops, requested } = await draw(createContent(), {
        ...ROLE_ARTWORK,
        ...PLACEHOLDER,
      });

      expect(requested).toContain("/avatar.png");
      expect(opsOfType(ops, "drawImage")[1]!.image).toBe(PLACEHOLDER["/placeholder.png"]);
    });

    it("leaves the frame empty when no avatar loads", async () => {
      const { ops } = await draw(createContent(), ROLE_ARTWORK);

      expect(opsOfType(ops, "drawImage")).toHaveLength(1);
      // The circular clip is still applied, so nothing bleeds into the frame.
      expect(opsOfType(ops, "clip")).toHaveLength(1);
    });

    it("gives sponsor logos an opaque backdrop", async () => {
      const { ops } = await draw(createContent({ userRole: "Sponsor" }), ALL_ASSETS);
      const box = resolveAvatarBox(SIZE.width, SIZE.height);

      expect(opsOfType(ops, "fillRect")).toContainEqual({
        type: "fillRect",
        args: [box.x, box.y, box.width, box.height],
        fillStyle: "#ffffff",
      });
    });

    it.each<NameBadgeUserRole>(["Attendee", "Attendee+Party", "Speaker", "Staff"])(
      "gives the %s avatar no backdrop",
      async (userRole) => {
        const { ops } = await draw(createContent({ userRole }), ALL_ASSETS);

        expect(opsOfType(ops, "fillRect")).toHaveLength(0);
      },
    );

    it("crops a wide avatar to fill the circle", async () => {
      const wide = { "/avatar.png": fakeImage(200, 100, "wide") };
      const { ops } = await draw(createContent(), { ...ROLE_ARTWORK, ...wide });
      const box = resolveAvatarBox(SIZE.width, SIZE.height);
      const [, , width, height] = opsOfType(ops, "drawImage")[1]!.args as number[];

      expect(width).toBeGreaterThanOrEqual(box.width - 1e-9);
      expect(height).toBeGreaterThanOrEqual(box.height - 1e-9);
    });

    it("fits a wide sponsor logo inside the circle", async () => {
      const wide = { "/avatar.png": fakeImage(200, 100, "wide") };
      const { ops } = await draw(createContent({ userRole: "Sponsor" }), {
        ...ROLE_ARTWORK,
        ...wide,
      });
      const box = resolveAvatarBox(SIZE.width, SIZE.height);
      const [, , width, height] = opsOfType(ops, "drawImage")[1]!.args as number[];

      expect(width).toBeLessThanOrEqual(box.width + 1e-9);
      expect(height).toBeLessThanOrEqual(box.height + 1e-9);
    });
  });

  describe("text", () => {
    it("draws the name in the role color at the tuned origin", async () => {
      const { ops } = await draw(createContent(), ALL_ASSETS);
      const origin = resolveNameOrigin(SIZE.width, SIZE.height);
      const nameOp = opsOfType(ops, "fillText")[0]!;

      expect(nameOp).toMatchObject({
        text: "Evan",
        x: 0,
        y: 0,
        fillStyle: "#385FCC",
        textAlign: "left",
        textBaseline: "middle",
      });
      // Drawn at the origin of a translated context, not at absolute coordinates.
      expect(opsOfType(ops, "translate")).toContainEqual({
        type: "translate",
        args: [origin.x, origin.y],
      });
    });

    it("squeezes a long name horizontally only", async () => {
      const { ops } = await draw(createContent({ nameScaleX: 0.6 }), ALL_ASSETS);

      expect(opsOfType(ops, "scale")).toEqual([{ type: "scale", args: [0.6, 1] }]);
    });

    it("draws the formatted language label for staff, right-aligned", async () => {
      const { ops } = await draw(
        createContent({ userRole: "Staff", lang: "ja, en", color: "#ffffff" }),
        ALL_ASSETS,
      );

      expect(opsOfType(ops, "fillText")).toHaveLength(2);
      expect(opsOfType(ops, "fillText")[1]).toMatchObject({
        text: "JP/EN",
        fillStyle: "#ffffff",
        textAlign: "right",
        textBaseline: "middle",
      });
    });

    it("pins the language label to its right-hand margin", async () => {
      const { ops } = await draw(
        createContent({ userRole: "Staff", lang: "ja", color: "#ffffff" }),
        ALL_ASSETS,
      );
      const origin = resolveLangOrigin(SIZE.width, SIZE.height);

      expect(opsOfType(ops, "fillText")[1]).toMatchObject({ x: origin.x, y: origin.y });
    });

    it("omits the language label for a staff badge without a language", async () => {
      const { ops } = await draw(createContent({ userRole: "Staff" }), ALL_ASSETS);

      expect(opsOfType(ops, "fillText")).toHaveLength(1);
    });

    it("omits the language label when the codes format to nothing", async () => {
      const { ops } = await draw(createContent({ userRole: "Staff", lang: " , " }), ALL_ASSETS);

      expect(opsOfType(ops, "fillText")).toHaveLength(1);
    });

    it("omits the language label for non-staff badges", async () => {
      const { ops } = await draw(createContent({ userRole: "Speaker", lang: "ja" }), ALL_ASSETS);

      expect(opsOfType(ops, "fillText")).toHaveLength(1);
    });
  });

  describe("result", () => {
    it("reports where the avatar was placed", async () => {
      const { result } = await draw(createContent(), ALL_ASSETS);

      expect(result?.avatar).toEqual(resolveAvatarBox(SIZE.width, SIZE.height));
    });

    it("bails out when a newer draw supersedes it", async () => {
      const { result } = await draw(createContent(), ALL_ASSETS, { staleAfter: 0 });

      expect(result).toBeNull();
    });

    it("stops painting as soon as it is superseded", async () => {
      const { ops } = await draw(createContent(), ALL_ASSETS, { staleAfter: 0 });

      // The canvas was cleared, but nothing was drawn over the newer content.
      expect(opsOfType(ops, "drawImage")).toHaveLength(0);
      expect(opsOfType(ops, "fillText")).toHaveLength(0);
    });

    it("bails out when superseded while the avatar is loading", async () => {
      const { ops, result } = await draw(createContent(), ALL_ASSETS, { staleAfter: 1 });

      expect(result).toBeNull();
      expect(opsOfType(ops, "drawImage")).toHaveLength(1);
      expect(opsOfType(ops, "fillText")).toHaveLength(0);
    });
  });
});
