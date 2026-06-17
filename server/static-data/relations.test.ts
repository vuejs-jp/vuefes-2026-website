import { describe, expect, it } from "vite-plus/test";
import { excludeSponsorPrograms } from "./relations";

describe("program relations", () => {
  it("excludes every program referenced by sponsors", () => {
    const programs = [
      { id: "session", type: "session" },
      { id: "sponsor-session", type: "session" },
      { id: "panel", type: "panelDiscussion" },
      { id: "sponsor-lt", type: "lightningTalk" },
    ] as const;
    const sponsors = [
      { programIds: ["sponsor-session"] },
      { programIds: ["sponsor-lt", "sponsor-session"] },
    ];

    expect(excludeSponsorPrograms(programs, sponsors)).toEqual([
      { id: "session", type: "session" },
      { id: "panel", type: "panelDiscussion" },
    ]);
  });
});
