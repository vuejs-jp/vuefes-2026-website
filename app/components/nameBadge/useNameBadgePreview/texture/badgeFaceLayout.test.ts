import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_PREVIEW_AVATAR_TUNING, NAME_BADGE_PREVIEW_TEXT_TUNING } from "../constant";
import type { NameBadgeUserRole } from "../types";
import {
  hasAvatarBackdrop,
  resolveAvatarBox,
  resolveAvatarDrawRect,
  resolveAvatarFitMode,
  resolveLangFont,
  resolveLangOrigin,
  resolveNameFont,
  resolveLangLabel,
  resolveNameOrigin,
  type Rect,
} from "./badgeFaceLayout";

const ROLES: NameBadgeUserRole[] = ["Attendee", "Attendee+Party", "Sponsor", "Speaker", "Staff"];

describe("resolveAvatarBox", () => {
  it("scales the tuning ratios up to texture pixels", () => {
    const box = resolveAvatarBox(1000, 2000);

    expect(box.x).toBeCloseTo(1000 * NAME_BADGE_PREVIEW_AVATAR_TUNING.xRatio, 10);
    expect(box.y).toBeCloseTo(2000 * NAME_BADGE_PREVIEW_AVATAR_TUNING.yRatio, 10);
    expect(box.width).toBeCloseTo(1000 * NAME_BADGE_PREVIEW_AVATAR_TUNING.widthRatio, 10);
    expect(box.height).toBeCloseTo(2000 * NAME_BADGE_PREVIEW_AVATAR_TUNING.heightRatio, 10);
  });

  it("stays inside the texture", () => {
    const box = resolveAvatarBox(1000, 2000);

    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1000);
    expect(box.y + box.height).toBeLessThanOrEqual(2000);
  });

  it("scales linearly with the texture size", () => {
    const small = resolveAvatarBox(500, 1000);
    const large = resolveAvatarBox(1000, 2000);

    expect(large.x).toBeCloseTo(small.x * 2, 10);
    expect(large.height).toBeCloseTo(small.height * 2, 10);
  });
});

describe("resolveAvatarFitMode", () => {
  it("fits sponsor logos whole, so they are never cropped", () => {
    expect(resolveAvatarFitMode("Sponsor")).toBe("contain");
  });

  it.each(ROLES.filter((role) => role !== "Sponsor"))("crops the %s avatar to fill", (role) => {
    expect(resolveAvatarFitMode(role)).toBe("cover");
  });
});

describe("hasAvatarBackdrop", () => {
  it("gives sponsor logos an opaque backdrop", () => {
    expect(hasAvatarBackdrop("Sponsor")).toBe(true);
  });

  it.each(ROLES.filter((role) => role !== "Sponsor"))("leaves the %s avatar alone", (role) => {
    expect(hasAvatarBackdrop(role)).toBe(false);
  });
});

