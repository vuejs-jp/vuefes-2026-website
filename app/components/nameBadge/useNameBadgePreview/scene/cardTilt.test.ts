import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_CARD_TILT_TUNING } from "../constant";
import { computeCardTiltDegrees, type CardTiltInput } from "./cardTilt";

const ANCHOR_X = 400;
const ANCHOR_Y = -1000;
const ROPE_REST_LENGTH = 1080;

function tiltAt(overrides: Partial<CardTiltInput> = {}) {
  return computeCardTiltDegrees({
    tipX: ANCHOR_X,
    tipY: ANCHOR_Y + ROPE_REST_LENGTH,
    velX: 0,
    velY: 0,
    anchorX: ANCHOR_X,
    anchorY: ANCHOR_Y,
    ropeRestLength: ROPE_REST_LENGTH,
    ...overrides,
  });
}

describe("computeCardTiltDegrees", () => {
  describe("at rest", () => {
    it("hangs square to the camera horizontally", () => {
      const tilt = tiltAt();

      expect(tilt.roll).toBe(0);
      expect(tilt.yaw).toBe(0);
    });

    it("tips slightly forward, so the card never looks like a flat sticker", () => {
      expect(tiltAt().pitch).toBe(NAME_BADGE_CARD_TILT_TUNING.pitchBaseDeg);
      expect(tiltAt().pitch).toBeLessThan(0);
    });
  });

  describe("responding to position", () => {
    it("leans and turns when the badge hangs to one side", () => {
      const tilt = tiltAt({ tipX: ANCHOR_X + 50 });

      expect(tilt.roll).toBeGreaterThan(0);
      expect(tilt.yaw).toBeGreaterThan(0);
    });

    it("mirrors the lean on the other side", () => {
      const right = tiltAt({ tipX: ANCHOR_X + 50 });
      const left = tiltAt({ tipX: ANCHOR_X - 50 });

      expect(left.roll).toBeCloseTo(-right.roll, 10);
      expect(left.yaw).toBeCloseTo(-right.yaw, 10);
    });

    it("rolls further than it yaws, so the lean reads before the turn", () => {
      const tilt = tiltAt({ tipX: ANCHOR_X + 50 });

      expect(Math.abs(tilt.roll)).toBeGreaterThan(Math.abs(tilt.yaw));
    });

    it("tips further forward as the badge is lifted above its rest height", () => {
      const lifted = tiltAt({ tipY: ANCHOR_Y + ROPE_REST_LENGTH - 200 });

      expect(lifted.pitch).toBeGreaterThan(tiltAt().pitch);
    });
  });

  describe("responding to velocity", () => {
    it("banks into a sideways swing", () => {
      const moving = tiltAt({ velX: 300 });

      expect(moving.roll).toBeGreaterThan(0);
      expect(moving.yaw).toBeGreaterThan(0);
    });

    it("adds the position and velocity contributions", () => {
      const offsetOnly = tiltAt({ tipX: ANCHOR_X + 50 });
      const velocityOnly = tiltAt({ velX: 300 });
      const both = tiltAt({ tipX: ANCHOR_X + 50, velX: 300 });

      expect(both.roll).toBeCloseTo(offsetOnly.roll + velocityOnly.roll, 10);
    });

    it("reacts to vertical velocity through the pitch", () => {
      expect(tiltAt({ velY: 500 }).pitch).toBeLessThan(tiltAt().pitch);
    });
  });

  describe("limits", () => {
    it("clamps the roll", () => {
      expect(tiltAt({ tipX: ANCHOR_X + 100_000 }).roll).toBe(
        NAME_BADGE_CARD_TILT_TUNING.rollLimitDeg,
      );
      expect(tiltAt({ tipX: ANCHOR_X - 100_000 }).roll).toBe(
        -NAME_BADGE_CARD_TILT_TUNING.rollLimitDeg,
      );
    });

    it("clamps the yaw", () => {
      expect(tiltAt({ tipX: ANCHOR_X + 100_000 }).yaw).toBe(
        NAME_BADGE_CARD_TILT_TUNING.yawLimitDeg,
      );
      expect(tiltAt({ tipX: ANCHOR_X - 100_000 }).yaw).toBe(
        -NAME_BADGE_CARD_TILT_TUNING.yawLimitDeg,
      );
    });

    it("clamps the pitch asymmetrically, matching how the badge is looked at", () => {
      expect(tiltAt({ velY: 100_000 }).pitch).toBe(NAME_BADGE_CARD_TILT_TUNING.pitchMinDeg);
      expect(tiltAt({ velY: -100_000 }).pitch).toBe(NAME_BADGE_CARD_TILT_TUNING.pitchMaxDeg);
    });

    it("stays within its limits for any input", () => {
      for (const tipX of [-10_000, 0, 400, 10_000]) {
        for (const velX of [-5000, 0, 5000]) {
          const tilt = tiltAt({ tipX, velX });

          expect(Math.abs(tilt.roll)).toBeLessThanOrEqual(NAME_BADGE_CARD_TILT_TUNING.rollLimitDeg);
          expect(Math.abs(tilt.yaw)).toBeLessThanOrEqual(NAME_BADGE_CARD_TILT_TUNING.yawLimitDeg);
        }
      }
    });
  });
});
