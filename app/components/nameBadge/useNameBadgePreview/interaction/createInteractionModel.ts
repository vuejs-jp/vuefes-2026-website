import { ref, type Ref } from "vue";

import type { NameBadgePreviewLayout } from "../layout/createLayoutModel";
import {
  createCameraMotionTracker,
  type CameraMotionSnapshot,
  type StagePoint,
} from "./cameraMotionTracker";
import {
  createRopeSimulation,
  type RopeResetMode,
  type RopeSimulationSnapshot,
} from "./ropeSimulation";

/**
 * Everything the preview does in response to pointer input.
 *
 * The handlers are wired straight to the stage element's pointer events; the
 * snapshot getters are polled once per frame by the scene model.
 */
export type NameBadgePreviewInteraction = {
  handleStagePointerMove: (event: PointerEvent) => void;
  handleStagePointerDown: (event: PointerEvent) => void;
  handleStagePointerUp: (event: PointerEvent) => void;
  handleStagePointerLeave: () => void;
  /** Advances the rope physics by one rendered frame. */
  stepSimulation: (deltaSeconds: number) => void;
  resetSimulation: (mode?: RopeResetMode) => void;
  getSimulationSnapshot: () => RopeSimulationSnapshot;
  getCameraMotionSnapshot: () => CameraMotionSnapshot;
};

export type NameBadgePreviewInteractionDeps = {
  stageRef: Ref<HTMLElement | null>;
  layout: NameBadgePreviewLayout;
};

/**
 * Wires pointer events to the rope simulation and the camera parallax tracker.
 *
 * This layer owns only the drag bookkeeping that needs both of them: whether a
 * drag is active, and the offset between the pointer and the rope tip that
 * keeps the badge from jumping under the cursor when a drag starts.
 */
export function createInteractionModel(
  deps: NameBadgePreviewInteractionDeps,
): NameBadgePreviewInteraction {
  const { stageRef, layout } = deps;

  const isDragging = ref(false);
  /** Pointer-to-tip offset captured on pointer down, in stage pixels. */
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const rope = createRopeSimulation({
    get anchorX() {
      return layout.anchorX.value;
    },
    get anchorY() {
      return layout.anchorY.value;
    },
    get ropeRestLength() {
      return layout.ropeRestLength.value;
    },
    get cardWidth() {
      return layout.resolvedCardWidth.value;
    },
    get stageWidth() {
      return layout.stageWidth.value;
    },
    get stageHeight() {
      return layout.stageHeight.value;
    },
  });

  const cameraMotion = createCameraMotionTracker({
    stage: {
      get width() {
        return layout.stageWidth.value;
      },
      get height() {
        return layout.stageHeight.value;
      },
    },
    isDragging: () => isDragging.value,
  });

  return {
    handleStagePointerMove(event) {
      const local = toStagePoint(event);
      if (!local) return;

      if (isDragging.value) {
        rope.setDragTarget(local.x - dragOffsetX, local.y - dragOffsetY);
      }

      cameraMotion.handlePointerMove(local, event.pointerType);
    },

    handleStagePointerDown(event) {
      const local = toStagePoint(event);
      if (!local) return;
      // Only the card itself is draggable; the surrounding stage is not.
      if (!isPointerOnCard(local)) return;

      dragOffsetX = local.x - rope.tipX;
      dragOffsetY = local.y - rope.tipY;
      rope.beginDrag(rope.tipX, rope.tipY);

      isDragging.value = true;
      cameraMotion.handlePointerDown(local, event.pointerType);
      // Keeps receiving move events even when the pointer leaves the stage.
      stageRef.value?.setPointerCapture?.(event.pointerId);
    },

    handleStagePointerUp(event) {
      isDragging.value = false;
      rope.endDrag();
      stageRef.value?.releasePointerCapture?.(event.pointerId);
      cameraMotion.handlePointerUp(toStagePoint(event), event.pointerType);
    },

    handleStagePointerLeave() {
      cameraMotion.handlePointerLeave();
    },

    stepSimulation: (deltaSeconds) => rope.step(deltaSeconds),
    resetSimulation: (mode) => rope.reset(mode),
    getSimulationSnapshot: () => rope.getSnapshot(),
    getCameraMotionSnapshot: () => cameraMotion.getSnapshot(),
  };

  /**
   * Converts a pointer event into stage-local pixels.
   *
   * @returns `null` before the stage element is mounted.
   */
  function toStagePoint(event: PointerEvent): StagePoint | null {
    const stage = stageRef.value;
    if (!stage) return null;

    const bounds = stage.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }

  /**
   * Hit-tests the card's axis-aligned footprint.
   *
   * The rope tip sits at the strap slot rather than at the card's top edge, so
   * the box is offset upwards by {@link NameBadgePreviewLayout.attachOffset}.
   * The card's tilt is ignored: the footprint is close enough at the small
   * angles the simulation produces.
   */
  function isPointerOnCard(local: StagePoint) {
    const cardTop = rope.tipY - layout.attachOffset.value;
    const cardLeft = rope.tipX - layout.resolvedCardWidth.value * 0.5;

    return (
      local.x >= cardLeft &&
      local.x <= cardLeft + layout.resolvedCardWidth.value &&
      local.y >= cardTop &&
      local.y <= cardTop + layout.resolvedCardHeight.value
    );
  }
}
