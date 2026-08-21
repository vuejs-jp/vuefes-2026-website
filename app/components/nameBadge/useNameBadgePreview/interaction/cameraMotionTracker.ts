import { NAME_BADGE_PREVIEW_CAMERA_TUNING } from "../constant";
import { clamp } from "../shared/math";

/** A pointer position expressed in stage-local pixels. */
export type StagePoint = { x: number; y: number };

/**
 * Normalized pointer position driving the subtle camera parallax.
 *
 * Both components are in `[-1, 1]`, with the origin at the centre of the stage.
 * `normalizedY` points *up*, matching the WebGL convention, so it is the
 * inverse of the pointer's y axis.
 */
export type CameraMotionSnapshot = {
  normalizedX: number;
  normalizedY: number;
};

export type CameraMotionTrackerDeps = {
  /** Live stage size in pixels. */
  stage: { readonly width: number; readonly height: number };
  /** Whether the badge is currently being dragged. */
  isDragging: () => boolean;
  /** Injectable clock, in milliseconds. Defaults to the best available timer. */
  now?: () => number;
};

export type CameraMotionTracker = {
  handlePointerMove: (local: StagePoint, pointerType: string) => void;
  handlePointerDown: (local: StagePoint, pointerType: string) => void;
  /** @param local `null` when the up event fell outside the stage element. */
  handlePointerUp: (local: StagePoint | null, pointerType: string) => void;
  handlePointerLeave: () => void;
  /**
   * Reads the current parallax offset.
   *
   * Called once per frame by the render loop, and doubles as the tick that
   * re-enables parallax after the post-drag cooldown has elapsed.
   */
  getSnapshot: () => CameraMotionSnapshot;
};

/**
 * Translates pointer movement over the stage into a camera parallax offset.
 *
 * Two rules shape the behavior:
 *
 * 1. Parallax is mouse only. Touch and pen drive the badge directly, and moving
 *    the camera at the same time reads as the scene lurching.
 * 2. After a drag ends the camera stays put for a short cooldown. Without it,
 *    letting go would immediately snap the camera to wherever the pointer
 *    happened to stop, fighting the badge's own swing-back animation.
 *
 * Because the cooldown outlives the pointer event that started it, the last
 * pointer position is remembered and applied later, on the first frame after
 * the cooldown expires.
 */
export function createCameraMotionTracker(deps: CameraMotionTrackerDeps): CameraMotionTracker {
  const now = deps.now ?? defaultNowMs;
  const resumeDelayMs = NAME_BADGE_PREVIEW_CAMERA_TUNING.resumeAfterDragDelayMs ?? 0;

  const cameraMotion: CameraMotionSnapshot = { normalizedX: 0, normalizedY: 0 };

  let blockedUntilMs = 0;
  let resumePending = false;
  let lastPointerType = "";
  let lastPointerLocal: StagePoint | null = null;

  return {
    handlePointerMove(local, pointerType) {
      lastPointerType = pointerType;
      lastPointerLocal = local;

      if (pointerType !== "mouse" || deps.isDragging() || now() < blockedUntilMs) {
        reset();
        return;
      }

      resumePending = false;
      applyLocal(local);
    },

    handlePointerDown(local, pointerType) {
      // A drag is starting: drop any pending resume and park the camera.
      resumePending = false;
      lastPointerType = pointerType;
      lastPointerLocal = local;
      reset();
    },

    handlePointerUp(local, pointerType) {
      blockedUntilMs = now() + resumeDelayMs;
      resumePending = true;
      lastPointerType = pointerType;
      lastPointerLocal = local ?? lastPointerLocal;
      reset();
    },

    handlePointerLeave() {
      // The pointer is gone, so there is nothing to resume to.
      resumePending = false;
      lastPointerLocal = null;
      reset();
    },

    getSnapshot() {
      applyPendingResume();
      return {
        normalizedX: cameraMotion.normalizedX,
        normalizedY: cameraMotion.normalizedY,
      };
    },
  };

  function applyPendingResume() {
    if (!resumePending) return;
    if (now() < blockedUntilMs) return;

    resumePending = false;

    if (lastPointerType !== "mouse" || deps.isDragging() || !lastPointerLocal) {
      reset();
      return;
    }

    applyLocal(lastPointerLocal);
  }

  function applyLocal(local: StagePoint) {
    const ratioX = clamp(local.x / deps.stage.width, 0, 1);
    const ratioY = clamp(local.y / deps.stage.height, 0, 1);

    cameraMotion.normalizedX = ratioX * 2 - 1;
    cameraMotion.normalizedY = (0.5 - ratioY) * 2;
  }

  function reset() {
    cameraMotion.normalizedX = 0;
    cameraMotion.normalizedY = 0;
  }
}

/**
 * `performance.now()` where available, falling back to `Date.now()`.
 *
 * Only the difference between two readings matters here, so mixing time bases
 * across a reload is harmless.
 */
function defaultNowMs() {
  if (import.meta.client && typeof performance !== "undefined") {
    return performance.now();
  }
  return Date.now();
}
