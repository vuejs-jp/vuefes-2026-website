import { NAME_BADGE_CARD_SURFACE_TUNING } from "../constant";
import { clamp } from "../shared/math";
import type { Point, Rect } from "./badgeFaceLayout";

/**
 * Generates the roughness and bump maps that give the printed card its finish.
 *
 * The badge is matte laminated paper, which reads as "not shiny anywhere" under
 * a single light. To make it feel printed rather than flat, two maps are
 * generated at texture resolution:
 *
 * - a **roughness map**, mostly rough with a fine grain, and
 * - a **bump map**, the same grain expressed as height.
 *
 * A handful of regions are then masked back to smooth: the Vue logo, the
 * sponsor strip along the bottom, and the avatar circle. Those areas are printed
 * with a gloss finish on the real badge, so they catch the light while the paper
 * around them does not.
 *
 * These functions write into caller-owned `Uint8ClampedArray` buffers (the
 * `data` of a canvas `ImageData`) so that no pixel data is copied.
 */

/**
 * A cheap, deterministic value-noise hash.
 *
 * `Math.random()` is unusable here: the maps are regenerated on every resize,
 * and a different grain each time would make the card visibly shimmer.
 *
 * @returns A pseudo-random value in `[0, 1]`.
 */
export function pseudoNoise01(px: number, py: number, seed: number): number {
  let n = (px * 374761393 + py * 668265263 + seed) | 0;
  n = (n ^ (n >>> 13)) | 0;
  n = Math.imul(n, 1274126177);
  n = (n ^ (n >>> 16)) | 0;
  return (n & 0xff) / 255;
}

/** Linear interpolation from `value` towards `target`. */
export function blendChannel(value: number, target: number, opacity: number): number {
  return value + (target - value) * opacity;
}

/**
 * Even-odd point-in-polygon test using a horizontal ray cast.
 *
 * The polygon is treated as closed; `points` must be in order but may wind
 * either way.
 */
export function pointInPolygon(x: number, y: number, points: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i]!.x;
    const yi = points[i]!.y;
    const xj = points[j]!.x;
    const yj = points[j]!.y;

    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Scales a normalized polygon from `constant.ts` up to texture pixels. */
function toPixelPolygon(
  ratios: readonly (readonly [number, number])[],
  width: number,
  height: number,
): Point[] {
  return ratios.map(([rx, ry]) => ({ x: rx * width, y: ry * height }));
}

export type SmoothMaskParams = {
  /** RGBA buffer to modify in place. Only the RGB channels are written. */
  data: Uint8ClampedArray;
  width: number;
  height: number;
  /** Channel value that represents a fully smooth surface in this map. */
  smoothValue: number;
  /** Strength of the mask, in `[0, 1]`. */
  opacity: number;
  avatar: Rect;
};

/**
 * Blends the glossy regions towards `smoothValue`.
 *
 * The logo and sponsor regions are hard-edged because they are printed shapes.
 * The avatar circle is feathered instead: it is a photo cut-out, and a hard edge
 * there shows up as a visible ring under the highlight.
 */
