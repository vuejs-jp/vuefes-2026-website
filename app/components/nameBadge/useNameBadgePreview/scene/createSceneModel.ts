import type { TresContext, TresContextWithClock } from "@tresjs/core";
import * as THREE from "three";
import { onBeforeUnmount, ref, type Ref } from "vue";

import {
  NAME_BADGE_PREVIEW_SCENE_TUNING,
  NAME_BADGE_PREVIEW_WORLD_TUNING,
  NAME_BADGE_ROPE_VISUAL_TUNING,
  NAME_BADGE_CARD_TILT_TUNING,
  NAME_BADGE_SPRING_TUNING,
} from "../constant";
import type { NameBadgePreviewInteraction } from "../interaction/createInteractionModel";
import type { NameBadgePreviewLayout } from "../layout/createLayoutModel";
import { clamp } from "../shared/math";
import type { NameBadgePreviewTexture } from "../texture/createTextureModel";
import { createCardMeshes, disposeCardMeshes, type CardMeshes } from "./cardMeshes";
import { computeCardTiltDegrees } from "./cardTilt";
import { createHighlightLightController } from "./highlightLight";
import { createRopeMesh, type RopeMeshBundle } from "./ropeMesh";
import { writeRopeCurve, writeRopeRibbon } from "./ropeRibbon";
import { createWorldProjection } from "./worldProjection";

/**
 * The THREE side of the preview: everything that lives inside the `TresCanvas`.
 *
 * The two handlers are bound to the canvas in the component template. The scene
 * is built on `ready` and driven forward on every `loop`.
 */
export type NameBadgePreviewScene = {
  /** Whether the scene has been built and is safe to drive. */
  isThreeReady: Ref<boolean>;
  /** Rebuilds the card geometry, e.g. after the card size changed. */
  rebuildCardMesh: () => void;
  handleCanvasReady: (context: TresContext) => void;
  handleCanvasLoop: (context: TresContextWithClock) => void;
};

export type NameBadgePreviewSceneDeps = {
  layout: NameBadgePreviewLayout;
  interaction: NameBadgePreviewInteraction;
  texture: NameBadgePreviewTexture;
  applyActiveCameraSettings: (context: TresContext | TresContextWithClock) => void;
  setRangeMotionFromNormalized: (x: number, y: number, z?: number) => void;
  resetRangeMotion: () => void;
  disposeObject3D: (object: THREE.Object3D | null | undefined) => void;
};

/**
 * Builds and drives the 3D scene.
 *
 * Responsibilities, in the order they happen each frame:
 *
 * 1. feed the pointer parallax into the camera,
 * 2. advance the rope physics,
 * 3. push the simulation's tip position and velocity onto the card's transform
 *    and the rope's vertex buffer, and
 * 4. reposition the highlight light.
 *
 * Nothing here allocates per frame — the buffers, meshes and scratch vectors are
 * all created up front and mutated in place.
 */
