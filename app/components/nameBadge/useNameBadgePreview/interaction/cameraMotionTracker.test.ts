import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_PREVIEW_CAMERA_TUNING } from "../constant";
import { createCameraMotionTracker } from "./cameraMotionTracker";

const STAGE = { width: 800, height: 500 };
const CENTER = { x: STAGE.width / 2, y: STAGE.height / 2 };
const RESUME_DELAY = NAME_BADGE_PREVIEW_CAMERA_TUNING.resumeAfterDragDelayMs;

/** A tracker with a manual clock and a settable drag flag. */
function createHarness(options: { isDragging?: boolean } = {}) {
  const state = { nowMs: 0, isDragging: options.isDragging ?? false };
  const tracker = createCameraMotionTracker({
    stage: STAGE,
    isDragging: () => state.isDragging,
    now: () => state.nowMs,
  });

  return { tracker, state };
}

const ZERO = { normalizedX: 0, normalizedY: 0 };

describe("createCameraMotionTracker", () => {
  it("starts centred", () => {
    expect(createHarness().tracker.getSnapshot()).toEqual(ZERO);
  });

  describe("mapping the pointer onto the camera offset", () => {
    it("reports no offset at the centre of the stage", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove(CENTER, "mouse");

      expect(tracker.getSnapshot().normalizedX).toBeCloseTo(0, 10);
      expect(tracker.getSnapshot().normalizedY).toBeCloseTo(0, 10);
    });

    it("flips the y axis, so up on screen is positive", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");

      expect(tracker.getSnapshot()).toEqual({ normalizedX: -1, normalizedY: 1 });
    });

    it("reaches the opposite corner at the far edge", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: STAGE.width, y: STAGE.height }, "mouse");

      expect(tracker.getSnapshot()).toEqual({ normalizedX: 1, normalizedY: -1 });
    });

    it("clamps a pointer that has left the stage", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: -500, y: 9999 }, "mouse");

      expect(tracker.getSnapshot()).toEqual({ normalizedX: -1, normalizedY: -1 });
    });

    it("scales linearly across the stage", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: STAGE.width * 0.75, y: CENTER.y }, "mouse");

      expect(tracker.getSnapshot().normalizedX).toBeCloseTo(0.5, 10);
    });
  });

  describe("input that should not move the camera", () => {
    it.each(["touch", "pen", ""])("ignores %s input", (pointerType) => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: 0, y: 0 }, pointerType);

      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("ignores movement while the badge is being dragged", () => {
      const { tracker, state } = createHarness({ isDragging: true });
      tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");

      expect(tracker.getSnapshot()).toEqual(ZERO);
      state.isDragging = false;
    });

    it("parks the camera when the pointer goes down", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");
      tracker.handlePointerDown({ x: 0, y: 0 }, "mouse");

      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("parks the camera when the pointer leaves", () => {
      const { tracker } = createHarness();
      tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");
      tracker.handlePointerLeave();

      expect(tracker.getSnapshot()).toEqual(ZERO);
    });
  });

  describe("cooldown after a drag", () => {
    it("keeps the camera parked immediately after release", () => {
      const { tracker } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("stays parked until the cooldown has elapsed", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      state.nowMs = RESUME_DELAY - 1;
      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("resumes from the last pointer position once the cooldown expires", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual({ normalizedX: -1, normalizedY: 1 });
    });

    it("resumes at wherever the pointer has moved to during the cooldown", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      state.nowMs = 100;
      tracker.handlePointerMove({ x: STAGE.width, y: STAGE.height }, "mouse");
      expect(tracker.getSnapshot()).toEqual(ZERO);

      state.nowMs = RESUME_DELAY + 1;
      expect(tracker.getSnapshot()).toEqual({ normalizedX: 1, normalizedY: -1 });
    });

    it("keeps the previous position when the release lands outside the stage", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");
      tracker.handlePointerUp(null, "mouse");

      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual({ normalizedX: -1, normalizedY: 1 });
    });

    it("does not resume for a touch release", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "touch");

      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("does not resume while a new drag is already under way", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      state.isDragging = true;
      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("cancels the pending resume when the pointer leaves", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");
      tracker.handlePointerLeave();

      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("cancels the pending resume when a new drag starts", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");
      tracker.handlePointerDown({ x: 0, y: 0 }, "mouse");

      state.nowMs = RESUME_DELAY;
      expect(tracker.getSnapshot()).toEqual(ZERO);
    });

    it("resumes only once", () => {
      const { tracker, state } = createHarness();
      tracker.handlePointerUp({ x: 0, y: 0 }, "mouse");

      state.nowMs = RESUME_DELAY;
      tracker.getSnapshot();

      // A later drag flag must not be retro-applied by a second resume.
      state.isDragging = true;
      expect(tracker.getSnapshot()).toEqual({ normalizedX: -1, normalizedY: 1 });
    });
  });

  it("returns a copy, so callers cannot mutate the tracker's state", () => {
    const { tracker } = createHarness();
    tracker.handlePointerMove({ x: 0, y: 0 }, "mouse");

    const snapshot = tracker.getSnapshot();
    snapshot.normalizedX = 999;

    expect(tracker.getSnapshot().normalizedX).toBe(-1);
  });
});
