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
import type { ImageLoader } from "./imageLoader";

/** Background painted when no badge artwork could be loaded at all. */
const MISSING_ARTWORK_COLOR = "#f2f5ff";

/** Backdrop behind a `contain`-fitted avatar. */
const AVATAR_BACKDROP_COLOR = "#ffffff";

export type BadgeFaceContent = {
  userRole: NameBadgeUserRole;
  name: string;
  /** Comma separated language codes, shown on staff badges. */
  lang?: string;
  /** Role color used for all printed text. */
  color: string;
  /** Horizontal squeeze applied to the name so long names still fit. */
  nameScaleX: number;
  /** Badge artwork candidates, most preferred first. */
  baseImageUrls: readonly string[];
  /** Avatar candidates, most preferred first. */
  avatarImageUrls: readonly string[];
};

export type DrawBadgeFaceDeps = {
  loadImage: ImageLoader;
  /**
   * Returns `true` once a newer draw has started.
   *
   * Drawing is asynchronous, so a rapid prop change can leave two draws in
   * flight. The later one wins, and the earlier one bails out at its next
   * suspension point rather than painting stale content over the new face.
   */
  isStale: () => boolean;
  /**
   * Reports whether the badge artwork fell back to the default role's asset,
   * so the DOM fallback `<img>` can match what WebGL is showing.
   */
  onBaseImageFallback: (isFallback: boolean) => void;
};

export type BadgeFaceDrawResult = {
  /** Where the avatar was placed, needed to mask the glossy surface regions. */
  avatar: Rect;
};

/**
 * Paints the front face of the badge onto a 2D canvas context.
 *
 * The layers, in order: badge artwork, avatar (clipped to a circle), attendee
 * name, and — for staff — the language label. The context is expected to be
 * sized to the texture, and is cleared first so transparent pixels in the
 * artwork stay transparent on the resulting texture.
 *
 * @returns Where the avatar landed, or `null` if a newer draw superseded this
 * one before it finished.
 */
export async function drawBadgeFace(
  ctx: CanvasRenderingContext2D,
  size: { width: number; height: number },
  content: BadgeFaceContent,
  deps: DrawBadgeFaceDeps,
): Promise<BadgeFaceDrawResult | null> {
  const { width, height } = size;

  deps.onBaseImageFallback(false);
  ctx.clearRect(0, 0, width, height);

  const baseLoaded = await drawBaseArtwork();
  if (baseLoaded === null) return null;

  if (!baseLoaded) {
    ctx.fillStyle = MISSING_ARTWORK_COLOR;
    ctx.fillRect(0, 0, width, height);
  }

  const avatar = resolveAvatarBox(width, height);
  const avatarImage = await loadFirstAvailable(content.avatarImageUrls);
  if (avatarImage === undefined) return null;

  drawAvatar(avatar, avatarImage);
  drawName();
  drawLang();

  return { avatar };

  /**
   * Draws the first badge artwork candidate that loads.
   *
   * @returns Whether an image was drawn, or `null` when the draw was superseded.
   */
  async function drawBaseArtwork(): Promise<boolean | null> {
    for (let index = 0; index < content.baseImageUrls.length; index += 1) {
      try {
        const image = await deps.loadImage(content.baseImageUrls[index]!);
        if (deps.isStale()) return null;

        ctx.drawImage(image, 0, 0, width, height);
        deps.onBaseImageFallback(index > 0);
        return true;
      } catch {
        // Try the next candidate.
      }
    }

    return false;
  }

  /**
   * @returns The first image that loads, `null` when none do, or `undefined`
   * when the draw was superseded.
   */
  async function loadFirstAvailable(
    urls: readonly string[],
  ): Promise<HTMLImageElement | null | undefined> {
    for (const url of urls) {
      try {
        const image = await deps.loadImage(url);
        if (deps.isStale()) return undefined;
        return image;
      } catch {
        // Try the next candidate.
      }
    }

    return null;
  }

  function drawAvatar(box: Rect, image: HTMLImageElement | null) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      box.x + box.width / 2,
      box.y + box.height / 2,
      box.width / 2,
      box.height / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.clip();

    if (hasAvatarBackdrop(content.userRole)) {
      ctx.fillStyle = AVATAR_BACKDROP_COLOR;
      ctx.fillRect(box.x, box.y, box.width, box.height);
    }

    if (image) {
      const drawRect = resolveAvatarDrawRect(box, image, resolveAvatarFitMode(content.userRole));
      ctx.drawImage(image, drawRect.x, drawRect.y, drawRect.width, drawRect.height);
    }

    ctx.restore();
  }

  function drawName() {
    const origin = resolveNameOrigin(width, height);

    ctx.save();
    // Scaling around the text origin keeps the name left-aligned to the artwork
    // as it is squeezed.
    ctx.translate(origin.x, origin.y);
    ctx.scale(content.nameScaleX, 1);
    ctx.fillStyle = content.color;
    ctx.font = resolveNameFont(height);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(content.name, 0, 0);
    ctx.restore();
  }

  function drawLang() {
    const label = resolveLangLabel(content.userRole, content.lang);
    if (!label) return;

    const origin = resolveLangOrigin(width, height);

    ctx.fillStyle = content.color;
    ctx.font = resolveLangFont(height);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(label, origin.x, origin.y);
  }
}
