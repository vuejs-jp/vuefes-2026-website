import type { NameBadgeUserRole, NameBadgeVariantTheme } from "./types";

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

export const NAME_BADGE_PREVIEW_STAGE_LAYOUT = {
  paddingX: 120,
  paddingTop: 28,
  paddingBottom: 120,
} as const;

export const NAME_BADGE_ROPE_TUNING = {
  ropeLength: 1080,
  ropeStartXRatio: 0.5,
  ropeStartY: -1000,
  initialTipXRatio: 0,
  initialTipY: -300,
  initialTipVelX: 0,
  initialTipVelY: 0,
  attachOffsetRatio: 0.035,
  attachOffsetMin: 8,
  stageBoundsInsetX: 8,
  stageBoundsInsetTop: 10,
  stageBoundsInsetBottom: 10,
  maxDragExtra: 20,
} as const;

export const NAME_BADGE_SPRING_TUNING = {
  dragFollowSpeed: 24,
  returnSpring: 48,
  returnDamping: 15,
  velocityDecay: 0.985,
  settleDistance: 0.35,
  settleVelocity: 8,
} as const;

export const NAME_BADGE_ROPE_VISUAL_TUNING = {
  ropeSegments: 32,
  ropeWidthPx: 12,
  ropeColor: "#2a2a2a",
  ropeThreadShadowColor: "#4d4d4d",
  ropeThreadMidColor: "#9a9a9a",
  ropeThreadHighlightColor: "#818181",
  ropeTextureWidth: 256,
  ropeTextureHeight: 64,
  ropeTextureRepeatX: 10,
  ropeTextureRepeatY: 1,
  ropeWeaveSpacingPx: 9,
  ropeWeaveThicknessPx: 2.2,
  ropeWeaveOffsetPx: 1.8,
  ropeBumpScale: 0.2,
  ropeOpacity: 1,
  ropeRoughness: 0.92,
  ropeMetalness: 0.02,
  ropeDepth: 0,
} as const;

export const NAME_BADGE_PREVIEW_WORLD_TUNING = {
  cardHeightWorld: 4,
  cardDepthWorld: 0.01,
  cardCornerRadiusWorld: 0.14,
  cardCornerSegments: 16,
} as const;

export const NAME_BADGE_CARD_SURFACE_TUNING = {
  baseRoughness: 0.2,
  roughnessNoiseAmplitude: 1,
  smoothRoughness: 0,
  bumpScale: 0.2,
  bumpNoiseAmplitude: 0.52,
  surfaceLayerOpacity: 0.3,
  surfaceLayerOffsetWorld: 0.001,
  smoothMaskOpacity: 0.92,
  smoothVPolygonRatios: [
    [0.043, 0.58],
    [0.245, 0.58],
    [0.304, 0.6543],
    [0.363, 0.58],
    [0.56, 0.58],
    [0.304, 0.895],
  ] as const,
  smoothSponsorPolygonRatios: [
    [0, 0.905],
    [1, 0.905],
    [1, 1],
    [0, 1],
  ] as const,
  smoothORadiusScale: 0.55,
} as const;

export const NAME_BADGE_PREVIEW_SCENE_TUNING = {
  backgroundColorCssVar: "--color-white",
  backgroundColorFallback: "#ffffff",
  ambientLightIntensity: 1,
  keyLightColor: "#565656",
  keyLightIntensity: 0.5,
  keyLightPosition: [2.4, 3, 10] as const,
  fillLightColor: "#ffffff",
  fillLightIntensity: 1.5,
  fillLightPosition: [-2.4, -3, 2] as const,
} as const;

export const NAME_BADGE_PREVIEW_CAMERA_TUNING = {
  position: [0, 3, 12] as const,
  lookAt: [0, 0, 0] as const,
  rangeOfMotion: [8, 8, 0] as const,
  rangeMotionSmoothing: 7,
  resumeAfterDragDelayMs: 300,
  fov: 28,
  near: 0.1,
  far: 100,
} as const;

export const NAME_BADGE_PREVIEW_TEXTURE_TUNING = {
  textureHeight: 1400,
  textureMinWidth: 512,
} as const;

export const NAME_BADGE_PREVIEW_TEXT_TUNING = {
  nameXRatio: 0.0413,
  nameYRatio: 0.353,
  nameFontRatio: 0.062,
  langXRatio: 0.75,
  langYRatio: 0.49,
  langFontRatio: 0.037,
} as const;

export const NAME_BADGE_PREVIEW_AVATAR_TUNING = {
  xRatio: 0.507,
  yRatio: 0.576,
  widthRatio: 0.450671936,
  heightRatio: 0.317,
} as const;

export const NAME_BADGE_PREVIEW_DEFAULTS = {
  aspect: 253.52 / 360,
  heightPx: 360,
} as const;

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
