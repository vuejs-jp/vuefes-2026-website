import { Temporal } from "temporal-polyfill-lite";
import { describe, expect, it } from "vite-plus/test";

import { hasNameBadgeEditingDeadlinePassed } from "./hasNameBadgeEditingDeadlinePassed";

describe("hasNameBadgeEditingDeadlinePassed", () => {
  it("returns false before the editing deadline", () => {
    const currentInstant = Temporal.Instant.from("2026-09-15T14:58:59Z");

    expect(hasNameBadgeEditingDeadlinePassed(currentInstant)).toBe(false);
  });

  it("returns true at the editing deadline", () => {
    const currentInstant = Temporal.Instant.from("2026-09-15T14:59:00Z");

    expect(hasNameBadgeEditingDeadlinePassed(currentInstant)).toBe(true);
  });

  it("returns true after the editing deadline", () => {
    const currentInstant = Temporal.Instant.from("2026-09-15T14:59:01Z");

    expect(hasNameBadgeEditingDeadlinePassed(currentInstant)).toBe(true);
  });
});
