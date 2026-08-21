/**
 * Horizontal squeeze applied to the attendee name printed on the badge.
 *
 * The badge artwork reserves a fixed width for the name, but names vary wildly
 * in length. Rather than shrinking the font (which would make short names look
 * inconsistent between badges), the name is drawn at a constant font size and
 * compressed along the x axis once it grows past the reserved width.
 */

/**
 * Characters that occupy a full-width cell when rendered, and therefore count
 * double when estimating how much room a name needs.
 */
const FULL_WIDTH_SCRIPT_PATTERN =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

/**
 * Scale steps, ordered from the widest name budget to the narrowest.
 *
 * Discrete steps are used instead of a continuous ratio so that names of a
 * similar length are printed at an identical scale, which keeps a row of badges
 * looking uniform.
 */
const NAME_SCALE_STEPS = [
  { maxWidthUnits: 12, scaleX: 1 },
  { maxWidthUnits: 16, scaleX: 0.9 },
  { maxWidthUnits: 20, scaleX: 0.85 },
  { maxWidthUnits: 24, scaleX: 0.8 },
  { maxWidthUnits: 28, scaleX: 0.7 },
  { maxWidthUnits: 32, scaleX: 0.6 },
] as const;

/** Scale used for any name longer than the last {@link NAME_SCALE_STEPS} entry. */
const MIN_NAME_SCALE_X = 0.5;

/**
 * Estimates the printed width of `name` in half-width units.
 *
 * CJK characters count as two units, everything else as one. This is a rough
 * approximation of the real font metrics, but it is stable, synchronous and
 * good enough to pick a scale step without measuring on a canvas.
 */
export function measureNameWidthUnits(name: string | undefined): number {
  let widthUnits = 0;
  for (const char of name ?? "") {
    widthUnits += FULL_WIDTH_SCRIPT_PATTERN.test(char) ? 2 : 1;
  }
  return widthUnits;
}

/**
 * Resolves the horizontal scale factor to apply when drawing `name`.
 *
 * @returns A value in `(0, 1]`; `1` means the name fits without compression.
 */
export function resolveNameScaleX(name: string | undefined): number {
  const widthUnits = measureNameWidthUnits(name);
  const step = NAME_SCALE_STEPS.find((candidate) => widthUnits <= candidate.maxWidthUnits);
  return step?.scaleX ?? MIN_NAME_SCALE_X;
}
