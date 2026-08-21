// Relative rather than aliased: this module is unit tested outside the Nuxt
// build, where `~` does not resolve.
import { formatNameBadgeLanguages } from "../../../../utils/formatNameBadgeLanguages";

import { NAME_BADGE_PREVIEW_AVATAR_TUNING, NAME_BADGE_PREVIEW_TEXT_TUNING } from "../constant";
import type { NameBadgeUserRole } from "../types";

/** An axis-aligned rectangle in texture pixels. */
export type Rect = { x: number; y: number; width: number; height: number };

/** A point in texture pixels. */
export type Point = { x: number; y: number };

/**
 * How the avatar image is scaled into its circular frame.
 *
 * - `cover`: fills the circle, cropping the overflow. Right for photos.
 * - `contain`: fits the whole image inside the circle. Right for logos, which
 *   must not be cropped.
 */
export type AvatarFitMode = "cover" | "contain";

/**
 * All badge face positions are expressed as ratios of the texture size in
 * `constant.ts`, so the same numbers work at any texture resolution. The helpers
 * below turn those ratios into concrete pixel rectangles.
 */

/** The circular avatar frame, as a bounding box. */
export function resolveAvatarBox(width: number, height: number): Rect {
  return {
    x: width * NAME_BADGE_PREVIEW_AVATAR_TUNING.xRatio,
    y: height * NAME_BADGE_PREVIEW_AVATAR_TUNING.yRatio,
    width: width * NAME_BADGE_PREVIEW_AVATAR_TUNING.widthRatio,
    height: height * NAME_BADGE_PREVIEW_AVATAR_TUNING.heightRatio,
  };
}

/** Sponsors upload logos, everyone else uploads a profile picture. */
export function resolveAvatarFitMode(userRole: NameBadgeUserRole): AvatarFitMode {
  return userRole === "Sponsor" ? "contain" : "cover";
}

/**
 * Whether the avatar frame is filled with white before the image is drawn.
 *
 * Sponsor logos are usually transparent PNGs designed for a light background,
 * so they need an opaque backdrop; a `contain` fit would otherwise leave the
 * badge artwork showing through the empty margins.
 */
export function hasAvatarBackdrop(userRole: NameBadgeUserRole): boolean {
  return userRole === "Sponsor";
}

/**
 * Scales `source` into `box` under the given fit mode, centred.
 *
 * A zero-sized source would produce a non-finite ratio, so it is returned
 * unscaled rather than as `NaN`.
 */
export function resolveAvatarDrawRect(
  box: Rect,
  source: { width: number; height: number },
  mode: AvatarFitMode,
): Rect {
  let drawWidth = box.width;
  let drawHeight = box.height;

  const sourceRatio = source.width / source.height;
  const targetRatio = box.width / box.height;

  if (Number.isFinite(sourceRatio) && sourceRatio > 0) {
    // `cover` and `contain` are mirror images of each other: one pins the wider
    // axis to the box, the other the narrower one.
    const derivesWidthFromHeight =
      mode === "contain" ? sourceRatio <= targetRatio : sourceRatio > targetRatio;
    if (derivesWidthFromHeight) {
      drawWidth = box.height * sourceRatio;
    } else {
      drawHeight = box.width / sourceRatio;
    }
  }

  return {
    x: box.x + (box.width - drawWidth) / 2,
    y: box.y + (box.height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  };
}

/** Baseline-left origin of the attendee name. */
export function resolveNameOrigin(width: number, height: number): Point {
  return {
    x: width * NAME_BADGE_PREVIEW_TEXT_TUNING.nameXRatio,
    y: height * NAME_BADGE_PREVIEW_TEXT_TUNING.nameYRatio,
  };
}

/** Canvas `font` shorthand for the attendee name. */
export function resolveNameFont(height: number): string {
  const size = Math.round(height * NAME_BADGE_PREVIEW_TEXT_TUNING.nameFontRatio);
  return `700 ${size}px JetBrainsMono-Regular, IBMPlexSansJP-SemiBold, sans-serif`;
}

/**
 * Right edge of the staff language label, at its vertical centre.
 *
 * The label is right-aligned so that it stays pinned to the same margin however
 * many languages a staff member speaks.
 */
export function resolveLangOrigin(width: number, height: number): Point {
  return {
    x: width * NAME_BADGE_PREVIEW_TEXT_TUNING.langXRatio,
    y: height * NAME_BADGE_PREVIEW_TEXT_TUNING.langYRatio,
  };
}

/** Canvas `font` shorthand for the staff language label. */
export function resolveLangFont(height: number): string {
  const size = Math.round(height * NAME_BADGE_PREVIEW_TEXT_TUNING.langFontRatio);
  return `400 ${size}px JetBrainsMono-Regular, IBMPlexSansJP-Regular, sans-serif`;
}

/**
 * Resolves the spoken-language label printed on staff badges.
 *
 * The stored value is a comma separated list of language codes, which
 * {@link formatNameBadgeLanguages} turns into the printed form (`"ja, en"` ->
 * `"JP/EN"`). Only staff badges carry the label, and a list that formats to
 * nothing is treated the same as no language at all.
 *
 * @returns The label to print, or `null` when there is nothing to print.
 */
export function resolveLangLabel(
  userRole: NameBadgeUserRole,
  lang: string | undefined,
): string | null {
  if (userRole !== "Staff") return null;

  return formatNameBadgeLanguages(lang) || null;
}
