import { describe, expect, it } from "vite-plus/test";
import { clamp, smoothingFactor } from "./math";

describe("clamp", () => {
  it("returns the value when it is already inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns the bounds for values on the edge", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("clamps values outside the range", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("supports negative ranges", () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(0, -10, -1)).toBe(-1);
  });

  it("resolves an inverted range to the maximum", () => {
    expect(clamp(5, 10, 0)).toBe(0);
  });
});

describe("smoothingFactor", () => {
  it("never moves when the speed is zero", () => {
    expect(smoothingFactor(0, 1)).toBe(0);
  });

  it("never moves across a zero-length step", () => {
    expect(smoothingFactor(24, 0)).toBe(0);
  });

  it("stays within (0, 1) for finite steps", () => {
    const factor = smoothingFactor(24, 1 / 120);
    expect(factor).toBeGreaterThan(0);
    expect(factor).toBeLessThan(1);
  });

  it("converges faster for higher speeds", () => {
    expect(smoothingFactor(48, 1 / 120)).toBeGreaterThan(smoothingFactor(24, 1 / 120));
  });

  it("converges faster for longer steps", () => {
    expect(smoothingFactor(24, 1 / 60)).toBeGreaterThan(smoothingFactor(24, 1 / 120));
  });

  it("is frame-rate independent: two half steps leave the same remainder as one full step", () => {
    const half = smoothingFactor(24, 1 / 240);
    const full = smoothingFactor(24, 1 / 120);

    expect((1 - half) * (1 - half)).toBeCloseTo(1 - full, 12);
  });

  it("approaches 1 for a very long step", () => {
    expect(smoothingFactor(24, 10)).toBeCloseTo(1, 12);
  });
});
