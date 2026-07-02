import type { TresContext, TresContextWithClock } from "@tresjs/core";
import * as THREE from "three";
import { computed, onBeforeUnmount, ref, toRef, watch, type Ref } from "vue";

import { useTresCamera } from "~/composables/useTresCamera";
import { useTresObject3D } from "~/composables/useTresObject3D";
import { useWithBase } from "~/composables/useWithBase";
import type {
  NameBadgePreviewCameraMotionSnapshot,
  NameBadgePreviewPropRefs,
  NameBadgePreviewLayout,
  NameBadgeVariant,
  NameBadgePreviewInteraction,
  NameBadgePreviewSimulationSnapshot,
  NameBadgePreviewTexture,
  NameBadgePreviewScene,
  NameBadgePreviewProps,
  NameBadgePreviewResetMode,
} from "./types";
import {
  NAME_BADGE_PREVIEW_CAMERA_TUNING,
  NAME_BADGE_PREVIEW_ROLE_THEME,
  NAME_BADGE_PREVIEW_DEFAULTS,
  NAME_BADGE_PREVIEW_STAGE_LAYOUT,
  NAME_BADGE_ROPE_TUNING,
  NAME_BADGE_SPRING_TUNING,
  NAME_BADGE_ROPE_VISUAL_TUNING,
  NAME_BADGE_CARD_SURFACE_TUNING,
  NAME_BADGE_PREVIEW_TEXTURE_TUNING,
  NAME_BADGE_PREVIEW_AVATAR_TUNING,
  NAME_BADGE_PREVIEW_TEXT_TUNING,
  NAME_BADGE_PREVIEW_WORLD_TUNING,
  NAME_BADGE_PREVIEW_SCENE_TUNING,
} from "./constant";

export function useNameBadgePreview(props: NameBadgePreviewProps) {
  const propRefs: NameBadgePreviewPropRefs = {
    userRole: toRef(props, "userRole"),
    name: toRef(props, "name"),
    avatarImageUrl: toRef(props, "avatarImageUrl"),
    lang: toRef(props, "lang"),
    width: toRef(props, "width"),
    height: toRef(props, "height"),
    aspectRatio: toRef(props, "aspectRatio"),
  };

  const stageRef = ref<HTMLElement | null>(null);

  const { applyActiveCameraSettings, setRangeMotionFromNormalized, resetRangeMotion } =
    useTresCamera(NAME_BADGE_PREVIEW_CAMERA_TUNING);
  const { disposeObject3D } = useTresObject3D();

  const layout = createLayoutModel(propRefs);
  const interaction = createInteractionModel({ stageRef, layout });
  const texture = createTextureModel({ layout, props: propRefs });
  const scene = createSceneModel({
    layout,
    interaction,
    texture,
    applyActiveCameraSettings,
    setRangeMotionFromNormalized,
    resetRangeMotion,
    disposeObject3D,
  });

  watchSceneResize(scene, interaction, texture, layout);
  watchTextureInputs(scene, texture, layout, propRefs);

  return {
    stageRef,
    stageStyle: layout.stageStyle,
    fallbackImageUrl: texture.fallbackImageUrl,
    handleStagePointerMove: interaction.handleStagePointerMove,
    handleStagePointerDown: interaction.handleStagePointerDown,
    handleStagePointerUp: interaction.handleStagePointerUp,
    handleStagePointerLeave: interaction.handleStagePointerLeave,
    handleCanvasReady: scene.handleCanvasReady,
    handleCanvasLoop: scene.handleCanvasLoop,
  };

  function watchSceneResize(
    scene: NameBadgePreviewScene,
    interaction: NameBadgePreviewInteraction,
    texture: NameBadgePreviewTexture,
    layout: NameBadgePreviewLayout,
  ) {
    watch(
      [layout.resolvedCardWidth, layout.resolvedCardHeight, layout.resolvedAspect],
      () => {
        if (!scene.isThreeReady.value) return;
        scene.rebuildCardMesh();
        interaction.resetSimulation("rest");
        void texture.redrawFrontTexture();
      },
      { flush: "post" },
    );
  }

  function watchTextureInputs(
    scene: NameBadgePreviewScene,
    texture: NameBadgePreviewTexture,
    layout: NameBadgePreviewLayout,
    props: NameBadgePreviewPropRefs,
  ) {
    watch(
      () => [
        layout.variants.value.baseImageUrl,
        layout.variants.value.avatarPlaceholderImageUrl,
        props.avatarImageUrl.value,
        props.name.value,
        props.lang.value,
        props.userRole.value,
      ],
      () => {
        if (!scene.isThreeReady.value) return;
        void texture.redrawFrontTexture();
      },
      { deep: true, flush: "post" },
    );
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createRoundedRectShape(width: number, height: number, radius: number) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  const r = clamp(radius, 0, Math.min(halfWidth, halfHeight));

  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + r, -halfHeight);
  shape.lineTo(halfWidth - r, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + r);
  shape.lineTo(halfWidth, halfHeight - r);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - r, halfHeight);
  shape.lineTo(-halfWidth + r, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - r);
  shape.lineTo(-halfWidth, -halfHeight + r);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + r, -halfHeight);
  shape.closePath();

  return shape;
}

function remapCardUvToRect(
  geometry: THREE.BufferGeometry,
  cardWidthWorld: number,
  cardHeightWorld: number,
) {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  if (!position || !uv) return;

  const halfWidth = cardWidthWorld * 0.5;
  const halfHeight = cardHeightWorld * 0.5;

  for (let i = 0; i < uv.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const u = clamp((x + halfWidth) / cardWidthWorld, 0, 1);
    const v = clamp((y + halfHeight) / cardHeightWorld, 0, 1);
    uv.setXY(i, u, v);
  }

  uv.needsUpdate = true;
}

