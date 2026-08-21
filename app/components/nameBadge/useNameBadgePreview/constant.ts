import type { NameBadgeUserRole, NameBadgeVariantTheme } from "./types";

/**
 * Tuning constants for the interactive name badge preview.
 *
 * Everything the preview does is driven from here so the look and feel can be
 * adjusted without touching the models. Three coordinate spaces appear below;
 * each constant's units say which one it belongs to:
 *
 * - **Stage pixels** — the CSS pixel space of the stage element. Origin at its
 *   top-left corner, y pointing down. The rope physics runs here.
 * - **World units** — the THREE scene. Origin at the centre of the stage, y
 *   pointing up. The card is a fixed 4 units tall.
 * - **Texture pixels** — the generated canvas textures. Positions on the badge
 *   face are stored as ratios of the texture size so they survive a resize.
 */

/** Stage dimensions the ticket pages pass to the component, per breakpoint. */
export const NAME_BADGE_PREVIEW_LAYOUT = {
  mobile: {
    width: "100%",
    height: "284px",
    aspectRatio: "200 / 284",
  },
  desktop: {
    width: "100%",
    height: "360px",
    aspectRatio: "253.52 / 360",
  },
} as const;

/**
 * Empty space reserved around the card, in stage pixels.
 *
 * The generous horizontal padding is what lets the badge swing well past the
 * card's own width without being clipped; the bottom padding leaves room for it
 * to be dragged downwards.
 */
export const NAME_BADGE_PREVIEW_STAGE_LAYOUT = {
  paddingX: 240,
  paddingTop: 28,
  paddingBottom: 120,
} as const;

/**
 * Geometry of the lanyard, in stage pixels.
 *
 * The rope is far longer than the stage and its anchor sits high above the
 * visible area, so only the last stretch is ever on screen. That is what makes
 * the badge swing on a long, slow arc instead of jiggling on a short string.
 */
export const NAME_BADGE_ROPE_TUNING = {
  /** Rest length of the rope. */
  ropeLength: 1080,
  /** Anchor x as a ratio of the stage width. */
  ropeStartXRatio: 0.5,
  /** Anchor y; negative, i.e. far above the top of the stage. */
  ropeStartY: -1000,
  /** Where the badge starts during the drop-in animation. */
  initialTipXRatio: 0.46,
  initialTipY: -300,
  initialTipVelX: 0,
  initialTipVelY: 0,
  /** Distance from the card's top edge to the strap slot, as a ratio of height. */
  attachOffsetRatio: 0.05125,
  attachOffsetMin: 8,
  /** How far inside the stage edges the card is kept. */
  stageBoundsInsetX: 36,
  stageBoundsInsetTop: 10,
  stageBoundsInsetBottom: 10,
  /** Fraction of the card that must stay on stage. `1` forbids any overhang. */
  minVisibleCardRatio: 1,
  /** Slack allowed beyond the rope length while dragging. `0` keeps it taut. */
  maxDragExtra: 0,
} as const;

/**
 * Rope physics parameters.
 *
 * The simulation is position based (Verlet integration plus distance
 * constraints), so these are not physical quantities: `gravity` is in stage
 * pixels per second squared, and the mass values are relative.
 */
export const NAME_BADGE_SPRING_TUNING = {
  /** How quickly a pinned tip catches up to the pointer. */
  dragFollowSpeed: 24,
  /** Fixed physics step, so motion is refresh-rate independent. */
  fixedStepSeconds: 1 / 120,
  /** Longest frame the accumulator will absorb, capping catch-up work. */
  maxFrameDeltaSeconds: 1 / 20,
  maxSubsteps: 8,
  gravity: 1300,
  /** Exponential velocity damping; the higher it is, the sooner motion dies. */
  airDrag: 0.65,
  ropePhysicsSegments: 24,
  /** Constraint solver passes. More passes mean a less stretchy rope. */
  constraintIterations: 12,
  /** Inverse mass of the card. Below `1`, so the card resists the rope. */
  cardInverseMass: 0.22,
  /** Number of folds in the slack rope at the start of the drop-in animation. */
  entryWaveCount: 2.5,
  /** Distance and speed below which the badge is snapped to its rest pose. */
  settleDistance: 0.45,
  settleVelocity: 5,
} as const;

/**
 * Appearance of the rendered rope.
 *
 * The rope is drawn as a flat ribbon with a procedurally generated woven fabric
 * texture, rather than as a tube: it is a lanyard, and a ribbon both looks right
 * and costs far fewer vertices.
 */