describe("resolveAvatarDrawRect", () => {
  const square: Rect = { x: 0, y: 0, width: 100, height: 100 };

  it("leaves a source of matching shape untouched", () => {
    expect(resolveAvatarDrawRect(square, { width: 50, height: 50 }, "cover")).toEqual(square);
    expect(resolveAvatarDrawRect(square, { width: 50, height: 50 }, "contain")).toEqual(square);
  });

  describe("cover", () => {
    it("overflows a wide source sideways", () => {
      const rect = resolveAvatarDrawRect(square, { width: 200, height: 100 }, "cover");

      expect(rect).toEqual({ x: -50, y: 0, width: 200, height: 100 });
    });

    it("overflows a tall source vertically", () => {
      const rect = resolveAvatarDrawRect(square, { width: 100, height: 200 }, "cover");

      expect(rect).toEqual({ x: 0, y: -50, width: 100, height: 200 });
    });

    it("always covers the whole frame", () => {
      for (const source of [
        { width: 300, height: 100 },
        { width: 100, height: 300 },
        { width: 101, height: 100 },
      ]) {
        const rect = resolveAvatarDrawRect(square, source, "cover");

        expect(rect.width).toBeGreaterThanOrEqual(square.width - 1e-9);
        expect(rect.height).toBeGreaterThanOrEqual(square.height - 1e-9);
      }
    });
  });

  describe("contain", () => {
    it("adds empty margins above and below a wide source", () => {
      const rect = resolveAvatarDrawRect(square, { width: 200, height: 100 }, "contain");

      expect(rect).toEqual({ x: 0, y: 25, width: 100, height: 50 });
    });

    it("adds empty margins beside a tall source", () => {
      const rect = resolveAvatarDrawRect(square, { width: 100, height: 200 }, "contain");

      expect(rect).toEqual({ x: 25, y: 0, width: 50, height: 100 });
    });

    it("never overflows the frame", () => {
      for (const source of [
        { width: 300, height: 100 },
        { width: 100, height: 300 },
        { width: 101, height: 100 },
      ]) {
        const rect = resolveAvatarDrawRect(square, source, "contain");

        expect(rect.width).toBeLessThanOrEqual(square.width + 1e-9);
        expect(rect.height).toBeLessThanOrEqual(square.height + 1e-9);
      }
    });
  });

  it("preserves the source aspect ratio in both modes", () => {
    const source = { width: 640, height: 480 };

    for (const mode of ["cover", "contain"] as const) {
      const rect = resolveAvatarDrawRect(square, source, mode);
      expect(rect.width / rect.height).toBeCloseTo(source.width / source.height, 10);
    }
  });

  it("centres the image inside a frame that is not at the origin", () => {
    const offset: Rect = { x: 10, y: 20, width: 200, height: 100 };
    const rect = resolveAvatarDrawRect(offset, { width: 100, height: 100 }, "contain");

    expect(rect).toEqual({ x: 60, y: 20, width: 100, height: 100 });
  });

  it("falls back to the frame size for a degenerate source", () => {
    expect(resolveAvatarDrawRect(square, { width: 100, height: 0 }, "cover")).toEqual(square);
    expect(resolveAvatarDrawRect(square, { width: 0, height: 0 }, "contain")).toEqual(square);
  });
});

describe("text placement", () => {
  it("puts the name at the tuned position", () => {
    const origin = resolveNameOrigin(1000, 2000);

    expect(origin.x).toBeCloseTo(1000 * NAME_BADGE_PREVIEW_TEXT_TUNING.nameXRatio, 10);
    expect(origin.y).toBeCloseTo(2000 * NAME_BADGE_PREVIEW_TEXT_TUNING.nameYRatio, 10);
  });

  it("puts the language label at the tuned position", () => {
    const origin = resolveLangOrigin(1000, 2000);

    expect(origin.x).toBeCloseTo(1000 * NAME_BADGE_PREVIEW_TEXT_TUNING.langXRatio, 10);
    expect(origin.y).toBeCloseTo(2000 * NAME_BADGE_PREVIEW_TEXT_TUNING.langYRatio, 10);
  });

  it("builds a bold font shorthand for the name", () => {
    const font = resolveNameFont(1400);
    const size = Math.round(1400 * NAME_BADGE_PREVIEW_TEXT_TUNING.nameFontRatio);

    expect(font).toBe(`700 ${size}px JetBrainsMono-Regular, IBMPlexSansJP-SemiBold, sans-serif`);
  });

  it("builds a regular font shorthand for the language label", () => {
    const font = resolveLangFont(1400);
    const size = Math.round(1400 * NAME_BADGE_PREVIEW_TEXT_TUNING.langFontRatio);

    expect(font).toBe(`400 ${size}px JetBrainsMono-Regular, IBMPlexSansJP-Regular, sans-serif`);
  });

  it("scales the font size with the texture height", () => {
    expect(resolveNameFont(2800)).toContain(
      `${Math.round(2800 * NAME_BADGE_PREVIEW_TEXT_TUNING.nameFontRatio)}px`,
    );
  });

  it("formats the language codes for a staff badge", () => {
    expect(resolveLangLabel("Staff", "ja")).toBe("JP");
    expect(resolveLangLabel("Staff", "ja, en")).toBe("JP/EN");
  });

  it("returns nothing when there is no language to print", () => {
    expect(resolveLangLabel("Staff", undefined)).toBeNull();
    expect(resolveLangLabel("Staff", "")).toBeNull();
    expect(resolveLangLabel("Staff", "  ")).toBeNull();
    expect(resolveLangLabel("Staff", " , ")).toBeNull();
  });

  it.each(ROLES.filter((role) => role !== "Staff"))(
    "never prints a language label for %s",
    (role) => {
      expect(resolveLangLabel(role, "ja")).toBeNull();
    },
  );
});
