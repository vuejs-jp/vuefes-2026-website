/**
 * Small numeric helpers shared by the layout, physics and rendering models.
 *
 * These are intentionally dependency free so that they can be unit tested and
 * reused from both the Vue reactive models and the per-frame render loop, where
 * allocation-free helpers matter.
 */

/**
 * Clamps `value` into the inclusive `[min, max]` range.
 *
 * Unlike a naive `Math.min`/`Math.max` chain written the other way around, this
 * order means `max` wins when the range is inverted (`min > max`), which keeps
 * the result deterministic for degenerate ranges such as a zero sized stage.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns the interpolation factor for an exponential "ease towards target"
 * step, i.e. the `t` in `current += (target - current) * t`.
 *
 * The factor is derived from the elapsed time rather than being a fixed
 * constant, so the perceived follow speed stays the same regardless of the
 * simulation step size.
 *
 * @param speed Higher values converge faster. `0` never moves.
 * @param deltaSeconds Elapsed time of the step, in seconds.
 */
export function smoothingFactor(speed: number, deltaSeconds: number) {
  return 1 - Math.exp(-speed * deltaSeconds);
}
