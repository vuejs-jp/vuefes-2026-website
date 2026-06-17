import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import {
  EVENT_PROGRAMS,
  LIGHTNING_TALK_PROGRAMS,
  PANEL_DISCUSSION_PROGRAMS,
  PROGRAMS,
  SESSION_PROGRAMS,
  type ProgramId,
} from "./programs";
import { SPEAKERS } from "./speakers";

describe("speaker and program relations", () => {
  it("infers program IDs as a literal union", () => {
    expectTypeOf<ProgramId>().not.toEqualTypeOf<string>();
    expectTypeOf<"session-1">().toExtend<ProgramId>();
    expectTypeOf<"unknown-program">().not.toExtend<ProgramId>();
  });

  it("keeps speakers unique and all program references valid", () => {
    const speakerIds = SPEAKERS.map((speaker) => speaker.id);
    const knownSpeakerIds = new Set(speakerIds);

    expect(knownSpeakerIds.size).toBe(speakerIds.length);

    for (const program of PROGRAMS) {
      expect(new Set(program.speakerIds).size).toBe(program.speakerIds.length);
      expect(program.speakerIds.every((speakerId) => knownSpeakerIds.has(speakerId))).toBe(true);
    }
  });

  it("supports programs with multiple speakers", () => {
    expect(PANEL_DISCUSSION_PROGRAMS[0]?.speakerIds.length).toBeGreaterThan(1);
  });

  it("supports speakers appearing in multiple programs", () => {
    const evanPrograms = PROGRAMS.filter((program) => program.speakerIds.includes("yyx990803"));

    expect(evanPrograms.length).toBeGreaterThan(1);
  });

  it("defines speaker-page URLs on programs explicitly", () => {
    expect(SESSION_PROGRAMS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "keynote",
          url: "/speaker/yyx990803",
        }),
      ]),
    );
  });

  it("models student support content as a program", () => {
    expect(EVENT_PROGRAMS).toContainEqual(
      expect.objectContaining({
        id: "student-support-contents",
        type: "event",
        start: "12:00",
        end: "12:30",
        tracks: ["track4"],
      }),
    );
  });

  it("defines the ten evening lightning talks", () => {
    expect(
      LIGHTNING_TALK_PROGRAMS.filter((program) =>
        /^lightning-talk-(?:[1-9]|10)$/.test(program.id),
      ).map((program) => program.id),
    ).toEqual([
      "lightning-talk-1",
      "lightning-talk-2",
      "lightning-talk-3",
      "lightning-talk-4",
      "lightning-talk-5",
      "lightning-talk-6",
      "lightning-talk-7",
      "lightning-talk-8",
      "lightning-talk-9",
      "lightning-talk-10",
    ]);
  });
});
