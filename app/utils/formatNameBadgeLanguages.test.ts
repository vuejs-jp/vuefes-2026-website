import { describe, expect, it } from "vite-plus/test";

import { formatNameBadgeLanguages } from "./formatNameBadgeLanguages";

describe("formatNameBadgeLanguages", () => {
  it("formats Japanese as JP", () => {
    expect(formatNameBadgeLanguages("ja")).toBe("JP");
  });

  it("formats multiple languages in uppercase separated by slashes", () => {
    expect(formatNameBadgeLanguages("ja, en, zh")).toBe("JP/EN/ZH");
  });

  it("normalizes whitespace and casing", () => {
    expect(formatNameBadgeLanguages(" JA,en, Pt ")).toBe("JP/EN/PT");
  });

  it("returns an empty string when languages are unavailable", () => {
    expect(formatNameBadgeLanguages(undefined)).toBe("");
    expect(formatNameBadgeLanguages("  ")).toBe("");
  });
});
