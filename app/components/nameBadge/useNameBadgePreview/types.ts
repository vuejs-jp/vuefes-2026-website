import type { Ref } from "vue";

/**
 * Public types of the name badge preview.
 *
 * Each model keeps its own types next to its implementation; only what crosses
 * model boundaries, or is part of the component's public API, lives here.
 */

/**
 * Ticket type, which decides the badge artwork, its text color, and which
 * extras are printed.
 */
export type NameBadgeUserRole = "Attendee" | "Attendee+Party" | "Sponsor" | "Speaker" | "Staff";

/** Artwork and color for one role, with paths relative to `public/`. */
export type NameBadgeVariantTheme = {
  color: string;
  baseImagePath: string;
  avatarPlaceholderImagePath: string;
};

/** Props accepted by `VFNameBadgePreview`. */
export type NameBadgePreviewProps = {
  userRole: NameBadgeUserRole;
  name: string;
  avatarImageUrl?: string;
  /** Spoken language, printed on staff badges only. */
  lang?: string;
  /** CSS pixel length, e.g. `"360px"`. Relative units are not supported. */
  width?: string;
  height?: string;
  /** CSS aspect ratio, e.g. `"253.52 / 360"`. */
  aspectRatio?: string;
};

/**
 * {@link NameBadgePreviewProps} as individual refs.
 *
 * The models are plain factory functions rather than components, so they take
 * refs instead of reading a reactive props object.
 */
export type NameBadgePreviewPropRefs = {
  userRole: Ref<NameBadgeUserRole>;
  name: Ref<string>;
  avatarImageUrl: Ref<string | undefined>;
  lang: Ref<string | undefined>;
  width: Ref<string | undefined>;
  height: Ref<string | undefined>;
  aspectRatio: Ref<string | undefined>;
};

/** A {@link NameBadgeVariantTheme} with its paths resolved to runtime URLs. */
export type NameBadgeVariant = {
  color: string;
  baseImageUrl: string;
  avatarPlaceholderImageUrl: string;
};
