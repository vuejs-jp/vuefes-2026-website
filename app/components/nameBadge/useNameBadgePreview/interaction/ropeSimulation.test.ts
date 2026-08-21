import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_ROPE_TUNING, NAME_BADGE_SPRING_TUNING } from "../constant";
import { createRopeSimulation, type RopeSimulationBounds } from "./ropeSimulation";

/** A stage roughly the size of the desktop ticket page. */
const BOUNDS: RopeSimulationBounds = {
  anchorX: 400,
  anchorY: NAME_BADGE_ROPE_TUNING.ropeStartY,
  ropeRestLength: NAME_BADGE_ROPE_TUNING.ropeLength,
  cardWidth: 253.52,
  stageWidth: 800,
  stageHeight: 508,
};

const REST_X = BOUNDS.anchorX;
const REST_Y = BOUNDS.anchorY + BOUNDS.ropeRestLength;

/** Horizontal range the tip is clamped to, derived the same way the model does. */
const MIN_TIP_X = BOUNDS.cardWidth * 0.5 + NAME_BADGE_ROPE_TUNING.stageBoundsInsetX;
const MAX_TIP_X =
  BOUNDS.stageWidth - BOUNDS.cardWidth * 0.5 - NAME_BADGE_ROPE_TUNING.stageBoundsInsetX;
const MAX_TIP_Y = BOUNDS.stageHeight - NAME_BADGE_ROPE_TUNING.stageBoundsInsetBottom;

const FRAME = 1 / 60;

function stepFrames(rope: ReturnType<typeof createRopeSimulation>, frames: number) {
  for (let i = 0; i < frames; i += 1) {
    rope.step(FRAME);
  }
}

function distanceFromAnchor(x: number, y: number) {
  return Math.hypot(x - BOUNDS.anchorX, y - BOUNDS.anchorY);
}

/** Total length of the rope polyline, i.e. how much of it is actually paid out. */
function polylineLength(ropeX: Float32Array, ropeY: Float32Array) {
  let length = 0;
  for (let i = 1; i < ropeX.length; i += 1) {
    length += Math.hypot(ropeX[i]! - ropeX[i - 1]!, ropeY[i]! - ropeY[i - 1]!);
  }
  return length;
}