export const NAME_BADGE_ROPE_VISUAL_TUNING = {
  /** Ribbon samples. Much denser than the physics, to hide the polyline. */
  ropeSegments: 64,
  ropeWidthPx: 20,
  ropeColor: "#050606",
  ropeThreadShadowColor: "#000000",
  ropeThreadMidColor: "#101212",
  ropeThreadHighlightColor: "#555a5a",
  ropeTextureWidth: 1024,
  ropeTextureHeight: 80,
  ropeTextureRepeatX: 4,
  ropeTextureRepeatY: 1,
  /** Weave geometry of the generated fabric texture, in texture pixels. */
  ropeWeaveSpacingPx: 8,
  ropeWeaveThicknessPx: 2.4,
  /** Row-to-row shift that produces the diagonal twill pattern. */
  ropeWeaveOffsetPx: 4,
  ropeBumpScale: 0.14,
  ropeOpacity: 1,
  ropeRoughness: 0.98,
  ropeMetalness: 0,
  /** Depth offset in world units, keeping the rope just in front of the card. */
  ropeDepth: 0.012,
} as const;

/**
 * The slot the lanyard is threaded through, sized relative to the rope width so
 * the strap always fits.
 */
export const NAME_BADGE_SLOT_TUNING = {
  widthToRopeRatio: 2.15,
  heightToRopeRatio: 0.42,
  /** Length of the strap stub drawn behind the card, selling the pass-through. */
  passThroughLengthToRopeRatio: 0.7,
  /** Dark rim around the slot, standing in for the punched edge. */
  rimWidthToRopeRatio: 0.035,
  rimColor: "#111317",
  rimOpacity: 0.28,
} as const;

/** Card dimensions in world units. Width follows from the aspect ratio. */
export const NAME_BADGE_PREVIEW_WORLD_TUNING = {
  cardHeightWorld: 4,
  cardDepthWorld: 0.012,
  cardCornerRadiusWorld: 0.14,
  cardCornerSegments: 16,
} as const;

/**
 * The laminate finish, rendered as a transparent additive layer floating just in
 * front of the printed face.
 *
 * The card is matte overall with a few glossy regions — the Vue logo, the
 * sponsor strip and the avatar circle — which are masked back to smooth in the
 * generated roughness and bump maps.
 */
export const NAME_BADGE_CARD_SURFACE_TUNING = {
  baseRoughness: 0.2,
  roughnessNoiseAmplitude: 1,
  smoothRoughness: 0,
  bumpScale: 0.2,
  bumpNoiseAmplitude: 0.52,
  surfaceLayerOpacity: 0.3,
  /** Gap between the printed face and the laminate layer, avoiding z-fighting. */
  surfaceLayerOffsetWorld: 0.001,
  smoothMaskOpacity: 0.92,
  /** Outline of the glossy Vue logo, as ratios of the texture size. */
  smoothVPolygonRatios: [
    [0.043, 0.58],
    [0.245, 0.58],
    [0.304, 0.6543],
    [0.363, 0.58],
    [0.56, 0.58],
    [0.304, 0.895],
  ] as const,
  /** Glossy strip along the bottom of the badge. */
  smoothSponsorPolygonRatios: [
    [0, 0.905],
    [1, 0.905],
    [1, 1],
    [0, 1],
  ] as const,
  /** Glossy avatar circle, as a fraction of the avatar frame's shorter side. */
  smoothORadiusScale: 0.55,
} as const;

/**
 * How strongly the card leans in response to the rope simulation.
 *
 * Coefficients are degrees per stage pixel of offset, and degrees per stage
 * pixel per second of velocity. See `scene/cardTilt.ts`.
 */
export const NAME_BADGE_CARD_TILT_TUNING = {
  rollPerTipOffsetDeg: 0.11,
  rollPerTipVelocityDeg: 0.01,
  rollLimitDeg: 10,
  yawPerTipOffsetDeg: 0.035,
  yawPerTipVelocityDeg: 0.004,
  yawLimitDeg: 14,
  /** Constant forward tip, so the card never looks perfectly flat. */
  pitchBaseDeg: -4,
  pitchPerTipOffsetDeg: -0.018,
  pitchPerTipVelocityDeg: -0.003,
  pitchMinDeg: -12,
  pitchMaxDeg: 8,
  /** Per-frame easing towards the target orientation. */
  rotationSmoothing: 0.16,
} as const;

