import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_ROPE_VISUAL_TUNING } from "../constant";
import { sampleCatmullRom, writeRopeCurve, writeRopeRibbon } from "./ropeRibbon";
import type { WorldProjection } from "./worldProjection";

/** Passes stage pixels straight through, so expectations stay readable. */
const IDENTITY_PROJECTION: WorldProjection = {
  toWorldX: (px) => px,
  toWorldY: (py) => py,
  toWorldSize: (px) => px,
};

const DEPTH = NAME_BADGE_ROPE_VISUAL_TUNING.ropeDepth;

describe("sampleCatmullRom", () => {
  const points = new Float32Array([0, 10, 40, 90, 160]);
  const lastIndex = points.length - 1;

  it("passes exactly through every control point", () => {
    for (let i = 0; i <= lastIndex; i += 1) {
      expect(sampleCatmullRom(points, i, lastIndex)).toBeCloseTo(points[i]!, 4);
    }
  });

  it("reproduces a straight line exactly", () => {
    const line = new Float32Array([0, 10, 20, 30, 40]);

    expect(sampleCatmullRom(line, 1.5, 4)).toBeCloseTo(15, 4);
    expect(sampleCatmullRom(line, 2.25, 4)).toBeCloseTo(22.5, 4);
  });

  it("stays between its neighboring control points for a monotonic input", () => {
    const value = sampleCatmullRom(points, 1.5, lastIndex);

    expect(value).toBeGreaterThan(points[1]!);
    expect(value).toBeLessThan(points[2]!);
  });

  it("eases into the ends instead of continuing straight through them", () => {
    const line = new Float32Array([0, 10, 20, 30, 40]);

    // The end control points are duplicated, which pulls the first span off the
    // straight line the interior spans follow exactly.
    expect(sampleCatmullRom(line, 0.5, 4)).not.toBeCloseTo(5, 4);
    expect(sampleCatmullRom(line, 0.5, 4)).toBeGreaterThan(0);
    expect(sampleCatmullRom(line, 0.5, 4)).toBeLessThan(10);
  });

  it("reads no further than the last control point", () => {
    expect(Number.isFinite(sampleCatmullRom(points, lastIndex, lastIndex))).toBe(true);
    expect(Number.isFinite(sampleCatmullRom(points, 0, lastIndex))).toBe(true);
  });

  it("handles a single-point rope without reading out of bounds", () => {
    expect(sampleCatmullRom(new Float32Array([7]), 0, 0)).toBeCloseTo(7, 4);
  });
});

describe("writeRopeCurve", () => {
  const segments = 8;

  function curveFor(ropeX: number[], ropeY: number[]) {
    const curve = new Float32Array((segments + 1) * 3);
    writeRopeCurve(
      curve,
      new Float32Array(ropeX),
      new Float32Array(ropeY),
      segments,
      IDENTITY_PROJECTION,
    );
    return curve;
  }

  it("starts at the anchor and ends at the tip", () => {
    const curve = curveFor([0, 10, 20, 30], [0, 100, 200, 300]);

    expect(curve[0]).toBeCloseTo(0, 3);
    expect(curve[1]).toBeCloseTo(0, 3);
    expect(curve[segments * 3]).toBeCloseTo(30, 3);
    expect(curve[segments * 3 + 1]).toBeCloseTo(300, 3);
  });

  it("keeps a vertical rope vertical, and running downwards", () => {
    const curve = curveFor([0, 0, 0, 0], [0, 100, 200, 300]);

    for (let i = 0; i <= segments; i += 1) {
      expect(curve[i * 3 + 0]).toBeCloseTo(0, 3);
      if (i > 0) {
        expect(curve[i * 3 + 1]).toBeGreaterThan(curve[(i - 1) * 3 + 1]!);
      }
    }
  });

  it("resamples the rope at a much higher resolution than the physics", () => {
    const curve = curveFor([0, 0, 0, 0], [0, 100, 200, 300]);

    expect(curve).toHaveLength((segments + 1) * 3);
    expect(segments).toBeGreaterThan(3);
  });

  it("puts every sample at the rope's depth, in front of the card", () => {
    const curve = curveFor([0, 10, 20, 30], [0, 100, 200, 300]);

    for (let i = 0; i <= segments; i += 1) {
      expect(curve[i * 3 + 2]).toBeCloseTo(DEPTH, 6);
    }
    expect(DEPTH).toBeGreaterThan(0);
  });

  it("projects through the given world projection", () => {
    const curve = new Float32Array((segments + 1) * 3);
    writeRopeCurve(curve, new Float32Array([0, 0]), new Float32Array([0, 100]), segments, {
      toWorldX: (px) => px / 10,
      toWorldY: (py) => -py / 10,
      toWorldSize: (px) => px / 10,
    });

    expect(curve[segments * 3 + 1]).toBeCloseTo(-10, 4);
  });
});

