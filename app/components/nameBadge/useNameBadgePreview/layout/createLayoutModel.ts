import { computed, type ComputedRef, type Ref } from "vue";

import { clamp } from "../shared/math";
import {
  NAME_BADGE_PREVIEW_DEFAULTS,
  NAME_BADGE_PREVIEW_ROLE_THEME,
  NAME_BADGE_PREVIEW_STAGE_LAYOUT,
  NAME_BADGE_ROPE_TUNING,
} from "../constant";
import type { NameBadgePreviewPropRefs, NameBadgeVariant } from "../types";
import { parseAspectRatio, parsePxLength } from "./cssLength";
import { resolveNameScaleX } from "./nameScale";
import { useStageWidthObserver } from "./useStageWidthObserver";

/**
 * Every size, anchor and asset URL the other models derive from the props.
 *
 * All values are expressed in *stage pixels* (the CSS pixel space of the stage
 * element, origin at its top-left corner). The scene model converts them into
 * world units when it needs to.
 */
export type NameBadgePreviewLayout = {
  /** Badge artwork used when the role specific artwork fails to load. */
  defaultBaseImageUrl: string;
  /** Role dependent color and artwork URLs. */
  variants: ComputedRef<NameBadgeVariant>;
  /** Card width divided by card height. */
  resolvedAspect: ComputedRef<number>;
  resolvedCardHeight: ComputedRef<number>;
  resolvedCardWidth: ComputedRef<number>;
  /** Horizontal squeeze for the printed name; see {@link resolveNameScaleX}. */
  nameScaleX: ComputedRef<number>;
  /** Measured stage width, falling back to the preferred width. */
  stageWidth: ComputedRef<number>;
  stageHeight: ComputedRef<number>;
  /** Stage-space point the rope hangs from. Sits far above the visible area. */
  anchorX: ComputedRef<number>;
  anchorY: ComputedRef<number>;
  /** Rope length at rest, in stage pixels. */
  ropeRestLength: ComputedRef<number>;
  /** Distance from the card's top edge down to the strap slot. */
  attachOffset: ComputedRef<number>;
  /** Inline style applied to the stage element. */
  stageStyle: ComputedRef<{ width: string; height: string }>;
};

export type NameBadgePreviewLayoutDeps = {
  props: NameBadgePreviewPropRefs;
  stageRef: Ref<HTMLElement | null>;
  /**
   * Prefixes an absolute public path with the app base URL.
   *
   * Injected rather than imported so the model can be exercised without a Nuxt
   * runtime context.
   */
  withBase: (path: string) => string;
};

/**
 * Builds the reactive layout model.
 *
 * This model owns no mutable state beyond the observed stage width: everything
 * else is derived, so the physics, texture and scene models can read it without
 * having to re-derive sizes themselves.
 */
export function createLayoutModel(deps: NameBadgePreviewLayoutDeps): NameBadgePreviewLayout {
  const { props, stageRef, withBase } = deps;

  const defaultBaseImageUrl = withBase("/images/name-badge/default.png");

  const variants = computed<NameBadgeVariant>(() => {
    const theme = NAME_BADGE_PREVIEW_ROLE_THEME[props.userRole.value];
    return {
      color: theme.color,
      baseImageUrl: withBase(theme.baseImagePath),
      avatarPlaceholderImageUrl: withBase(theme.avatarPlaceholderImagePath),
    };
  });

  const resolvedAspect = computed(
    () => parseAspectRatio(props.aspectRatio.value) ?? NAME_BADGE_PREVIEW_DEFAULTS.aspect,
  );
  const resolvedCardHeight = computed(
    () => parsePxLength(props.height.value) ?? NAME_BADGE_PREVIEW_DEFAULTS.heightPx,
  );
  // A `width` of `100%` is not resolvable here, so the card width is normally
  // derived from the height and the aspect ratio instead.
  const resolvedCardWidth = computed(
    () => parsePxLength(props.width.value) ?? resolvedCardHeight.value * resolvedAspect.value,
  );

  const nameScaleX = computed(() => resolveNameScaleX(props.name.value));

  // The stage is much wider than the card so the badge can swing sideways
  // without being clipped.
  const preferredStageWidth = computed(() =>
    Math.max(280, resolvedCardWidth.value + NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingX * 2),
  );
  const observedStageWidth = useStageWidthObserver(stageRef);
  const stageWidth = computed(() => observedStageWidth.value || preferredStageWidth.value);
  const stageHeight = computed(
    () =>
      resolvedCardHeight.value +
      NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingTop +
      NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingBottom,
  );

  const anchorX = computed(
    () => stageWidth.value * clamp(NAME_BADGE_ROPE_TUNING.ropeStartXRatio, 0, 1),
  );
  // Far above the stage: only the last stretch of the rope is ever visible,
  // which is what makes the badge swing like it hangs from a long lanyard.
  const anchorY = computed(() => NAME_BADGE_ROPE_TUNING.ropeStartY);

  const ropeRestLength = computed(() => NAME_BADGE_ROPE_TUNING.ropeLength);
  const attachOffset = computed(() =>
    Math.max(
      NAME_BADGE_ROPE_TUNING.attachOffsetMin,
      resolvedCardHeight.value * NAME_BADGE_ROPE_TUNING.attachOffsetRatio,
    ),
  );

  const stageStyle = computed(() => ({
    width: `min(100%, ${preferredStageWidth.value}px)`,
    height: `${stageHeight.value}px`,
  }));

  return {
    defaultBaseImageUrl,
    variants,
    resolvedAspect,
    resolvedCardHeight,
    resolvedCardWidth,
    nameScaleX,
    stageWidth,
    stageHeight,
    anchorX,
    anchorY,
    ropeRestLength,
    attachOffset,
    stageStyle,
  };
}
