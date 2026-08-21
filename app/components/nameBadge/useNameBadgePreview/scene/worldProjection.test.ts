import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_PREVIEW_WORLD_TUNING } from "../constant";
import { createWorldProjection } from "./worldProjection";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 500;
const CARD_HEIGHT_PX = 360;
/** Stage pixels per world unit for the metrics above. */
const SCALE = CARD_HEIGHT_PX / NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;

const projection = createWorldProjection({
  stageWidth: STAGE_WIDTH,
  stageHeight: STAGE_HEIGHT,
  cardHeightPx: CARD_HEIGHT_PX,
});

describe("createWorldProjection", () => {
  describe("toWorldX", () => {
    it("puts the centre of the stage at the world origin", () => {
      expect(projection.toWorldX(STAGE_WIDTH / 2)).toBeCloseTo(0, 10);
    });

    it("keeps the x axis pointing the same way", () => {
      expect(projection.toWorldX(STAGE_WIDTH / 2 + SCALE)).toBeCloseTo(1, 10);
      expect(projection.toWorldX(STAGE_WIDTH / 2 - SCALE)).toBeCloseTo(-1, 10);
    });

    it("is linear", () => {
      const a = projection.toWorldX(100);
      const b = projection.toWorldX(200);
      const c = projection.toWorldX(300);

      expect(b - a).toBeCloseTo(c - b, 10);
    });
  });

  describe("toWorldY", () => {
    it("puts the centre of the stage at the world origin", () => {
      expect(projection.toWorldY(STAGE_HEIGHT / 2)).toBeCloseTo(0, 10);
    });

    it("flips the y axis, since stage pixels grow downwards", () => {
      expect(projection.toWorldY(STAGE_HEIGHT / 2 - SCALE)).toBeCloseTo(1, 10);
      expect(projection.toWorldY(STAGE_HEIGHT / 2 + SCALE)).toBeCloseTo(-1, 10);
    });
  });

  describe("toWorldSize", () => {
    it("maps the card's pixel height onto its world height", () => {
      expect(projection.toWorldSize(CARD_HEIGHT_PX)).toBeCloseTo(
        NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld,
        10,
      );
    });

    it("maps one world unit's worth of pixels onto one unit", () => {
      expect(projection.toWorldSize(SCALE)).toBeCloseTo(1, 10);
    });

    it("ignores the origin, since it converts lengths rather than points", () => {
      expect(projection.toWorldSize(0)).toBe(0);
      expect(projection.toWorldSize(10)).toBeCloseTo(-projection.toWorldSize(-10), 10);
    });

    it("agrees with the difference between two projected points", () => {
      const delta = projection.toWorldX(300) - projection.toWorldX(200);

      expect(delta).toBeCloseTo(projection.toWorldSize(100), 10);
    });
  });

  it("keeps the card the same on-screen size when the stage grows", () => {
    const wide = createWorldProjection({
      stageWidth: 2000,
      stageHeight: STAGE_HEIGHT,
      cardHeightPx: CARD_HEIGHT_PX,
    });

    // The scale is anchored to the card, not the stage.
    expect(wide.toWorldSize(100)).toBeCloseTo(projection.toWorldSize(100), 10);
  });

  it("reads its metrics live, so it tracks a resize", () => {
    const metrics = { stageWidth: 800, stageHeight: 500, cardHeightPx: 360 };
    const live = createWorldProjection({
      get stageWidth() {
        return metrics.stageWidth;
      },
      get stageHeight() {
        return metrics.stageHeight;
      },
      get cardHeightPx() {
        return metrics.cardHeightPx;
      },
    });

    expect(live.toWorldX(400)).toBeCloseTo(0, 10);

    metrics.stageWidth = 1000;
    expect(live.toWorldX(500)).toBeCloseTo(0, 10);
  });
});
