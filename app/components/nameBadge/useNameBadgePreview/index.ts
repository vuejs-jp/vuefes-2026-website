/**
 * Public entry point of the name badge preview.
 *
 * Everything else in this directory is an implementation detail of
 * `VFNameBadgePreview.vue` and should be imported through this barrel.
 */
export { useNameBadgePreview } from "./useNameBadgePreview";
export { NAME_BADGE_PREVIEW_LAYOUT } from "./constant";
export type { NameBadgeUserRole, NameBadgePreviewProps } from "./types";