export function applySmoothMask(params: SmoothMaskParams): void {
  const { data, width, height, smoothValue, opacity, avatar } = params;

  const vPolygon = toPixelPolygon(
    NAME_BADGE_CARD_SURFACE_TUNING.smoothVPolygonRatios,
    width,
    height,
  );
  const sponsorPolygon = toPixelPolygon(
    NAME_BADGE_CARD_SURFACE_TUNING.smoothSponsorPolygonRatios,
    width,
    height,
  );

  const circleCenterX = avatar.x + avatar.width * 0.5;
  const circleCenterY = avatar.y + avatar.height * 0.5;
  const circleRadius =
    Math.min(avatar.width, avatar.height) * NAME_BADGE_CARD_SURFACE_TUNING.smoothORadiusScale;
  const circleRadiusSq = circleRadius * circleRadius;
  const feather = Math.max(1, circleRadius * 0.12);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const inLogo = pointInPolygon(x, y, vPolygon);
      const inSponsor = pointInPolygon(x, y, sponsorPolygon);

      const dx = x - circleCenterX;
      const dy = y - circleCenterY;
      const circleDistanceSq = dx * dx + dy * dy;
      let inCircle = false;
      let circleEdgeOpacity = 0;

      if (circleDistanceSq <= circleRadiusSq) {
        inCircle = true;
        const edgeDistance = circleRadius - Math.sqrt(circleDistanceSq);
        circleEdgeOpacity = clamp(edgeDistance / feather, 0, 1);
      }

      if (!inLogo && !inCircle && !inSponsor) continue;

      const index = (y * width + x) * 4;
      const maskOpacity = inLogo || inSponsor ? opacity : opacity * circleEdgeOpacity;
      const current = data[index + 0] ?? smoothValue;
      const next = blendChannel(current, smoothValue, maskOpacity);
      data[index + 0] = next;
      data[index + 1] = next;
      data[index + 2] = next;
    }
  }
}

export type CardSurfaceMapsParams = {
  /** RGBA buffer for the roughness map, written in place. */
  roughnessData: Uint8ClampedArray;
  /** RGBA buffer for the bump map, written in place. */
  bumpData: Uint8ClampedArray;
  width: number;
  height: number;
  /** Avatar frame, used to place the feathered glossy circle. */
  avatar: Rect;
};

/** Channel value meaning "no displacement" in a bump map. */
const BUMP_NEUTRAL = 127;

/**
 * Fills both surface maps with grain, then masks the glossy regions smooth.
 */
export function writeCardSurfaceMaps(params: CardSurfaceMapsParams): void {
  const { roughnessData, bumpData, width, height, avatar } = params;

  const roughnessBase = Math.round(clamp(NAME_BADGE_CARD_SURFACE_TUNING.baseRoughness, 0, 1) * 255);
  const roughnessSmooth = Math.round(
    clamp(NAME_BADGE_CARD_SURFACE_TUNING.smoothRoughness, 0, 1) * 255,
  );
  const roughnessNoise = Math.round(
    clamp(NAME_BADGE_CARD_SURFACE_TUNING.roughnessNoiseAmplitude, 0, 1) * 255,
  );
  const bumpNoise = Math.round(
    clamp(NAME_BADGE_CARD_SURFACE_TUNING.bumpNoiseAmplitude, 0, 1) * 127,
  );

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      // Two octaves: a coarse blotchiness plus a finer paper grain.
      const coarseNoise = pseudoNoise01(x, y, 1337);
      const fineNoise = pseudoNoise01(x * 3, y * 3, 7331);
      const combinedNoise = (coarseNoise * 0.7 + fineNoise * 0.3) * 2 - 1;

      const roughnessValue = clamp(roughnessBase + combinedNoise * roughnessNoise, 0, 255);
      const bumpValue = clamp(BUMP_NEUTRAL + combinedNoise * bumpNoise, 0, 255);

      roughnessData[index + 0] = roughnessValue;
      roughnessData[index + 1] = roughnessValue;
      roughnessData[index + 2] = roughnessValue;
      roughnessData[index + 3] = 255;

      bumpData[index + 0] = bumpValue;
      bumpData[index + 1] = bumpValue;
      bumpData[index + 2] = bumpValue;
      bumpData[index + 3] = 255;
    }
  }

  applySmoothMask({
    data: roughnessData,
    width,
    height,
    smoothValue: roughnessSmooth,
    opacity: NAME_BADGE_CARD_SURFACE_TUNING.smoothMaskOpacity,
    avatar,
  });
  // Smooth means "flat" for the bump map, which is its neutral value rather
  // than zero.
  applySmoothMask({
    data: bumpData,
    width,
    height,
    smoothValue: BUMP_NEUTRAL,
    opacity: NAME_BADGE_CARD_SURFACE_TUNING.smoothMaskOpacity,
    avatar,
  });
}