/** Lighting and background of the preview scene. */
export const NAME_BADGE_PREVIEW_SCENE_TUNING = {
  /** Read from CSS so the stage matches the page in both themes. */
  backgroundColorCssVar: "--color-white",
  backgroundColorFallback: "#ffffff",
  ambientLightIntensity: 1,
  keyLightColor: "#565656",
  keyLightIntensity: 0.5,
  keyLightPosition: [2.4, 3, 10] as const,
  /**
   * A point light placed between the camera and the point on the card the
   * pointer is over, producing a specular highlight that follows the cursor.
   */
  highlightLightColor: "#ffffff",
  highlightLightIntensity: 55,
  /** How far along the camera-to-card ray the highlight light sits. */
  highlightLightRayDepthRatio: 0.46,
  fillLightColor: "#ffffff",
  fillLightIntensity: 1.5,
  fillLightPosition: [-2.4, -3, 2] as const,
} as const;

/**
 * Camera placement and the parallax it performs as the mouse moves.
 *
 * The long lens (a narrow field of view from far back) keeps perspective
 * distortion off the card, so it reads as a flat print rather than a 3D box.
 */
export const NAME_BADGE_PREVIEW_CAMERA_TUNING = {
  position: [0, 3, 12] as const,
  lookAt: [0, 0, 0] as const,
  /** Maximum parallax travel per axis, in world units. */
  rangeOfMotion: [8, 8, 0] as const,
  rangeMotionSmoothing: 7,
  /** Cooldown after a drag before the camera starts following the mouse again. */
  resumeAfterDragDelayMs: 300,
  fov: 28,
  near: 0.1,
  far: 100,
} as const;

/**
 * Resolution of the generated badge face texture.
 *
 * Height is fixed and width follows the card's aspect ratio, so the printed
 * face keeps a constant pixel density whatever size the card is rendered at.
 */
export const NAME_BADGE_PREVIEW_TEXTURE_TUNING = {
  textureHeight: 1400,
  textureMinWidth: 512,
} as const;

/** Text placement on the badge face, as ratios of the texture size. */
export const NAME_BADGE_PREVIEW_TEXT_TUNING = {
  /** Left edge and vertical centre of the attendee name. */
  nameXRatio: 0.0413,
  nameYRatio: 0.353,
  nameFontRatio: 0.062,
  /** Right edge and vertical centre of the staff language label. */
  langXRatio: 0.96,
  langYRatio: 0.5,
  langFontRatio: 0.056,
} as const;

/** The circular avatar frame, as ratios of the texture size. */
export const NAME_BADGE_PREVIEW_AVATAR_TUNING = {
  xRatio: 0.507,
  yRatio: 0.576,
  widthRatio: 0.450671936,
  heightRatio: 0.317,
} as const;

/** Card size used when the `width`, `height` or `aspectRatio` props are absent. */
export const NAME_BADGE_PREVIEW_DEFAULTS = {
  aspect: 253.52 / 360,
  heightPx: 360,
} as const;

/**
 * Per-role artwork and text color.
 *
 * Paths are relative to `public/` and are prefixed with the app base URL at
 * runtime, since the site is served from a versioned sub-path in production.
 */
export const NAME_BADGE_PREVIEW_ROLE_THEME: Record<NameBadgeUserRole, NameBadgeVariantTheme> = {
  Attendee: {
    color: "#385FCC",
    baseImagePath: "/images/name-badge/default.png",
    avatarPlaceholderImagePath: "/images/name-badge/default-avatar.png",
  },
  "Attendee+Party": {
    color: "#007f62",
    baseImagePath: "/images/name-badge/party.png",
    avatarPlaceholderImagePath: "/images/name-badge/party-avatar.png",
  },
  Sponsor: {
    color: "#f66c21",
    baseImagePath: "/images/name-badge/sponsor.png",
    avatarPlaceholderImagePath: "/images/name-badge/sponsor-avatar.png",
  },
  Speaker: {
    color: "#8314d3",
    baseImagePath: "/images/name-badge/speaker.png",
    avatarPlaceholderImagePath: "/images/name-badge/speaker-avatar.png",
  },
  Staff: {
    color: "#ffffff",
    baseImagePath: "/images/name-badge/staff.png",
    avatarPlaceholderImagePath: "/images/name-badge/staff-avatar.png",
  },
} as const;
