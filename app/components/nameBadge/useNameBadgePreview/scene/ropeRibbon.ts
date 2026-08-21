import { NAME_BADGE_ROPE_VISUAL_TUNING } from "../constant";
import type { WorldProjection } from "./worldProjection";

/**
 * Turns the coarse rope simulation into the smooth ribbon mesh that is actually
 * drawn.
 *
 * The physics runs on a couple of dozen particles — enough for believable
 * motion, but visibly angular if rendered directly. So the particle chain is
 * resampled along a Catmull-Rom spline at a much higher resolution, then
 * expanded sideways into a two-vertex-wide strip.
 *
 * Both routines write into pre-allocated buffers because they run every frame.
 */

/**
 * Samples a Catmull-Rom spline through `points` at a fractional index.
 *
 * The spline passes exactly through every control point, which matters here: the
 * rendered rope must stay attached to the simulated anchor and tip rather than
 * being smoothed away from them.
 *
 * Control point indices are clamped, so the first and last segments duplicate
 * their neighbor rather than reading out of bounds. That makes the curve ease
 * into both ends instead of continuing straight through them.
 *
 * @param position Fractional index into `points`. Callers stay within
 * `[0, lastIndex]`; beyond that the curve extrapolates.
 * @param lastIndex Index of the last valid control point.
 */
export function sampleCatmullRom(
  points: Float32Array,
  position: number,
  lastIndex: number,
): number {
  const point1Index = Math.min(lastIndex, Math.floor(position));
  const point2Index = Math.min(lastIndex, point1Index + 1);
  const point0Index = Math.max(0, point1Index - 1);
  const point3Index = Math.min(lastIndex, point2Index + 1);

  const t = position - point1Index;
  const point0 = points[point0Index] ?? 0;
  const point1 = points[point1Index] ?? 0;
  const point2 = points[point2Index] ?? point1;
  const point3 = points[point3Index] ?? point2;

  const tSquared = t * t;
  const tCubed = tSquared * t;

  return (
    0.5 *
    (2 * point1 +
      (-point0 + point2) * t +
      (2 * point0 - 5 * point1 + 4 * point2 - point3) * tSquared +
      (-point0 + 3 * point1 - 3 * point2 + point3) * tCubed)
  );
}

/**
 * Resamples the simulated rope into a world-space centre line.
 *
 * @param curve Destination buffer of `(segments + 1) * 3` floats, as XYZ triples.
 */
export function writeRopeCurve(
  curve: Float32Array,
  ropeX: Float32Array,
  ropeY: Float32Array,
  segments: number,
  projection: WorldProjection,
): void {
  const physicsLastIndex = ropeX.length - 1;

  for (let i = 0; i <= segments; i += 1) {
    const physicsPosition = (i / segments) * physicsLastIndex;
    const px = sampleCatmullRom(ropeX, physicsPosition, physicsLastIndex);
    const py = sampleCatmullRom(ropeY, physicsPosition, physicsLastIndex);

    curve[i * 3 + 0] = projection.toWorldX(px);
    curve[i * 3 + 1] = projection.toWorldY(py);
    curve[i * 3 + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;
  }
}

/**
 * Expands a centre line into a flat ribbon, two vertices per sample.
 *
 * Each sample is offset along the 2D normal of the local tangent, so the strip
 * keeps a constant width as the rope bends. The tangent is a central difference,
 * with the end samples falling back to a one-sided difference.
 *
 * @param ribbon Destination buffer of `(segments + 1) * 6` floats: for each
 * sample, the left vertex XYZ followed by the right vertex XYZ.
 * @param curve Centre line produced by {@link writeRopeCurve}.
 * @param halfWidth Half the rope width, in world units.
 */
export function writeRopeRibbon(
  ribbon: Float32Array,
  curve: Float32Array,
  segments: number,
  halfWidth: number,
): void {
  for (let i = 0; i <= segments; i += 1) {
    const previousIndex = i === 0 ? 0 : i - 1;
    const nextIndex = i === segments ? segments : i + 1;

    const currentOffset = i * 3;
    const previousOffset = previousIndex * 3;
    const nextOffset = nextIndex * 3;

    const centerX = curve[currentOffset + 0] ?? 0;
    const centerY = curve[currentOffset + 1] ?? 0;
    const tangentX = (curve[nextOffset + 0] ?? 0) - (curve[previousOffset + 0] ?? 0);
    const tangentY = (curve[nextOffset + 1] ?? 0) - (curve[previousOffset + 1] ?? 0);
    // A degenerate tangent (two coincident samples) would divide by zero; any
    // direction will do there, since the segment has no length to show for it.
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;

    const leftOffset = i * 6;
    const rightOffset = leftOffset + 3;

    ribbon[leftOffset + 0] = centerX + normalX * halfWidth;
    ribbon[leftOffset + 1] = centerY + normalY * halfWidth;
    ribbon[leftOffset + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;

    ribbon[rightOffset + 0] = centerX - normalX * halfWidth;
    ribbon[rightOffset + 1] = centerY - normalY * halfWidth;
    ribbon[rightOffset + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;
  }
}
