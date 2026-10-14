import { describe, expect, it } from "vite-plus/test";
import { SPONSORS } from "./sponsors";

describe("individual sponsors", () => {
  it("lists display names without surrounding whitespace or blanks", () => {
    for (const name of SPONSORS.INDIVIDUAL) {
      expect(name).toBe(name.trim());
      expect(name).not.toBe("");
    }
  });
});