describe("createRopeSimulation", () => {
  describe("initial state", () => {
    it("hangs straight down from the anchor", () => {
      const rope = createRopeSimulation(BOUNDS);

      expect(rope.tipX).toBeCloseTo(REST_X, 4);
      expect(rope.tipY).toBeCloseTo(REST_Y, 4);
    });

    it("starts completely still", () => {
      const snapshot = createRopeSimulation(BOUNDS).getSnapshot();

      expect(snapshot.velX).toBe(0);
      expect(snapshot.velY).toBe(0);
    });

    it("has one more particle than there are physics segments", () => {
      const snapshot = createRopeSimulation(BOUNDS).getSnapshot();
      const expected = NAME_BADGE_SPRING_TUNING.ropePhysicsSegments + 1;

      expect(snapshot.ropeX).toHaveLength(expected);
      expect(snapshot.ropeY).toHaveLength(expected);
    });

    it("spaces the particles evenly along the rope", () => {
      const { ropeX, ropeY } = createRopeSimulation(BOUNDS).getSnapshot();
      const segmentLength = BOUNDS.ropeRestLength / (ropeX.length - 1);

      for (let i = 0; i < ropeX.length; i += 1) {
        expect(ropeX[i]).toBeCloseTo(BOUNDS.anchorX, 3);
        expect(ropeY[i]).toBeCloseTo(BOUNDS.anchorY + segmentLength * i, 3);
      }
    });
  });

  describe("reset", () => {
    it("returns the badge to rest after it has been disturbed", () => {
      const rope = createRopeSimulation(BOUNDS);

      rope.beginDrag(600, 300);
      stepFrames(rope, 10);
      rope.endDrag();
      rope.reset("rest");

      expect(rope.tipX).toBeCloseTo(REST_X, 4);
      expect(rope.tipY).toBeCloseTo(REST_Y, 4);
      expect(rope.getSnapshot().velX).toBe(0);
    });

    it("defaults to the rest pose", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(600, 300);
      stepFrames(rope, 10);
      rope.endDrag();
      rope.reset();

      expect(rope.tipY).toBeCloseTo(REST_Y, 4);
    });

    it("places the badge at the configured start point for the entry animation", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      expect(rope.tipX).toBeCloseTo(BOUNDS.stageWidth * NAME_BADGE_ROPE_TUNING.initialTipXRatio, 3);
      expect(rope.tipY).toBeCloseTo(NAME_BADGE_ROPE_TUNING.initialTipY, 3);
    });

    it("lets the entry pose start above the anchor's usual lower bound", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      // Far higher than the rest pose: the badge has yet to fall.
      expect(rope.tipY).toBeLessThan(REST_Y);
    });

    it("pays out the whole rope as slack for the entry pose", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      const { ropeX, ropeY } = rope.getSnapshot();
      const direct = distanceFromAnchor(rope.tipX, rope.tipY);

      // The tip is far closer than the rope is long, so the excess is folded up.
      expect(direct).toBeLessThan(BOUNDS.ropeRestLength * 0.8);
      expect(polylineLength(ropeX, ropeY)).toBeCloseTo(BOUNDS.ropeRestLength, -2);
    });

    it("starts the entry pose still", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      expect(rope.getSnapshot().velX).toBeCloseTo(0, 6);
      expect(rope.getSnapshot().velY).toBeCloseTo(0, 6);
    });
  });

  describe("stepping", () => {
    it("does nothing for a zero-length step", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      const before = { x: rope.tipX, y: rope.tipY };

      rope.step(0);

      expect(rope.tipX).toBe(before.x);
      expect(rope.tipY).toBe(before.y);
    });

    it("drops the badge under gravity from the entry pose", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      const startY = rope.tipY;

      stepFrames(rope, 30);

      expect(rope.tipY).toBeGreaterThan(startY);
    });

    it("keeps the anchor particle pinned", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      stepFrames(rope, 60);

      const { ropeX, ropeY } = rope.getSnapshot();
      expect(ropeX[0]).toBeCloseTo(BOUNDS.anchorX, 4);
      expect(ropeY[0]).toBeCloseTo(BOUNDS.anchorY, 4);
    });

    it("never lets the rope stretch past its rest length", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      for (let i = 0; i < 300; i += 1) {
        rope.step(FRAME);
        expect(distanceFromAnchor(rope.tipX, rope.tipY)).toBeLessThanOrEqual(
          BOUNDS.ropeRestLength * 1.01,
        );
      }
    });

    it("survives a very long frame without exploding", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");

      rope.step(30);

      expect(Number.isFinite(rope.tipX)).toBe(true);
      expect(Number.isFinite(rope.tipY)).toBe(true);
      expect(distanceFromAnchor(rope.tipX, rope.tipY)).toBeLessThanOrEqual(
        BOUNDS.ropeRestLength * 1.01,
      );
    });

    it("comes to a stop hanging vertically below the anchor", () => {
      const rope = createRopeSimulation(BOUNDS);
      stepFrames(rope, 300);

      const snapshot = rope.getSnapshot();
      expect(rope.tipX).toBe(REST_X);
      expect(Math.hypot(snapshot.velX, snapshot.velY)).toBeCloseTo(0, 2);
    });

    it("hangs a little below the ideal rest length, because the card stretches the rope", () => {
      const rope = createRopeSimulation(BOUNDS);
      stepFrames(rope, 300);

      // The constraint solver trades a small amount of stretch for stability,
      // so equilibrium sits just under the geometric rest position.
      expect(rope.tipY).toBeGreaterThan(REST_Y);
      expect(rope.tipY).toBeLessThan(REST_Y + 5);
    });

    it("swings itself down to near the rest pose after the entry animation", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      stepFrames(rope, 2000);

      const snapshot = rope.getSnapshot();
      expect(rope.tipX).toBeCloseTo(REST_X, -1);
      expect(rope.tipY).toBeCloseTo(REST_Y, -1);
      expect(Math.hypot(snapshot.velX, snapshot.velY)).toBeLessThan(1);
    });
  });

  describe("dragging", () => {
    it("puts the tip on the drag target from the very next step", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);
      rope.step(FRAME);

      expect(rope.tipX).toBeCloseTo(600, 3);
      expect(rope.tipY).toBeCloseTo(30, 3);
    });

    it("holds the tip on the target for as long as the drag lasts", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);
      stepFrames(rope, 120);

      expect(rope.tipX).toBeCloseTo(600, 3);
      expect(rope.tipY).toBeCloseTo(30, 3);
    });

    it("does not move the tip before the first step", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);

      expect(rope.tipX).toBeCloseTo(REST_X, 3);
      expect(rope.tipY).toBeCloseTo(REST_Y, 3);
    });

    it("keeps the card inside the stage when dragged past the edge", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(100_000, 100_000);
      stepFrames(rope, 200);

      expect(rope.tipX).toBeGreaterThanOrEqual(MIN_TIP_X - 0.01);
      expect(rope.tipX).toBeLessThanOrEqual(MAX_TIP_X + 0.01);
      expect(rope.tipY).toBeLessThanOrEqual(MAX_TIP_Y + 0.01);
    });

    it("keeps the badge within reach of the rope when dragged away", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(-100_000, 100_000);
      stepFrames(rope, 200);

      expect(distanceFromAnchor(rope.tipX, rope.tipY)).toBeLessThanOrEqual(
        BOUNDS.ropeRestLength + NAME_BADGE_ROPE_TUNING.maxDragExtra + 0.01,
      );
    });

    it("projects an out-of-reach target onto the rope's reach circle", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(100_000, 100_000);
      stepFrames(rope, 60);

      // Pulled taut towards the far corner rather than clamped to the stage edge.
      expect(distanceFromAnchor(rope.tipX, rope.tipY)).toBeCloseTo(BOUNDS.ropeRestLength, 2);
      expect(rope.tipX).toBeGreaterThan(REST_X);
      expect(rope.tipY).toBeLessThan(REST_Y);
    });

    it("holds the badge exactly where it is put, without settling it", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(REST_X, REST_Y);
      stepFrames(rope, 120);

      // Left to itself the badge would sag a little below this point; held, it
      // stays put.
      expect(rope.tipY).toBeCloseTo(REST_Y, 3);
    });

    it("hands the badge back to gravity when released", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);
      stepFrames(rope, 120);
      rope.endDrag();

      const heldX = rope.tipX;
      stepFrames(rope, 20);

      expect(rope.tipX).toBeLessThan(heldX);
    });

    it("swings back towards rest after being released", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);
      stepFrames(rope, 120);
      rope.endDrag();
      stepFrames(rope, 2000);

      const snapshot = rope.getSnapshot();
      expect(rope.tipX).toBeCloseTo(REST_X, -1);
      expect(Math.hypot(snapshot.velX, snapshot.velY)).toBeLessThan(1);
    });

    it("takes over from an in-flight entry animation", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      rope.beginDrag(rope.tipX, rope.tipY);
      rope.setDragTarget(600, 30);
      stepFrames(rope, 60);

      expect(rope.tipX).toBeCloseTo(600, 3);
      expect(rope.tipY).toBeCloseTo(30, 3);
    });
  });

  describe("snapshot", () => {
    it("reports the tip position it exposes directly", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      stepFrames(rope, 10);

      const snapshot = rope.getSnapshot();
      expect(snapshot.tipX).toBe(rope.tipX);
      expect(snapshot.tipY).toBe(rope.tipY);
    });

    it("ends the rope at the tip", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      stepFrames(rope, 10);

      const { ropeX, ropeY, tipX, tipY } = rope.getSnapshot();
      expect(ropeX.at(-1)).toBe(tipX);
      expect(ropeY.at(-1)).toBe(tipY);
    });

    it("reports a downward velocity while the badge is falling", () => {
      const rope = createRopeSimulation(BOUNDS);
      rope.reset("entry");
      stepFrames(rope, 20);

      expect(rope.getSnapshot().velY).toBeGreaterThan(0);
    });
  });
});
