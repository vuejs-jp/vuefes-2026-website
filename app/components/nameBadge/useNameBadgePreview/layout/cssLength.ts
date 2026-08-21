/**
 * Parsers for the CSS-ish sizing props (`width`, `height`, `aspectRatio`) that
 * the preview component accepts.
 *
 * The preview drives a WebGL stage, so it needs real numbers rather than CSS
 * strings. Only the subset of CSS the callers actually pass is supported; every
 * other input resolves to `null` so the caller can fall back to a default
 * instead of rendering a NaN sized stage.
 */

const BARE_NUMBER_PATTERN = /^[0-9]+(\.[0-9]+)?$/;
const PX_SUFFIX_PATTERN = /px$/u;
const ASPECT_RATIO_PATTERN = /^\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)\s*$/u;

/**
 * Parses a pixel length such as `"360px"` or `"360"` into a number.
 *
 * Relative units (`%`, `rem`, `vw`, …) are deliberately *not* supported: the
 * stage cannot resolve them without a layout pass, so they resolve to `null`
 * and the caller falls back to the default height.
 *
 * @returns The length in pixels, or `null` when the value is absent or is not a
 * finite absolute pixel length.
 */
export function parsePxLength(value?: string): number | null {
  if (!value) return null;
  const trimmed = value.trim();

  if (BARE_NUMBER_PATTERN.test(trimmed)) {
    const raw = Number.parseFloat(trimmed);
    return Number.isFinite(raw) ? raw : null;
  }

  if (trimmed.endsWith("px")) {
    const raw = Number.parseFloat(trimmed.replace(PX_SUFFIX_PATTERN, ""));
    return Number.isFinite(raw) ? raw : null;
  }

  return null;
}

/**
 * Parses a CSS `aspect-ratio` of the form `"<width> / <height>"` into a
 * width-to-height ratio.
 *
 * A zero denominator resolves to `null` rather than `Infinity`, so a malformed
 * prop degrades to the default aspect instead of collapsing the card.
 *
 * @returns The ratio (width divided by height), or `null` when the value cannot
 * be parsed into a finite ratio.
 */
export function parseAspectRatio(value?: string): number | null {
  if (!value) return null;
  const match = value.match(ASPECT_RATIO_PATTERN);
  if (!match) return null;

  const numerator = Number.parseFloat(match[1]!);
  const denominator = Number.parseFloat(match[2]!);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return null;
  }

  return numerator / denominator;
}