function createLayoutModel(props: NameBadgePreviewPropRefs): NameBadgePreviewLayout {
  const withBase = useWithBase();

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
    () => parseAspect(props.aspectRatio.value) ?? NAME_BADGE_PREVIEW_DEFAULTS.aspect,
  );
  const resolvedCardHeight = computed(
    () => parsePx(props.height.value) ?? NAME_BADGE_PREVIEW_DEFAULTS.heightPx,
  );
  const resolvedCardWidth = computed(
    () => parsePx(props.width.value) ?? resolvedCardHeight.value * resolvedAspect.value,
  );

  const nameScaleX = computed(() => {
    let weightedLength = 0;
    for (const char of props.name.value ?? "") {
      if (char.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u)) {
        weightedLength += 2;
      } else {
        weightedLength += 1;
      }
    }

    if (weightedLength <= 12) return 1;
    if (weightedLength <= 16) return 0.9;
    if (weightedLength <= 20) return 0.85;
    if (weightedLength <= 24) return 0.8;
    if (weightedLength <= 28) return 0.7;
    if (weightedLength <= 32) return 0.6;
    return 0.5;
  });

  const stageWidth = computed(() =>
    Math.max(280, resolvedCardWidth.value + NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingX * 2),
  );
  const stageHeight = computed(
    () =>
      resolvedCardHeight.value +
      NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingTop +
      NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingBottom,
  );

  const anchorX = computed(
    () => stageWidth.value * clamp(NAME_BADGE_ROPE_TUNING.ropeStartXRatio, 0, 1),
  );
  const anchorY = computed(() => NAME_BADGE_ROPE_TUNING.ropeStartY);

  const ropeRestLength = computed(() => NAME_BADGE_ROPE_TUNING.ropeLength);
  const attachOffset = computed(() =>
    Math.max(
      NAME_BADGE_ROPE_TUNING.attachOffsetMin,
      resolvedCardHeight.value * NAME_BADGE_ROPE_TUNING.attachOffsetRatio,
    ),
  );

  const stageStyle = computed(() => ({
    width: `${stageWidth.value}px`,
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

  function parsePx(value?: string) {
    if (!value) return null;
    const trimmed = value.trim();

    if (/^[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
      const raw = Number.parseFloat(trimmed);
      return Number.isFinite(raw) ? raw : null;
    }

    if (trimmed.endsWith("px")) {
      const raw = Number.parseFloat(trimmed.replace(/px$/u, ""));
      return Number.isFinite(raw) ? raw : null;
    }

    return null;
  }
  function parseAspect(value?: string) {
    if (!value) return null;
    const match = value.match(/^\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)\s*$/u);
    if (!match) return null;

    const numerator = Number.parseFloat(match[1]!);
    const denominator = Number.parseFloat(match[2]!);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }

    return numerator / denominator;
  }
}

function createInteractionModel(params: {
  stageRef: Ref<HTMLElement | null>;
  layout: NameBadgePreviewLayout;
}): NameBadgePreviewInteraction {
  const isDragging = ref(false);
  const cameraMotionResumeDelayMs = NAME_BADGE_PREVIEW_CAMERA_TUNING.resumeAfterDragDelayMs ?? 0;
  let cameraMotionBlockedUntilMs = 0;
  let delayedCameraMotionPending = false;
  let delayedPointerType = "";
  let delayedPointerLocal: { x: number; y: number } | null = null;
  const cameraMotion = {
    normalizedX: 0,
    normalizedY: 0,
  };
  let isEntryPhase = false;

  const motion = {
    tipX: 0,
    tipY: 0,
    velX: 0,
    velY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragTargetX: 0,
    dragTargetY: 0,
  };

  const handleStagePointerMove = (event: PointerEvent) => {
    const local = pointerToLocal(event);
    if (!local) return;

    if (isDragging.value) {
      motion.dragTargetX = local.x - motion.dragOffsetX;
      motion.dragTargetY = local.y - motion.dragOffsetY;
    }

    delayedPointerType = event.pointerType;
    delayedPointerLocal = local;
    updateCameraMotionFromLocal(local.x, local.y, event.pointerType);
  };

  const handleStagePointerDown = (event: PointerEvent) => {
    const local = pointerToLocal(event);
    if (!local) return;
    if (!isPointerOnCard(local.x, local.y)) return;

    motion.dragOffsetX = local.x - motion.tipX;
    motion.dragOffsetY = local.y - motion.tipY;
    motion.dragTargetX = motion.tipX;
    motion.dragTargetY = motion.tipY;

    isDragging.value = true;
    isEntryPhase = false;
    delayedCameraMotionPending = false;
    delayedPointerType = event.pointerType;
    delayedPointerLocal = local;
    resetCameraMotion();
    params.stageRef.value?.setPointerCapture?.(event.pointerId);

    function isPointerOnCard(localX: number, localY: number) {
      const cardTop = motion.tipY - params.layout.attachOffset.value;
      const cardLeft = motion.tipX - params.layout.resolvedCardWidth.value * 0.5;
      return (
        localX >= cardLeft &&
        localX <= cardLeft + params.layout.resolvedCardWidth.value &&
        localY >= cardTop &&
        localY <= cardTop + params.layout.resolvedCardHeight.value
      );
    }
  };

  const handleStagePointerUp = (event: PointerEvent) => {
    isDragging.value = false;
    params.stageRef.value?.releasePointerCapture?.(event.pointerId);
    cameraMotionBlockedUntilMs = nowMs() + cameraMotionResumeDelayMs;
    delayedCameraMotionPending = true;
    delayedPointerType = event.pointerType;
    delayedPointerLocal = pointerToLocal(event) ?? delayedPointerLocal;
    resetCameraMotion();
  };

  const handleStagePointerLeave = () => {
    delayedCameraMotionPending = false;
    delayedPointerLocal = null;
    resetCameraMotion();
  };

  const stepSimulation = (deltaSeconds: number) => {
    if (isDragging.value) {
      const target = projectTipWithinBounds(motion.dragTargetX, motion.dragTargetY);
      const follow = smoothingFactor(NAME_BADGE_SPRING_TUNING.dragFollowSpeed, deltaSeconds);

      const previousX = motion.tipX;
      const previousY = motion.tipY;

      motion.tipX += (target.x - motion.tipX) * follow;
      motion.tipY += (target.y - motion.tipY) * follow;

      motion.velX = (motion.tipX - previousX) / Math.max(deltaSeconds, 0.0001);
      motion.velY = (motion.tipY - previousY) / Math.max(deltaSeconds, 0.0001);
    } else {
      const targetX = params.layout.anchorX.value;
      const targetY = params.layout.anchorY.value + params.layout.ropeRestLength.value;
      const dx = motion.tipX - targetX;
      const dy = motion.tipY - targetY;

      const accelX =
        -NAME_BADGE_SPRING_TUNING.returnSpring * dx -
        NAME_BADGE_SPRING_TUNING.returnDamping * motion.velX;
      const accelY =
        -NAME_BADGE_SPRING_TUNING.returnSpring * dy -
        NAME_BADGE_SPRING_TUNING.returnDamping * motion.velY;

      motion.velX += accelX * deltaSeconds;
      motion.velY += accelY * deltaSeconds;

      motion.velX *= NAME_BADGE_SPRING_TUNING.velocityDecay;
      motion.velY *= NAME_BADGE_SPRING_TUNING.velocityDecay;

      motion.tipX += motion.velX * deltaSeconds;
      motion.tipY += motion.velY * deltaSeconds;
    }

    const constrained = projectTipWithinBounds(motion.tipX, motion.tipY, isEntryPhase);
    motion.tipX = constrained.x;
    motion.tipY = constrained.y;

    if (
      isEntryPhase &&
      motion.tipY >= params.layout.anchorY.value + NAME_BADGE_ROPE_TUNING.stageBoundsInsetTop
    ) {
      isEntryPhase = false;
    }

    const restY = params.layout.anchorY.value + params.layout.ropeRestLength.value;
    const isSettled =
      Math.hypot(motion.tipX - params.layout.anchorX.value, motion.tipY - restY) <
        NAME_BADGE_SPRING_TUNING.settleDistance &&
      Math.hypot(motion.velX, motion.velY) < NAME_BADGE_SPRING_TUNING.settleVelocity;

    if (isSettled && !isDragging.value) {
      motion.tipX = params.layout.anchorX.value;
      motion.tipY = restY;
      motion.velX = 0;
      motion.velY = 0;
    }

    function smoothingFactor(speed: number, deltaSeconds: number) {
      return 1 - Math.exp(-speed * deltaSeconds);
    }
  };

  const resetSimulation = (mode: NameBadgePreviewResetMode = "rest") => {
    const rest = projectTipWithinBounds(
      params.layout.anchorX.value,
      params.layout.anchorY.value + params.layout.ropeRestLength.value,
    );
    const entry = projectTipWithinBounds(
      params.layout.stageWidth.value * clamp(NAME_BADGE_ROPE_TUNING.initialTipXRatio, 0, 1),
      NAME_BADGE_ROPE_TUNING.initialTipY,
      true,
    );
    const start = mode === "entry" ? entry : rest;

    motion.tipX = start.x;
    motion.tipY = start.y;
    motion.velX = 0;
    motion.velY = 0;
    motion.dragTargetX = start.x;
    motion.dragTargetY = start.y;
    isEntryPhase = mode === "entry";
  };

  const getSimulationSnapshot = (): NameBadgePreviewSimulationSnapshot => {
    return {
      tipX: motion.tipX,
      tipY: motion.tipY,
      velX: motion.velX,
      velY: motion.velY,
    };
  };

  const getCameraMotionSnapshot = (): NameBadgePreviewCameraMotionSnapshot => {
    applyDelayedCameraMotionIfNeeded();
    return {
      normalizedX: cameraMotion.normalizedX,
      normalizedY: cameraMotion.normalizedY,
    };
  };

  return {
    handleStagePointerMove,
    handleStagePointerDown,
    handleStagePointerUp,
    handleStagePointerLeave,
    stepSimulation,
    resetSimulation,
    getSimulationSnapshot,
    getCameraMotionSnapshot,
  };

  function pointerToLocal(event: PointerEvent) {
    if (!params.stageRef.value) return null;
    const bounds = params.stageRef.value.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }

  function projectTipWithinBounds(x: number, y: number, allowAboveTop = false) {
    const halfCardWidth = params.layout.resolvedCardWidth.value * 0.5;
    let nx = clamp(
      x,
      halfCardWidth + NAME_BADGE_ROPE_TUNING.stageBoundsInsetX,
      params.layout.stageWidth.value - halfCardWidth - NAME_BADGE_ROPE_TUNING.stageBoundsInsetX,
    );
    let ny = clamp(
      y,
      allowAboveTop
        ? Number.NEGATIVE_INFINITY
        : params.layout.anchorY.value + NAME_BADGE_ROPE_TUNING.stageBoundsInsetTop,
      params.layout.stageHeight.value - NAME_BADGE_ROPE_TUNING.stageBoundsInsetBottom,
    );

    const dx = nx - params.layout.anchorX.value;
    const dy = ny - params.layout.anchorY.value;
    const maxDistance = params.layout.ropeRestLength.value + NAME_BADGE_ROPE_TUNING.maxDragExtra;
    const distance = Math.hypot(dx, dy);

    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      nx = params.layout.anchorX.value + dx * ratio;
      ny = params.layout.anchorY.value + dy * ratio;
    }

    return { x: nx, y: ny };
  }

  function updateCameraMotionFromLocal(localX: number, localY: number, pointerType: string) {
    if (pointerType !== "mouse" || isDragging.value || nowMs() < cameraMotionBlockedUntilMs) {
      resetCameraMotion();
      return;
    }

    delayedCameraMotionPending = false;
    setCameraMotionFromLocal(localX, localY);
  }

  function setCameraMotionFromLocal(localX: number, localY: number) {
    const ratioX = clamp(localX / params.layout.stageWidth.value, 0, 1);
    const ratioY = clamp(localY / params.layout.stageHeight.value, 0, 1);

    cameraMotion.normalizedX = ratioX * 2 - 1;
    cameraMotion.normalizedY = (0.5 - ratioY) * 2;
  }

  function resetCameraMotion() {
    cameraMotion.normalizedX = 0;
    cameraMotion.normalizedY = 0;
  }

  function applyDelayedCameraMotionIfNeeded() {
    if (!delayedCameraMotionPending) return;
    if (nowMs() < cameraMotionBlockedUntilMs) return;

    delayedCameraMotionPending = false;

    if (delayedPointerType !== "mouse" || isDragging.value || !delayedPointerLocal) {
      resetCameraMotion();
      return;
    }

    setCameraMotionFromLocal(delayedPointerLocal.x, delayedPointerLocal.y);
  }

  function nowMs() {
    if (import.meta.client && typeof performance !== "undefined") {
      return performance.now();
    }
    return Date.now();
  }
}