describe("writeRopeRibbon", () => {
  const segments = 4;
  const halfWidth = 3;

  /** A curve running straight down the y axis. */
  function verticalCurve() {
    const curve = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i += 1) {
      curve[i * 3 + 0] = 0;
      curve[i * 3 + 1] = i * 10;
      curve[i * 3 + 2] = DEPTH;
    }
    return curve;
  }

  function ribbonFor(curve: Float32Array) {
    const ribbon = new Float32Array((segments + 1) * 6);
    writeRopeRibbon(ribbon, curve, segments, halfWidth);
    return ribbon;
  }

  it("offsets the two edges sideways from a vertical curve", () => {
    const ribbon = ribbonFor(verticalCurve());

    for (let i = 0; i <= segments; i += 1) {
      const left = i * 6;
      expect(Math.abs(ribbon[left + 0]!)).toBeCloseTo(halfWidth, 4);
      expect(Math.abs(ribbon[left + 3]!)).toBeCloseTo(halfWidth, 4);
      expect(ribbon[left + 0]).toBeCloseTo(-ribbon[left + 3]!, 4);
    }
  });

  it("keeps the ribbon at a constant width", () => {
    const curve = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i += 1) {
      curve[i * 3 + 0] = i * i * 4;
      curve[i * 3 + 1] = i * 10;
      curve[i * 3 + 2] = DEPTH;
    }

    const ribbon = ribbonFor(curve);
    for (let i = 0; i <= segments; i += 1) {
      const left = i * 6;
      const width = Math.hypot(
        ribbon[left + 0]! - ribbon[left + 3]!,
        ribbon[left + 1]! - ribbon[left + 4]!,
      );
      expect(width).toBeCloseTo(halfWidth * 2, 4);
    }
  });

  it("centres the edges on the curve", () => {
    const curve = verticalCurve();
    const ribbon = ribbonFor(curve);

    for (let i = 0; i <= segments; i += 1) {
      const left = i * 6;
      expect((ribbon[left + 0]! + ribbon[left + 3]!) / 2).toBeCloseTo(curve[i * 3 + 0]!, 4);
      expect((ribbon[left + 1]! + ribbon[left + 4]!) / 2).toBeCloseTo(curve[i * 3 + 1]!, 4);
    }
  });

  it("puts both edges at the rope's depth", () => {
    const ribbon = ribbonFor(verticalCurve());

    for (let i = 0; i <= segments; i += 1) {
      expect(ribbon[i * 6 + 2]).toBeCloseTo(DEPTH, 6);
      expect(ribbon[i * 6 + 5]).toBeCloseTo(DEPTH, 6);
    }
  });

  it("follows a bend, so the ribbon twists with the rope", () => {
    const curve = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i += 1) {
      // An L-shaped curve: down, then across.
      curve[i * 3 + 0] = i < 2 ? 0 : (i - 1) * 10;
      curve[i * 3 + 1] = i < 2 ? i * 10 : 20;
      curve[i * 3 + 2] = DEPTH;
    }

    const ribbon = ribbonFor(curve);
    const firstOffsetX = ribbon[0]! - curve[0]!;
    const lastOffsetX = ribbon[segments * 6]! - curve[segments * 3]!;

    expect(Math.abs(firstOffsetX)).toBeCloseTo(halfWidth, 4);
    // Once the rope runs horizontally the edges separate vertically instead.
    expect(Math.abs(lastOffsetX)).toBeLessThan(halfWidth);
  });

  it("produces finite vertices for a degenerate curve", () => {
    const curve = new Float32Array((segments + 1) * 3);
    const ribbon = ribbonFor(curve);

    for (const value of ribbon) {
      expect(Number.isFinite(value)).toBe(true);
    }
  });
});
