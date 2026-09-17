import { describe, expect, it } from "vite-plus/test";
import { excludeSponsorPrograms, findUnlistedJobBoardSponsorIds } from "./relations";
import { JOB_BOARDS } from "./job-board";
import { SPONSORS } from "./sponsors";

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

describe("job board relations", () => {
  it("reports job boards whose sponsor is missing the job-board option", () => {
    const jobBoards = [{ sponsorId: "listed" }, { sponsorId: "unlisted" }, { sponsorId: "typo" }];
    const sponsors = [
      { id: "listed", option: ["job-board"] },
      { id: "unlisted", option: ["exhibition"] },
    ];

    expect(findUnlistedJobBoardSponsorIds(jobBoards, sponsors)).toEqual(["unlisted", "typo"]);
  });

  it("keeps every job board pointing at a job-board option sponsor", () => {
    const sponsorIds = JOB_BOARDS.map((jobBoard) => jobBoard.sponsorId);

    expect(new Set(sponsorIds).size).toBe(sponsorIds.length);
    expect(findUnlistedJobBoardSponsorIds(JOB_BOARDS, SPONSORS.JOB_BOARD)).toEqual([]);
  });
});
