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
import { resolveProgram } from "./utils";

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

      const facilitatorIds = program.facilitatorIds ?? [];
      expect(new Set(facilitatorIds).size).toBe(facilitatorIds.length);
      expect(facilitatorIds.every((speakerId) => knownSpeakerIds.has(speakerId))).toBe(true);
      expect(facilitatorIds.every((speakerId) => !program.speakerIds.includes(speakerId))).toBe(
        true,
      );
    }
  });

  it("assigns the timetable sessions to the specified speakers", () => {
    const expectedSpeakerIds = [
      "posva",
      "jp-knj",
      "ics-ikeda",
      "ykoizumi0903",
      "wan9chi",
      "ktsn",
      "naokihaba",
      "hiranuma",
      "yamanoku",
      "ubugeeei",
      "Hal-Spidernight",
      "is78-dev",
      "t0daaay",
      "themarcba",
      "alvarosabu",
      "yut0naga1",
      "mnmxmx",
      "ushironoko",
    ];
    const timetableSessions = SESSION_PROGRAMS.filter((program) =>
      /^session-\d+$/.test(program.id),
    );

    expect(timetableSessions.map((program) => program.speakerIds[0])).toEqual(expectedSpeakerIds);
    for (const program of timetableSessions) {
      expect(program.speakerIds).toHaveLength(1);
      expect(program.url).toBe(`/speaker/${program.speakerIds[0]}`);
    }
  });

  it("links every CFP program to its speaker page", () => {
    const guestSpeakerIds = new Set(["posva", "wan9chi", "ubugeeei", "mnmxmx"]);
    const cfpPrograms = [
      ...SESSION_PROGRAMS.filter(
        (program) =>
          /^session-\d+$/.test(program.id) &&
          !program.speakerIds.some((speakerId) => guestSpeakerIds.has(speakerId)),
      ),
      ...LIGHTNING_TALK_PROGRAMS.filter((program) => /^lightning-talk-\d+$/.test(program.id)),
    ];

    expect(cfpPrograms).toHaveLength(24);
    for (const program of cfpPrograms) {
      const speakerId = program.speakerIds.at(0);

      expect(program.speakerIds).toHaveLength(1);
      expect(program.url).toBe(`/speaker/${speakerId}`);
      expect(program.ja.title).not.toBe("TBD");
      expect(program.en.title).not.toBe("TBD");
      expect(program.ja.overview).toBeTruthy();
      expect(program.en.overview).toBeTruthy();
      expect(SPEAKERS.find((speaker) => speaker.id === speakerId)?.avatarUrl).toBe(
        `/images/avatars/${speakerId}.png`,
      );
    }
  });

  it("models student support content as a program", () => {
    expect(EVENT_PROGRAMS).toContainEqual(
      expect.objectContaining({
        id: "student-support-contents",
        type: "event",
        start: "12:00",
        end: "12:30",
        tracks: ["track4"],
        url: "/event?session=student-support-contents#student-support-contents",
        ja: { title: "学生支援限定ランチ会" },
        en: { title: "Student Support Lunch Meetup" },
      }),
    );
  });

  it("defines the JavaScript ecosystem panel discussion", () => {
    expect(PANEL_DISCUSSION_PROGRAMS).toContainEqual({
      id: "panel-discussion-1",
      type: "panelDiscussion",
      speakerIds: ["yyx990803", "yosuke-furukawa", "alii", "crowlKats"],
      facilitatorIds: ["re-taro"],
      start: "15:50",
      end: "16:50",
      tracks: ["track1"],
      ja: { title: "JavaScriptエコシステムの境界線を問い直す" },
      en: { title: "Rethinking Boundaries in the JavaScript Ecosystem" },
    });

    const panel = PANEL_DISCUSSION_PROGRAMS.find((program) => program.id === "panel-discussion-1");
    expect(panel).toBeDefined();
    const resolvedPanel = resolveProgram(panel!, SPEAKERS, "ja");
    expect(resolvedPanel.speakers.map((speaker) => speaker.id)).toEqual([
      "yyx990803",
      "yosuke-furukawa",
      "alii",
      "crowlKats",
    ]);
    expect(resolvedPanel.facilitators.map((speaker) => speaker.id)).toEqual(["re-taro"]);
  });

  it("uses TBD as the platinum sponsor program title", () => {
    const sponsorPrograms = PROGRAMS.filter((program) =>
      program.id.startsWith("platinum-sponsor-session-"),
    );

    expect(sponsorPrograms).toHaveLength(6);
    for (const program of sponsorPrograms) {
      expect(program.ja.title).toBe("TBD");
      expect(program.en.title).toBe("TBD");
    }
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
