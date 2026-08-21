import { NAME_BADGE_PREVIEW_WORLD_TUNING } from "../constant";

/**
 * The stage measurements the projection depends on. Declared as plain readonly
 * numbers so tests can pass a literal while the scene passes reactive getters.
 */
export type WorldProjectionMetrics = {
  readonly stageWidth: number;
  readonly stageHeight: number;
  /** Rendered card height in stage pixels. Sets the pixels-per-world-unit scale. */
  readonly cardHeightPx: number;
};

export type WorldProjection = {
  /** Stage x (pixels, origin left) to world x (units, origin centre). */
  toWorldX: (px: number) => number;
  /** Stage y (pixels, down positive) to world y (units, up positive). */
  toWorldY: (py: number) => number;
  /** A length in stage pixels to the same length in world units. */
  toWorldSize: (px: number) => number;
};

/**
 * Maps the 2D stage-pixel space the physics runs in onto the 3D world space the
 * scene is rendered in.
 *
 * The card is modelled at a fixed world height, so the scale factor is simply
 * how many stage pixels tall the card is meant to be. Anchoring the scale to the
 * card (rather than to the stage) keeps the badge the same on-screen size no
 * matter how much empty stage surrounds it.
 *
 * The two spaces also disagree about the origin and the y direction, which is
 * what the offset and sign flip below handle.
 */
export function createWorldProjection(metrics: WorldProjectionMetrics): WorldProjection {
  const pixelsPerWorldUnit = () =>
    metrics.cardHeightPx / NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;

  return {
    toWorldX: (px) => (px - metrics.stageWidth / 2) / pixelsPerWorldUnit(),
    toWorldY: (py) => (metrics.stageHeight / 2 - py) / pixelsPerWorldUnit(),
    toWorldSize: (px) =>
      (px * NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld) / metrics.cardHeightPx,
  };
}