export function createSceneModel(deps: NameBadgePreviewSceneDeps): NameBadgePreviewScene {
  const { layout, interaction, texture } = deps;

  const isThreeReady = ref(false);

  const projection = createWorldProjection({
    get stageWidth() {
      return layout.stageWidth.value;
    },
    get stageHeight() {
      return layout.stageHeight.value;
    },
    get cardHeightPx() {
      return layout.resolvedCardHeight.value;
    },
  });

  const highlight = createHighlightLightController();

  let tresContext: TresContext | null = null;
  let threeScene: THREE.Scene | null = null;
  /** Parent of every card mesh; carries the badge's position and orientation. */
  let cardPivot: THREE.Group | null = null;
  let cardMeshes: CardMeshes | null = null;
  let rope: RopeMeshBundle | null = null;
  let keyLight: THREE.DirectionalLight | null = null;
  let highlightLight: THREE.PointLight | null = null;

  /** Reused so the per-frame transform update allocates nothing. */
  const cardAttachmentOffset = new THREE.Vector3();

  onBeforeUnmount(disposeScene);

  return {
    isThreeReady,
    rebuildCardMesh,
    handleCanvasReady,
    handleCanvasLoop,
  };

  function handleCanvasReady(context: TresContext) {
    tresContext = context;
    ensureThreeScene(context);
    // Start folded up at the top so the badge drops into place on first paint.
    interaction.resetSimulation("entry");
    syncThreeScene();
    void texture.redrawFrontTexture();
  }

  function handleCanvasLoop(context: TresContextWithClock) {
    if (!tresContext) return;

    // The scene is dropped when TresJS swaps its renderer; rebuild it rather
    // than rendering into nothing.
    if (!isThreeReady.value) {
      ensureThreeScene(tresContext);
    }

    const cameraMotion = interaction.getCameraMotionSnapshot();
    deps.setRangeMotionFromNormalized(cameraMotion.normalizedX, cameraMotion.normalizedY, 0);
    deps.applyActiveCameraSettings(context);

    const deltaSeconds = clamp(context.delta, 0, NAME_BADGE_SPRING_TUNING.maxFrameDeltaSeconds);
    interaction.stepSimulation(deltaSeconds);
    syncThreeScene();
    updateHighlightLight(context, cameraMotion);
  }

  /**
   * Creates the scene contents, or re-creates them against a new THREE scene.
   *
   * Everything is guarded so this is safe to call repeatedly: only what is
   * missing gets built.
   */
  function ensureThreeScene(context: TresContext) {
    const currentScene = context.scene.value;
    if (!currentScene) return;

    if (threeScene && threeScene !== currentScene) {
      disposeSceneContents();
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

    if (!highlightLight) {
      highlightLight = new THREE.PointLight(
        NAME_BADGE_PREVIEW_SCENE_TUNING.highlightLightColor,
        NAME_BADGE_PREVIEW_SCENE_TUNING.highlightLightIntensity,
      );
      threeScene.add(highlightLight);
    }

    if (!cardPivot) {
      cardPivot = new THREE.Group();
      threeScene.add(cardPivot);
    }

    if (!rope) {
      rope = createRopeMesh();
      threeScene.add(rope.mesh);
    }

    deps.applyActiveCameraSettings(context);
    rebuildCardMesh();
    isThreeReady.value = true;
  }

  /**
   * Reads the stage background from CSS so the preview matches the page it is
   * embedded in.
   */
  function resolveSceneBackgroundColor() {
    if (import.meta.client) {
      const cssColor = getComputedStyle(document.documentElement)
        .getPropertyValue(NAME_BADGE_PREVIEW_SCENE_TUNING.backgroundColorCssVar)
        .trim();
      if (cssColor) return cssColor;
    }
    return NAME_BADGE_PREVIEW_SCENE_TUNING.backgroundColorFallback;
  }

  function rebuildCardMesh() {
    if (!threeScene || !cardPivot) return;

    disposeCardMeshes(cardPivot, cardMeshes);
    cardMeshes = null;

    texture.ensureTextureResources();
    const frontTexture = texture.getFrontTexture();
    // No face to print on yet (server render, or before the canvas exists).
    if (!frontTexture) return;

    cardMeshes = createCardMeshes({
      aspect: layout.resolvedAspect.value,
      attachOffsetPx: layout.attachOffset.value,
      ropeRestLengthPx: layout.ropeRestLength.value,
      projection,
      frontTexture,
      frontRoughnessTexture: texture.getFrontRoughnessTexture(),
      frontBumpTexture: texture.getFrontBumpTexture(),
      ropeMaterial: rope?.mesh.material ?? null,
    });

    cardPivot.add(cardMeshes.card, cardMeshes.surface, cardMeshes.slotRim);
    if (cardMeshes.strapThrough) {
      cardPivot.add(cardMeshes.strapThrough);
    }
  }

  /** Pushes one frame of simulation state onto the scene graph. */
  function syncThreeScene() {
    if (!isThreeReady.value || !cardPivot || !rope) return;

    updateCardTransform(cardPivot);
    updateRopeGeometry(rope);
  }

  function updateCardTransform(pivot: THREE.Group) {
    const simulation = interaction.getSimulationSnapshot();

    const tilt = computeCardTiltDegrees({
      tipX: simulation.tipX,
      tipY: simulation.tipY,
      velX: simulation.velX,
      velY: simulation.velY,
      anchorX: layout.anchorX.value,
      anchorY: layout.anchorY.value,
      ropeRestLength: layout.ropeRestLength.value,
    });

    // Ease towards the target rather than snapping to it, so the card keeps
    // turning for a moment after the rope stops moving.
    const smoothing = NAME_BADGE_CARD_TILT_TUNING.rotationSmoothing;
    pivot.rotation.x = THREE.MathUtils.lerp(
      pivot.rotation.x,
      THREE.MathUtils.degToRad(tilt.pitch),
      smoothing,
    );
    pivot.rotation.y = THREE.MathUtils.lerp(
      pivot.rotation.y,
      THREE.MathUtils.degToRad(tilt.yaw),
      smoothing,
    );
    pivot.rotation.z = THREE.MathUtils.lerp(
      pivot.rotation.z,
      THREE.MathUtils.degToRad(tilt.roll),
      smoothing,
    );

    // The rope holds the card at its slot, not at its centre. Rotating that
    // offset by the card's own orientation and subtracting it puts the slot,
    // rather than the card's middle, on the rope tip.
    cardAttachmentOffset
      .set(
        0,
        NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld * 0.5 -
          projection.toWorldSize(layout.attachOffset.value),
        0,
      )
      .applyQuaternion(pivot.quaternion);
    pivot.position
      .set(projection.toWorldX(simulation.tipX), projection.toWorldY(simulation.tipY), 0)
      .sub(cardAttachmentOffset);
  }

  function updateRopeGeometry(ropeBundle: RopeMeshBundle) {
    const simulation = interaction.getSimulationSnapshot();
    const segments = NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments;

    writeRopeCurve(
      ropeBundle.curvePositions,
      simulation.ropeX,
      simulation.ropeY,
      segments,
      projection,
    );
    writeRopeRibbon(
      ropeBundle.ribbonPositions,
      ropeBundle.curvePositions,
      segments,
      projection.toWorldSize(NAME_BADGE_ROPE_VISUAL_TUNING.ropeWidthPx) * 0.5,
    );

    ropeBundle.mesh.geometry.computeBoundingSphere();
    ropeBundle.positionAttribute.needsUpdate = true;
  }

  function updateHighlightLight(
    context: TresContextWithClock,
    cameraMotion: { normalizedX: number; normalizedY: number },
  ) {
    if (!highlightLight || !cardPivot) return;

    const activeCamera = context.camera.activeCamera.value;
    if (!activeCamera) return;

    highlight.update(highlightLight, cardPivot, activeCamera, cameraMotion);
  }

  /** Releases every GPU resource this model created, but keeps the model usable. */
  function disposeSceneContents() {
    deps.disposeObject3D(cardPivot);
    deps.disposeObject3D(rope?.mesh);
    rope?.clothTexture?.dispose();
    rope?.clothBumpTexture?.dispose();

    if (keyLight?.parent) keyLight.parent.remove(keyLight);
    if (highlightLight?.parent) highlightLight.parent.remove(highlightLight);

    cardPivot = null;
    cardMeshes = null;
    rope = null;
    keyLight = null;
    highlightLight = null;
    threeScene = null;
    isThreeReady.value = false;
  }

  function disposeScene() {
    disposeSceneContents();
    texture.disposeTextureResources();
    deps.resetRangeMotion();
    tresContext = null;
  }
}
