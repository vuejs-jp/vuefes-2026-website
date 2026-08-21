import { describe, expect, it } from "vite-plus/test";
import { parseAspectRatio, parsePxLength } from "./cssLength";

describe("parsePxLength", () => {
  it("parses a px length", () => {
    expect(parsePxLength("360px")).toBe(360);
  });

  it("parses a fractional px length", () => {
    expect(parsePxLength("253.52px")).toBe(253.52);
  });

  it("parses a bare number as pixels", () => {
    expect(parsePxLength("360")).toBe(360);
    expect(parsePxLength("253.52")).toBe(253.52);
  });

  it("ignores surrounding whitespace", () => {
    expect(parsePxLength("  360px  ")).toBe(360);
    expect(parsePxLength("\t360\n")).toBe(360);
  });

  it("returns null for a missing value", () => {
    expect(parsePxLength()).toBeNull();
    expect(parsePxLength("")).toBeNull();
  });

  it("returns null for relative units, which cannot be resolved here", () => {
    expect(parsePxLength("100%")).toBeNull();
    expect(parsePxLength("10rem")).toBeNull();
    expect(parsePxLength("50vw")).toBeNull();
    expect(parsePxLength("min(100%, 360px)")).toBeNull();
  });

  it("returns null for values that are not numbers", () => {
    expect(parsePxLength("px")).toBeNull();
    expect(parsePxLength("?px")).toBeNull();
    expect(parsePxLength("auto")).toBeNull();
  });
});

describe("parseAspectRatio", () => {
  it("parses a width / height ratio", () => {
    expect(parseAspectRatio("16 / 9")).toBeCloseTo(16 / 9, 12);
  });

  it("parses the badge ratios used by the ticket pages", () => {
    expect(parseAspectRatio("253.52 / 360")).toBeCloseTo(253.52 / 360, 12);
    expect(parseAspectRatio("200 / 284")).toBeCloseTo(200 / 284, 12);
  });

  it("tolerates whitespace around and between the terms", () => {
    expect(parseAspectRatio("16/9")).toBeCloseTo(16 / 9, 12);
    expect(parseAspectRatio("  16  /  9  ")).toBeCloseTo(16 / 9, 12);
  });

  it("returns null for a missing value", () => {
    expect(parseAspectRatio()).toBeNull();
    expect(parseAspectRatio("")).toBeNull();
  });

  it("returns null rather than Infinity for a zero denominator", () => {
    expect(parseAspectRatio("16 / 0")).toBeNull();
  });

  it("returns null for a single number", () => {
    expect(parseAspectRatio("1.7778")).toBeNull();
  });

  it("returns null for malformed input", () => {
    expect(parseAspectRatio("a / b")).toBeNull();
    expect(parseAspectRatio("16 : 9")).toBeNull();
    expect(parseAspectRatio("16 / 9 / 2")).toBeNull();
    expect(parseAspectRatio("-16 / 9")).toBeNull();
  });
});
