import type { TresContext, TresContextWithClock } from "@tresjs/core";
import type { Ref, ComputedRef } from "vue";
import * as THREE from "three";

export type NameBadgeUserRole = "Attendee" | "Attendee+Party" | "Sponsor" | "Speaker" | "Staff";
export type NameBadgeVariantTheme = {
  color: string;
  baseImagePath: string;
  avatarPlaceholderImagePath: string;
};
export type NameBadgePreviewProps = {
  userRole: NameBadgeUserRole;
  name: string;
  avatarImageUrl?: string;
  lang?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
};

export type NameBadgePreviewPropRefs = {
  userRole: Ref<NameBadgeUserRole>;
  name: Ref<string>;
  avatarImageUrl: Ref<string | undefined>;
  lang: Ref<string | undefined>;
  width: Ref<string | undefined>;
  height: Ref<string | undefined>;
  aspectRatio: Ref<string | undefined>;
};

export type NameBadgeVariant = {
  color: string;
  baseImageUrl: string;
  avatarPlaceholderImageUrl: string;
};

export type NameBadgePreviewLayout = {
  defaultBaseImageUrl: string;
  variants: ComputedRef<NameBadgeVariant>;
  resolvedAspect: ComputedRef<number>;
  resolvedCardHeight: ComputedRef<number>;
  resolvedCardWidth: ComputedRef<number>;
  nameScaleX: ComputedRef<number>;
  stageWidth: ComputedRef<number>;
  stageHeight: ComputedRef<number>;
  anchorX: ComputedRef<number>;
  anchorY: ComputedRef<number>;
  ropeRestLength: ComputedRef<number>;
  attachOffset: ComputedRef<number>;
  stageStyle: ComputedRef<{ width: string; height: string }>;
};

export type NameBadgePreviewSimulationSnapshot = {
  tipX: number;
  tipY: number;
  velX: number;
  velY: number;
};

export type NameBadgePreviewCameraMotionSnapshot = {
  normalizedX: number;
  normalizedY: number;
};

export type NameBadgePreviewResetMode = "rest" | "entry";

export type NameBadgePreviewInteraction = {
  handleStagePointerMove: (event: PointerEvent) => void;
  handleStagePointerDown: (event: PointerEvent) => void;
  handleStagePointerUp: (event: PointerEvent) => void;
  handleStagePointerLeave: () => void;
  stepSimulation: (deltaSeconds: number) => void;
  resetSimulation: (mode?: NameBadgePreviewResetMode) => void;
  getSimulationSnapshot: () => NameBadgePreviewSimulationSnapshot;
  getCameraMotionSnapshot: () => NameBadgePreviewCameraMotionSnapshot;
};

export type NameBadgePreviewTexture = {
  fallbackImageUrl: ComputedRef<string>;
  ensureTextureResources: () => void;
  redrawFrontTexture: () => Promise<void>;
  getFrontTexture: () => THREE.CanvasTexture | null;
  getFrontRoughnessTexture: () => THREE.CanvasTexture | null;
  getFrontBumpTexture: () => THREE.CanvasTexture | null;
  disposeTextureResources: () => void;
};

export type NameBadgePreviewScene = {
  isThreeReady: Ref<boolean>;
  rebuildCardMesh: () => void;
  handleCanvasReady: (context: TresContext) => void;
  handleCanvasLoop: (context: TresContextWithClock) => void;
};