function createTextureModel(params: {
  layout: NameBadgePreviewLayout;
  props: NameBadgePreviewPropRefs;
}): NameBadgePreviewTexture {
  const isBaseImageFallback = ref(false);
  const imageCache = new Map<string, Promise<HTMLImageElement>>();

  let drawToken = 0;
  let frontTexture: THREE.CanvasTexture | null = null;
  let textureCanvas: HTMLCanvasElement | null = null;
  let textureContext: CanvasRenderingContext2D | null = null;
  let frontRoughnessTexture: THREE.CanvasTexture | null = null;
  let roughnessCanvas: HTMLCanvasElement | null = null;
  let roughnessContext: CanvasRenderingContext2D | null = null;
  let frontBumpTexture: THREE.CanvasTexture | null = null;
  let bumpCanvas: HTMLCanvasElement | null = null;
  let bumpContext: CanvasRenderingContext2D | null = null;

  const fallbackImageUrl = computed(() =>
    isBaseImageFallback.value
      ? params.layout.defaultBaseImageUrl
      : params.layout.variants.value.baseImageUrl,
  );

  function loadImage(url: string) {
    const cached = imageCache.get(url);
    if (cached) return cached;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      image.src = url;
    });

    imageCache.set(url, promise);
    return promise;
  }

  function ensureTextureResources() {
    if (!import.meta.client) return;

    const textureHeight = NAME_BADGE_PREVIEW_TEXTURE_TUNING.textureHeight;
    const textureWidth = Math.max(
      NAME_BADGE_PREVIEW_TEXTURE_TUNING.textureMinWidth,
      Math.round(textureHeight * params.layout.resolvedAspect.value),
    );

    if (!textureCanvas) {
      textureCanvas = document.createElement("canvas");
    }
    if (!roughnessCanvas) {
      roughnessCanvas = document.createElement("canvas");
    }
    if (!bumpCanvas) {
      bumpCanvas = document.createElement("canvas");
    }

    if (textureCanvas.width !== textureWidth || textureCanvas.height !== textureHeight) {
      textureCanvas.width = textureWidth;
      textureCanvas.height = textureHeight;
    }
    if (roughnessCanvas.width !== textureWidth || roughnessCanvas.height !== textureHeight) {
      roughnessCanvas.width = textureWidth;
      roughnessCanvas.height = textureHeight;
    }
    if (bumpCanvas.width !== textureWidth || bumpCanvas.height !== textureHeight) {
      bumpCanvas.width = textureWidth;
      bumpCanvas.height = textureHeight;
    }

    textureContext = textureCanvas.getContext("2d", { alpha: true });
    roughnessContext = roughnessCanvas.getContext("2d", { alpha: false });
    bumpContext = bumpCanvas.getContext("2d", { alpha: false });

    if (!frontTexture) {
      frontTexture = new THREE.CanvasTexture(textureCanvas);
      frontTexture.colorSpace = THREE.SRGBColorSpace;
      frontTexture.anisotropy = 8;
    }
    if (!frontRoughnessTexture) {
      frontRoughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
      frontRoughnessTexture.anisotropy = 8;
    }
    if (!frontBumpTexture) {
      frontBumpTexture = new THREE.CanvasTexture(bumpCanvas);
      frontBumpTexture.anisotropy = 8;
    }
  }

  async function redrawFrontTexture() {
    ensureTextureResources();
    if (!textureCanvas || !textureContext || !frontTexture) return;

    const token = ++drawToken;
    const ctx = textureContext;
    const canvas = textureCanvas;
    const w = canvas.width;
    const h = canvas.height;

    isBaseImageFallback.value = false;

    // Keep transparent pixels in the source badge image transparent on the front texture.
    ctx.clearRect(0, 0, w, h);

    const baseCandidates = [
      params.layout.variants.value.baseImageUrl,
      params.layout.defaultBaseImageUrl,
    ];
    let baseLoaded = false;

    for (let index = 0; index < baseCandidates.length; index += 1) {
      const candidate = baseCandidates[index]!;
      try {
        const image = await loadImage(candidate);
        if (token !== drawToken) return;
        ctx.drawImage(image, 0, 0, w, h);
        baseLoaded = true;
        isBaseImageFallback.value = index > 0;
        break;
      } catch {
        // try next candidate
      }
    }

    if (!baseLoaded) {
      ctx.fillStyle = "#f2f5ff";
      ctx.fillRect(0, 0, w, h);
    }

    const avatarCandidates = [
      params.props.avatarImageUrl.value,
      params.layout.variants.value.avatarPlaceholderImageUrl,
    ].filter((candidate): candidate is string => !!candidate);

    let avatarImage: HTMLImageElement | null = null;
    for (const candidate of avatarCandidates) {
      try {
        avatarImage = await loadImage(candidate);
        if (token !== drawToken) return;
        break;
      } catch {
        // use next candidate
      }
    }

    const avatarX = w * NAME_BADGE_PREVIEW_AVATAR_TUNING.xRatio;
    const avatarY = h * NAME_BADGE_PREVIEW_AVATAR_TUNING.yRatio;
    const avatarW = w * NAME_BADGE_PREVIEW_AVATAR_TUNING.widthRatio;
    const avatarH = h * NAME_BADGE_PREVIEW_AVATAR_TUNING.heightRatio;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      avatarX + avatarW / 2,
      avatarY + avatarH / 2,
      avatarW / 2,
      avatarH / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.clip();

    if (params.props.userRole.value === "Sponsor") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(avatarX, avatarY, avatarW, avatarH);
    }

    if (avatarImage) {
      const modeContain = params.props.userRole.value === "Sponsor";
      const sourceRatio = avatarImage.width / avatarImage.height;
      const targetRatio = avatarW / avatarH;

      let drawW = avatarW;
      let drawH = avatarH;

      if (modeContain) {
        if (sourceRatio > targetRatio) {
          drawH = avatarW / sourceRatio;
        } else {
          drawW = avatarH * sourceRatio;
        }
      } else if (sourceRatio > targetRatio) {
        drawW = avatarH * sourceRatio;
      } else {
        drawH = avatarW / sourceRatio;
      }

      const drawX = avatarX + (avatarW - drawW) / 2;
      const drawY = avatarY + (avatarH - drawH) / 2;
      ctx.drawImage(avatarImage, drawX, drawY, drawW, drawH);
    }

    ctx.restore();

    const nameX = w * NAME_BADGE_PREVIEW_TEXT_TUNING.nameXRatio;
    const nameY = h * NAME_BADGE_PREVIEW_TEXT_TUNING.nameYRatio;

    ctx.save();
    ctx.translate(nameX, nameY);
    ctx.scale(params.layout.nameScaleX.value, 1);
    ctx.fillStyle = params.layout.variants.value.color;
    ctx.font = `700 ${Math.round(h * NAME_BADGE_PREVIEW_TEXT_TUNING.nameFontRatio)}px JetBrainsMono-Regular, IBMPlexSansJP-SemiBold, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(params.props.name.value, 0, 0);
    ctx.restore();

    if (params.props.userRole.value === "Staff" && params.props.lang.value) {
      ctx.fillStyle = params.layout.variants.value.color;
      ctx.font = `${Math.round(h * NAME_BADGE_PREVIEW_TEXT_TUNING.langFontRatio)}px JetBrainsMono-Regular, IBMPlexSansJP-Regular, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        params.props.lang.value,
        w * NAME_BADGE_PREVIEW_TEXT_TUNING.langXRatio,
        h * NAME_BADGE_PREVIEW_TEXT_TUNING.langYRatio,
      );
    }

    frontTexture.needsUpdate = true;
    redrawFrontSurfaceTextures(w, h, avatarX, avatarY, avatarW, avatarH);
  }

  function getFrontTexture() {
    return frontTexture;
  }

  function getFrontRoughnessTexture() {
    return frontRoughnessTexture;
  }

  function getFrontBumpTexture() {
    return frontBumpTexture;
  }

  function redrawFrontSurfaceTextures(
    width: number,
    height: number,
    avatarX: number,
    avatarY: number,
    avatarW: number,
    avatarH: number,
  ) {
    if (!roughnessContext || !bumpContext || !roughnessCanvas || !bumpCanvas) return;

    const roughnessBase = Math.round(
      clamp(NAME_BADGE_CARD_SURFACE_TUNING.baseRoughness, 0, 1) * 255,
    );
    const roughnessSmooth = Math.round(
      clamp(NAME_BADGE_CARD_SURFACE_TUNING.smoothRoughness, 0, 1) * 255,
    );
    const roughnessNoise = Math.round(
      clamp(NAME_BADGE_CARD_SURFACE_TUNING.roughnessNoiseAmplitude, 0, 1) * 255,
    );
    const bumpNoise = Math.round(
      clamp(NAME_BADGE_CARD_SURFACE_TUNING.bumpNoiseAmplitude, 0, 1) * 127,
    );

    const roughnessImageData = roughnessContext.createImageData(width, height);
    const bumpImageData = bumpContext.createImageData(width, height);
    const roughData = roughnessImageData.data;
    const bumpData = bumpImageData.data;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        const coarseNoise = pseudoNoise01(x, y, 1337);
        const fineNoise = pseudoNoise01(x * 3, y * 3, 7331);
        const combinedNoise = (coarseNoise * 0.7 + fineNoise * 0.3) * 2 - 1;

        const roughnessValue = clamp(roughnessBase + combinedNoise * roughnessNoise, 0, 255);
        const bumpValue = clamp(127 + combinedNoise * bumpNoise, 0, 255);

        roughData[index + 0] = roughnessValue;
        roughData[index + 1] = roughnessValue;
        roughData[index + 2] = roughnessValue;
        roughData[index + 3] = 255;

        bumpData[index + 0] = bumpValue;
        bumpData[index + 1] = bumpValue;
        bumpData[index + 2] = bumpValue;
        bumpData[index + 3] = 255;
      }
    }

    applySmoothMask({
      data: roughData,
      width,
      height,
      smoothValue: roughnessSmooth,
      opacity: NAME_BADGE_CARD_SURFACE_TUNING.smoothMaskOpacity,
      avatarX,
      avatarY,
      avatarW,
      avatarH,
    });
    applySmoothMask({
      data: bumpData,
      width,
      height,
      smoothValue: 127,
      opacity: NAME_BADGE_CARD_SURFACE_TUNING.smoothMaskOpacity,
      avatarX,
      avatarY,
      avatarW,
      avatarH,
    });

    roughnessContext.putImageData(roughnessImageData, 0, 0);
    bumpContext.putImageData(bumpImageData, 0, 0);

    if (frontRoughnessTexture) frontRoughnessTexture.needsUpdate = true;
    if (frontBumpTexture) frontBumpTexture.needsUpdate = true;

    function pseudoNoise01(px: number, py: number, seed: number) {
      let n = (px * 374761393 + py * 668265263 + seed) | 0;
      n = (n ^ (n >>> 13)) | 0;
      n = Math.imul(n, 1274126177);
      n = (n ^ (n >>> 16)) | 0;
      return (n & 0xff) / 255;
    }

    function blend(value: number, target: number, opacity: number) {
      return value + (target - value) * opacity;
    }

    function applySmoothMask(params: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      smoothValue: number;
      opacity: number;
      avatarX: number;
      avatarY: number;
      avatarW: number;
      avatarH: number;
    }) {
      const vPolygon = NAME_BADGE_CARD_SURFACE_TUNING.smoothVPolygonRatios.map(([rx, ry]) => ({
        x: rx * params.width,
        y: ry * params.height,
      }));
      const sponsorPolygon = NAME_BADGE_CARD_SURFACE_TUNING.smoothSponsorPolygonRatios.map(
        ([rx, ry]) => ({
          x: rx * params.width,
          y: ry * params.height,
        }),
      );
      const oCenterX = params.avatarX + params.avatarW * 0.5;
      const oCenterY = params.avatarY + params.avatarH * 0.5;
      const oRadius =
        Math.min(params.avatarW, params.avatarH) *
        NAME_BADGE_CARD_SURFACE_TUNING.smoothORadiusScale;
      const oRadiusSq = oRadius * oRadius;
      const feather = Math.max(1, oRadius * 0.12);

      for (let y = 0; y < params.height; y += 1) {
        for (let x = 0; x < params.width; x += 1) {
          const inV = pointInPolygon(x, y, vPolygon);
          const inSponsor = pointInPolygon(x, y, sponsorPolygon);
          const dx = x - oCenterX;
          const dy = y - oCenterY;
          const oDistanceSq = dx * dx + dy * dy;
          let inO = false;
          let oEdgeOpacity = 0;

          if (oDistanceSq <= oRadiusSq) {
            inO = true;
            const edgeDistance = oRadius - Math.sqrt(oDistanceSq);
            oEdgeOpacity = clamp(edgeDistance / feather, 0, 1);
          }

          if (!inV && !inO && !inSponsor) continue;

          const index = (y * params.width + x) * 4;
          const maskOpacity = inV
            ? params.opacity
            : inSponsor
              ? params.opacity
              : params.opacity * oEdgeOpacity;
          const current = params.data[index + 0] ?? params.smoothValue;
          const next = blend(current, params.smoothValue, maskOpacity);
          params.data[index + 0] = next;
          params.data[index + 1] = next;
          params.data[index + 2] = next;
        }
      }
    }

    function pointInPolygon(x: number, y: number, points: { x: number; y: number }[]) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
        const xi = points[i]!.x;
        const yi = points[i]!.y;
        const xj = points[j]!.x;
        const yj = points[j]!.y;

        const intersects =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;
        if (intersects) inside = !inside;
      }
      return inside;
    }
  }

  function disposeTextureResources() {
    if (frontTexture) {
      frontTexture.dispose();
    }
    if (frontRoughnessTexture) {
      frontRoughnessTexture.dispose();
    }
    if (frontBumpTexture) {
      frontBumpTexture.dispose();
    }
    frontTexture = null;
    frontRoughnessTexture = null;
    frontBumpTexture = null;
    textureCanvas = null;
    textureContext = null;
    roughnessCanvas = null;
    roughnessContext = null;
    bumpCanvas = null;
    bumpContext = null;
  }

  return {
    fallbackImageUrl,
    ensureTextureResources,
    redrawFrontTexture,
    getFrontTexture,
    getFrontRoughnessTexture,
    getFrontBumpTexture,
    disposeTextureResources,
  };
}

