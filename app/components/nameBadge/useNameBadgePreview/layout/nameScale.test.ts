import { describe, expect, it } from "vite-plus/test";
import { measureNameWidthUnits, resolveNameScaleX } from "./nameScale";

describe("measureNameWidthUnits", () => {
  it("counts latin characters as one unit each", () => {
    expect(measureNameWidthUnits("Evan")).toBe(4);
  });

  it("counts kanji, hiragana and katakana as two units each", () => {
    expect(measureNameWidthUnits("西村")).toBe(4);
    expect(measureNameWidthUnits("にしむら")).toBe(8);
    expect(measureNameWidthUnits("ニシムラ")).toBe(8);
  });

  it("counts hangul as two units each", () => {
    expect(measureNameWidthUnits("한국")).toBe(4);
  });

  it("adds up mixed scripts", () => {
    expect(measureNameWidthUnits("日本語 Evan")).toBe(6 + 1 + 4);
  });

  it("counts digits, spaces and punctuation as one unit each", () => {
    expect(measureNameWidthUnits("a b-1")).toBe(5);
  });

  it("returns zero for an empty or missing name", () => {
    expect(measureNameWidthUnits("")).toBe(0);
    expect(measureNameWidthUnits(undefined)).toBe(0);
  });

  it("counts an astral character once, not once per code unit", () => {
    expect(measureNameWidthUnits("🎉")).toBe(1);
  });
});

describe("resolveNameScaleX", () => {
  const latinName = (units: number) => "a".repeat(units);

  it("does not compress a name that fits", () => {
    expect(resolveNameScaleX("")).toBe(1);
    expect(resolveNameScaleX(undefined)).toBe(1);
    expect(resolveNameScaleX(latinName(12))).toBe(1);
  });

  it.each([
    [13, 0.9],
    [16, 0.9],
    [17, 0.85],
    [20, 0.85],
    [21, 0.8],
    [24, 0.8],
    [25, 0.7],
    [28, 0.7],
    [29, 0.6],
    [32, 0.6],
    [33, 0.5],
    [80, 0.5],
  ])("compresses a %i unit name to %f", (units, expected) => {
    expect(resolveNameScaleX(latinName(units))).toBe(expected);
  });

  it("compresses full-width names twice as fast as latin ones", () => {
    // Six kanji are twelve units, the last width that still fits.
    expect(resolveNameScaleX("西村西村西村")).toBe(1);
    expect(resolveNameScaleX("西村西村西村西")).toBe(0.9);
  });

  it("never grows a name", () => {
    for (const units of [0, 1, 12, 13, 33, 200]) {
      expect(resolveNameScaleX(latinName(units))).toBeLessThanOrEqual(1);
    }
  });

  it("is monotonically non-increasing as the name grows", () => {
    let previous = Number.POSITIVE_INFINITY;
    for (let units = 0; units <= 40; units += 1) {
      const scale = resolveNameScaleX(latinName(units));
      expect(scale).toBeLessThanOrEqual(previous);
      previous = scale;
    }
  });
});