function createSceneModel(params: {
  layout: NameBadgePreviewLayout;
  interaction: NameBadgePreviewInteraction;
  texture: NameBadgePreviewTexture;
  applyActiveCameraSettings: (context: TresContext | TresContextWithClock) => void;
  setRangeMotionFromNormalized: (x: number, y: number, z?: number) => void;
  resetRangeMotion: () => void;
  disposeObject3D: (object: THREE.Object3D | null | undefined) => void;
}): NameBadgePreviewScene {
  const isThreeReady = ref(false);

  let tresContext: TresContext | null = null;
  let threeScene: THREE.Scene | null = null;
  let cardPivot: THREE.Group | null = null;
  let cardMesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.Material[]> | null = null;
  let cardSurfaceMesh: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshPhysicalMaterial> | null = null;
  let ropeMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null = null;
  let ropeUvAttribute: THREE.BufferAttribute | null = null;
  let ropeClothTexture: THREE.CanvasTexture | null = null;
  let ropeClothBumpTexture: THREE.CanvasTexture | null = null;
  let keyLight: THREE.DirectionalLight | null = null;
  let ropeCurvePositions: Float32Array | null = null;
  let ropeRibbonPositions: Float32Array | null = null;
  let ropePositionAttribute: THREE.BufferAttribute | null = null;

  function toWorldX(px: number) {
    const pxPerWorld =
      params.layout.resolvedCardHeight.value / NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;
    return (px - params.layout.stageWidth.value / 2) / pxPerWorld;
  }

  function toWorldY(py: number) {
    const pxPerWorld =
      params.layout.resolvedCardHeight.value / NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;
    return (params.layout.stageHeight.value / 2 - py) / pxPerWorld;
  }

  function toWorldSize(px: number) {
    return (
      (px * NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld) /
      params.layout.resolvedCardHeight.value
    );
  }

  function resolveSceneBackgroundColor() {
    if (import.meta.client) {
      const cssColor = getComputedStyle(document.documentElement)
        .getPropertyValue(NAME_BADGE_PREVIEW_SCENE_TUNING.backgroundColorCssVar)
        .trim();
      if (cssColor) return cssColor;
    }
    return NAME_BADGE_PREVIEW_SCENE_TUNING.backgroundColorFallback;
  }

  function createRopeClothTextures() {
    if (!import.meta.client) {
      return { colorTexture: null, bumpTexture: null };
    }

    const width = NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureWidth;
    const height = NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureHeight;
    const weaveSpacing = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveSpacingPx;
    const weaveThickness = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveThicknessPx;
    const weaveOffset = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveOffsetPx;

    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = width;
    colorCanvas.height = height;
    const colorContext = colorCanvas.getContext("2d");
    if (!colorContext) return { colorTexture: null, bumpTexture: null };

    const bodyGradient = colorContext.createLinearGradient(0, 0, 0, height);
    bodyGradient.addColorStop(0, NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor);
    bodyGradient.addColorStop(0.35, NAME_BADGE_ROPE_VISUAL_TUNING.ropeColor);
    bodyGradient.addColorStop(0.65, NAME_BADGE_ROPE_VISUAL_TUNING.ropeColor);
    bodyGradient.addColorStop(1, NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor);
    colorContext.fillStyle = bodyGradient;
    colorContext.fillRect(0, 0, width, height);

    drawWeavePass(colorContext, {
      direction: 1,
      stroke: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor,
      alphaEven: 0.42,
      alphaOdd: 0.26,
      lineWidth: weaveThickness,
      shift: 10,
    });
    drawWeavePass(colorContext, {
      direction: -1,
      stroke: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadMidColor,
      alphaEven: 0.36,
      alphaOdd: 0.22,
      lineWidth: weaveThickness * 0.95,
      shift: weaveSpacing * 1.5,
    });
    drawWeavePass(colorContext, {
      direction: 1,
      stroke: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadHighlightColor,
      alphaEven: 0.18,
      alphaOdd: 0.08,
      lineWidth: Math.max(1, weaveThickness * 0.42),
      shift: weaveSpacing * 0.25,
    });

    const edgeShade = colorContext.createLinearGradient(0, 0, 0, height);
    edgeShade.addColorStop(0, "rgba(0, 0, 0, 0.30)");
    edgeShade.addColorStop(0.2, "rgba(0, 0, 0, 0.02)");
    edgeShade.addColorStop(0.8, "rgba(0, 0, 0, 0.02)");
    edgeShade.addColorStop(1, "rgba(0, 0, 0, 0.30)");
    colorContext.fillStyle = edgeShade;
    colorContext.fillRect(0, 0, width, height);

    const colorImageData = colorContext.getImageData(0, 0, width, height);
    const colorData = colorImageData.data;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        const grain = (((x * 13 + y * 17) % 11) - 5) * 0.8;
        colorData[index + 0] = clamp(colorData[index + 0]! + grain, 0, 255);
        colorData[index + 1] = clamp(colorData[index + 1]! + grain, 0, 255);
        colorData[index + 2] = clamp(colorData[index + 2]! + grain, 0, 255);
      }
    }
    colorContext.putImageData(colorImageData, 0, 0);

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpContext = bumpCanvas.getContext("2d");
    if (!bumpContext) return { colorTexture: null, bumpTexture: null };

    bumpContext.fillStyle = "#7f7f7f";
    bumpContext.fillRect(0, 0, width, height);
    drawWeavePass(bumpContext, {
      direction: 1,
      stroke: "#9f9f9f",
      alphaEven: 0.34,
      alphaOdd: 0.2,
      lineWidth: weaveThickness,
      shift: 0,
    });
    drawWeavePass(bumpContext, {
      direction: -1,
      stroke: "#636363",
      alphaEven: 0.3,
      alphaOdd: 0.18,
      lineWidth: weaveThickness * 0.95,
      shift: weaveSpacing * 0.5,
    });

    const bumpCenter = bumpContext.createLinearGradient(0, 0, 0, height);
    bumpCenter.addColorStop(0, "rgba(102, 102, 102, 0.35)");
    bumpCenter.addColorStop(0.5, "rgba(150, 150, 150, 0.25)");
    bumpCenter.addColorStop(1, "rgba(102, 102, 102, 0.35)");
    bumpContext.fillStyle = bumpCenter;
    bumpContext.fillRect(0, 0, width, height);

    const bumpImageData = bumpContext.getImageData(0, 0, width, height);
    const bumpData = bumpImageData.data;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        const grain = (((x * 7 + y * 11) % 9) - 4) * 1.4;
        const value = clamp(bumpData[index + 0]! + grain, 0, 255);
        bumpData[index + 0] = value;
        bumpData[index + 1] = value;
        bumpData[index + 2] = value;
      }
    }
    bumpContext.putImageData(bumpImageData, 0, 0);

    const colorTexture = new THREE.CanvasTexture(colorCanvas);
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(
      NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatX,
      NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatY,
    );
    colorTexture.anisotropy = 8;

    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(
      NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatX,
      NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatY,
    );
    bumpTexture.anisotropy = 8;

    return { colorTexture, bumpTexture };

    function drawWeavePass(
      context: CanvasRenderingContext2D,
      pass: {
        direction: 1 | -1;
        stroke: string;
        alphaEven: number;
        alphaOdd: number;
        lineWidth: number;
        shift: number;
      },
    ) {
      context.save();
      context.strokeStyle = pass.stroke;
      context.lineWidth = pass.lineWidth;
      context.lineCap = "round";
      const start = -height - weaveSpacing;
      const end = width + height + weaveSpacing;

      let stripeIndex = 0;
      for (let x = start; x <= end; x += weaveSpacing) {
        const offset = pass.shift + (stripeIndex % 2 === 0 ? weaveOffset : -weaveOffset);
        context.globalAlpha = stripeIndex % 2 === 0 ? pass.alphaEven : pass.alphaOdd;
        context.beginPath();
        if (pass.direction === 1) {
          context.moveTo(x + offset, 0);
          context.lineTo(x + height + offset, height);
        } else {
          context.moveTo(x + offset, height);
          context.lineTo(x + height + offset, 0);
        }
        context.stroke();
        stripeIndex += 1;
      }

      context.restore();
    }
  }

  function rebuildCardMesh() {
    if (!threeScene || !cardPivot) return;

    if (cardMesh) {
      cardPivot.remove(cardMesh);
      cardMesh.geometry.dispose();
      for (const material of cardMesh.material) {
        material.dispose();
      }
      cardMesh = null;
    }
    if (cardSurfaceMesh) {
      cardPivot.remove(cardSurfaceMesh);
      cardSurfaceMesh.geometry.dispose();
      cardSurfaceMesh.material.dispose();
      cardSurfaceMesh = null;
    }

    const cardWidthWorld =
      NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld * params.layout.resolvedAspect.value;
    const cardHeightWorld = NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;
    const cardDepthWorld = NAME_BADGE_PREVIEW_WORLD_TUNING.cardDepthWorld;
    const cardCornerRadiusWorld = Math.min(
      NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerRadiusWorld,
      cardWidthWorld * 0.5,
      cardHeightWorld * 0.5,
    );

    params.texture.ensureTextureResources();
    const frontTexture = params.texture.getFrontTexture();
    const frontRoughnessTexture = params.texture.getFrontRoughnessTexture();
    const frontBumpTexture = params.texture.getFrontBumpTexture();
    if (!frontTexture) return;

    const capMaterial = new THREE.MeshBasicMaterial({
      map: frontTexture,
      transparent: true,
    });

    const sideMaterial = new THREE.MeshBasicMaterial({
      color: "#d5d7dd",
    });

    const shape = createRoundedRectShape(cardWidthWorld, cardHeightWorld, cardCornerRadiusWorld);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: cardDepthWorld,
      bevelEnabled: false,
      steps: 1,
      curveSegments: NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerSegments,
    });
    remapCardUvToRect(geometry, cardWidthWorld, cardHeightWorld);
    geometry.translate(0, 0, -cardDepthWorld * 0.5);

    cardMesh = new THREE.Mesh(geometry, [capMaterial, sideMaterial]);
    cardMesh.castShadow = false;
    cardMesh.receiveShadow = false;

    cardPivot.add(cardMesh);

    const surfaceGeometry = new THREE.ShapeGeometry(
      shape,
      NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerSegments,
    );
    remapCardUvToRect(surfaceGeometry, cardWidthWorld, cardHeightWorld);
    surfaceGeometry.translate(
      0,
      0,
      cardDepthWorld * 0.5 + NAME_BADGE_CARD_SURFACE_TUNING.surfaceLayerOffsetWorld,
    );

    const surfaceMaterial = new THREE.MeshPhysicalMaterial({
      color: "#000000",
      transparent: true,
      opacity: NAME_BADGE_CARD_SURFACE_TUNING.surfaceLayerOpacity,
      alphaMap: frontBumpTexture ?? frontRoughnessTexture ?? undefined,
      roughness: NAME_BADGE_CARD_SURFACE_TUNING.baseRoughness,
      roughnessMap: frontRoughnessTexture ?? undefined,
      bumpMap: frontBumpTexture ?? undefined,
      bumpScale: NAME_BADGE_CARD_SURFACE_TUNING.bumpScale,
      metalness: 0.02,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    cardSurfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    cardSurfaceMesh.castShadow = false;
    cardSurfaceMesh.receiveShadow = false;
    cardSurfaceMesh.renderOrder = 1;
    cardPivot.add(cardSurfaceMesh);
  }

  function updateCardTransform() {
    if (!cardPivot) return;
    const simulation = params.interaction.getSimulationSnapshot();

    const cardCenterX = simulation.tipX;
    const cardCenterY =
      simulation.tipY -
      params.layout.attachOffset.value +
      params.layout.resolvedCardHeight.value * 0.5;
    cardPivot.position.set(toWorldX(cardCenterX), toWorldY(cardCenterY), 0);

    const roll = THREE.MathUtils.degToRad(
      clamp(
        (simulation.tipX - params.layout.anchorX.value) * 0.11 + simulation.velX * 0.01,
        -10,
        10,
      ),
    );
    const targetYaw = THREE.MathUtils.degToRad(
      clamp(
        (simulation.tipX - params.layout.anchorX.value) * 0.035 + simulation.velX * 0.004,
        -14,
        14,
      ),
    );
    const targetPitch = THREE.MathUtils.degToRad(
      clamp(
        -4 +
          (simulation.tipY - (params.layout.anchorY.value + params.layout.ropeRestLength.value)) *
            -0.018 +
          simulation.velY * -0.003,
        -12,
        8,
      ),
    );

    cardPivot.rotation.x = THREE.MathUtils.lerp(cardPivot.rotation.x, targetPitch, 0.16);
    cardPivot.rotation.y = THREE.MathUtils.lerp(cardPivot.rotation.y, targetYaw, 0.16);
    cardPivot.rotation.z = THREE.MathUtils.lerp(cardPivot.rotation.z, roll, 0.16);
  }

  function updateRopeGeometry() {
    if (!ropeMesh || !ropeCurvePositions || !ropeRibbonPositions || !ropePositionAttribute) {
      return;
    }
    const simulation = params.interaction.getSimulationSnapshot();

    const ropeDx = simulation.tipX - params.layout.anchorX.value;
    const ropeDy = simulation.tipY - params.layout.anchorY.value;
    const sway = clamp(
      Math.abs(ropeDx) * 0.16 + Math.max(0, ropeDy - params.layout.ropeRestLength.value) * 0.24,
      0,
      28,
    );

    const cp1x = params.layout.anchorX.value + ropeDx * 0.2;
    const cp1y = params.layout.anchorY.value + params.layout.ropeRestLength.value * 0.45 + sway;
    const cp2x = simulation.tipX - ropeDx * 0.18;
    const cp2y = simulation.tipY - params.layout.ropeRestLength.value * 0.24 + sway * 0.3;

    for (let i = 0; i <= NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments; i += 1) {
      const t = i / NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments;
      const px = cubicBezier(t, params.layout.anchorX.value, cp1x, cp2x, simulation.tipX);
      const py = cubicBezier(t, params.layout.anchorY.value, cp1y, cp2y, simulation.tipY);

      ropeCurvePositions[i * 3 + 0] = toWorldX(px);
      ropeCurvePositions[i * 3 + 1] = toWorldY(py);
      ropeCurvePositions[i * 3 + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;
    }

    const halfRopeWidthWorld = toWorldSize(NAME_BADGE_ROPE_VISUAL_TUNING.ropeWidthPx) * 0.5;
    for (let i = 0; i <= NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments; i += 1) {
      const prevIndex = i === 0 ? 0 : i - 1;
      const nextIndex =
        i === NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments
          ? NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments
          : i + 1;

      const currentOffset = i * 3;
      const prevOffset = prevIndex * 3;
      const nextOffset = nextIndex * 3;

      const centerX = ropeCurvePositions[currentOffset + 0] ?? 0;
      const centerY = ropeCurvePositions[currentOffset + 1] ?? 0;
      const tangentX =
        (ropeCurvePositions[nextOffset + 0] ?? 0) - (ropeCurvePositions[prevOffset + 0] ?? 0);
      const tangentY =
        (ropeCurvePositions[nextOffset + 1] ?? 0) - (ropeCurvePositions[prevOffset + 1] ?? 0);
      const tangentLength = Math.hypot(tangentX, tangentY) || 1;
      const normalX = -tangentY / tangentLength;
      const normalY = tangentX / tangentLength;

      const leftOffset = i * 6;
      const rightOffset = leftOffset + 3;

      ropeRibbonPositions[leftOffset + 0] = centerX + normalX * halfRopeWidthWorld;
      ropeRibbonPositions[leftOffset + 1] = centerY + normalY * halfRopeWidthWorld;
      ropeRibbonPositions[leftOffset + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;

      ropeRibbonPositions[rightOffset + 0] = centerX - normalX * halfRopeWidthWorld;
      ropeRibbonPositions[rightOffset + 1] = centerY - normalY * halfRopeWidthWorld;
      ropeRibbonPositions[rightOffset + 2] = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;
    }

    ropeMesh.geometry.computeBoundingSphere();
    ropePositionAttribute.needsUpdate = true;

    function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
      const inv = 1 - t;
      return inv * inv * inv * p0 + 3 * inv * inv * t * p1 + 3 * inv * t * t * p2 + t * t * t * p3;
    }
  }

  function syncThreeScene() {
    if (
      !isThreeReady.value ||
      !cardPivot ||
      !ropeMesh ||
      !ropeCurvePositions ||
      !ropeRibbonPositions ||
      !ropePositionAttribute
    ) {
      return;
    }

    updateCardTransform();
    updateRopeGeometry();
  }

  function ensureThreeScene(context: TresContext) {
    const currentScene = context.scene.value;
    if (!currentScene) return;

    if (threeScene && threeScene !== currentScene) {
      params.disposeObject3D(cardPivot);
      params.disposeObject3D(ropeMesh);
      ropeClothTexture?.dispose();
      ropeClothBumpTexture?.dispose();
      if (keyLight?.parent) keyLight.parent.remove(keyLight);
      cardPivot = null;
      cardMesh = null;
      cardSurfaceMesh = null;
      ropeMesh = null;
      ropeUvAttribute = null;
      ropeClothTexture = null;
      ropeClothBumpTexture = null;
      keyLight = null;
      ropeCurvePositions = null;
      ropeRibbonPositions = null;
      ropePositionAttribute = null;
      threeScene = null;
      isThreeReady.value = false;
    }

    threeScene = currentScene;
    threeScene.background = new THREE.Color(resolveSceneBackgroundColor());

    if (!keyLight) {
      keyLight = new THREE.DirectionalLight(
        NAME_BADGE_PREVIEW_SCENE_TUNING.keyLightColor,
        NAME_BADGE_PREVIEW_SCENE_TUNING.keyLightIntensity,
      );
      keyLight.position.set(...NAME_BADGE_PREVIEW_SCENE_TUNING.keyLightPosition);
      threeScene.add(keyLight);
    }

    if (!cardPivot) {
      cardPivot = new THREE.Group();
      threeScene.add(cardPivot);
    }

    if (!ropeMesh) {
      const segmentCount = NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments;
      ropeCurvePositions = new Float32Array((segmentCount + 1) * 3);
      ropeRibbonPositions = new Float32Array((segmentCount + 1) * 6);

      const ropeGeometry = new THREE.BufferGeometry();
      ropePositionAttribute = new THREE.BufferAttribute(ropeRibbonPositions, 3);
      ropePositionAttribute.setUsage(THREE.DynamicDrawUsage);
      ropeGeometry.setAttribute("position", ropePositionAttribute);

      const ropeUvs = new Float32Array((segmentCount + 1) * 4);
      for (let i = 0; i <= segmentCount; i += 1) {
        const u = i / segmentCount;
        const uvOffset = i * 4;
        ropeUvs[uvOffset + 0] = u;
        ropeUvs[uvOffset + 1] = 0;
        ropeUvs[uvOffset + 2] = u;
        ropeUvs[uvOffset + 3] = 1;
      }
      ropeUvAttribute = new THREE.BufferAttribute(ropeUvs, 2);
      ropeGeometry.setAttribute("uv", ropeUvAttribute);

      const ropeIndices = new Uint16Array(segmentCount * 6);
      for (let i = 0; i < segmentCount; i += 1) {
        const base = i * 6;
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;

        ropeIndices[base + 0] = a;
        ropeIndices[base + 1] = b;
        ropeIndices[base + 2] = c;
        ropeIndices[base + 3] = b;
        ropeIndices[base + 4] = d;
        ropeIndices[base + 5] = c;
      }
      ropeGeometry.setIndex(new THREE.BufferAttribute(ropeIndices, 1));

      const ropeTextures = createRopeClothTextures();
      ropeClothTexture = ropeTextures.colorTexture;
      ropeClothBumpTexture = ropeTextures.bumpTexture;

      const ropeMaterial = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: ropeClothTexture ?? undefined,
        bumpMap: ropeClothBumpTexture ?? undefined,
        bumpScale: NAME_BADGE_ROPE_VISUAL_TUNING.ropeBumpScale,
        transparent: true,
        opacity: NAME_BADGE_ROPE_VISUAL_TUNING.ropeOpacity,
        roughness: NAME_BADGE_ROPE_VISUAL_TUNING.ropeRoughness,
        metalness: NAME_BADGE_ROPE_VISUAL_TUNING.ropeMetalness,
        side: THREE.DoubleSide,
      });
      ropeMesh = new THREE.Mesh(ropeGeometry, ropeMaterial);
      ropeMesh.frustumCulled = false;
      threeScene.add(ropeMesh);
    }

    params.applyActiveCameraSettings(context);
    rebuildCardMesh();
    isThreeReady.value = true;
  }

  function handleCanvasReady(context: TresContext) {
    tresContext = context;
    ensureThreeScene(context);
    params.interaction.resetSimulation("entry");
    syncThreeScene();
    void params.texture.redrawFrontTexture();
  }

  function handleCanvasLoop(context: TresContextWithClock) {
    if (!tresContext) return;

    if (!isThreeReady.value) {
      ensureThreeScene(tresContext);
    }

    const cameraMotion = params.interaction.getCameraMotionSnapshot();
    params.setRangeMotionFromNormalized(cameraMotion.normalizedX, cameraMotion.normalizedY, 0);
    params.applyActiveCameraSettings(context);

    const deltaSeconds = clamp(context.delta, 1 / 120, 1 / 30);
    params.interaction.stepSimulation(deltaSeconds);
    syncThreeScene();
  }

  onBeforeUnmount(() => {
    params.disposeObject3D(cardPivot);
    params.disposeObject3D(ropeMesh);
    cardMesh = null;
    cardSurfaceMesh = null;
    ropeClothTexture?.dispose();
    ropeClothBumpTexture?.dispose();
    ropeUvAttribute = null;
    ropeClothTexture = null;
    ropeClothBumpTexture = null;
    if (keyLight?.parent) keyLight.parent.remove(keyLight);
    keyLight = null;

    params.texture.disposeTextureResources();
    params.resetRangeMotion();

    isThreeReady.value = false;
    tresContext = null;
  });

  return {
    isThreeReady,
    rebuildCardMesh,
    handleCanvasReady,
    handleCanvasLoop,
  };
}
