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
import { SPONSORS } from "./sponsors";
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
    expect(PANEL_DISCUSSION_PROGRAMS).toContainEqual(
      expect.objectContaining({
        id: "panel-discussion-1",
        type: "panelDiscussion",
        speakerIds: ["yyx990803", "yosuke-furukawa", "alii", "crowlKats"],
        facilitatorIds: ["re-taro"],
        start: "15:50",
        end: "16:50",
        tracks: ["track1"],
        ja: expect.objectContaining({ title: "JavaScriptエコシステムの境界線を問い直す" }),
        en: expect.objectContaining({ title: "Rethinking Boundaries in the JavaScript Ecosystem" }),
      }),
    );

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
    expect(resolvedPanel.overview).toContain("近年のJavaScriptエコシステムでは");
    expect(resolveProgram(panel!, SPEAKERS, "en").overview).toContain(
      "In recent years, tools in the JavaScript ecosystem",
    );

    for (const panelProgram of PANEL_DISCUSSION_PROGRAMS) {
      expect(resolveProgram(panelProgram, SPEAKERS, "ja").overview).toBeTruthy();
      expect(resolveProgram(panelProgram, SPEAKERS, "en").overview).toBeTruthy();
    }
  });

  it("publishes the submitted platinum sponsor program details", () => {
    const sponsorPrograms = PROGRAMS.filter((program) =>
      program.id.startsWith("platinum-sponsor-session-"),
    );

    expect(sponsorPrograms).toHaveLength(6);
    expect(
      sponsorPrograms.map((program) => ({
        id: program.id,
        speakerIds: program.speakerIds,
        title: program.ja.title,
      })),
    ).toEqual([
      {
        id: "platinum-sponsor-session-1",
        speakerIds: ["keeeeeei200"],
        title: "デザインを開発する ~ Vueで実現するデザインプロセス改善 ~",
      },
      { id: "platinum-sponsor-session-2", speakerIds: [], title: "TBD" },
      {
        id: "platinum-sponsor-session-3",
        speakerIds: ["yug1224"],
        title: "契約で守るコンパウンドプロダクトのデザインシステム",
      },
      {
        id: "platinum-sponsor-session-4",
        speakerIds: ["tttttt_621_s"],
        title: "クラウドサインを止めずに Nuxt へ、次の10年のために先に決めたこと",
      },
      {
        id: "platinum-sponsor-session-5",
        speakerIds: ["ascorbic"],
        title: "Astro is the new WordPress",
      },
      {
        id: "platinum-sponsor-session-6",
        speakerIds: ["RyutaroYako"],
        title: "コンポーネントのライフサイクルとグローバル状態の扱い方",
      },
    ]);
  });

  it("assigns platinum sponsor programs to the requested timetable slots", () => {
    expect(
      Object.fromEntries(SPONSORS.PLATINUM.map((sponsor) => [sponsor.id, sponsor.programIds])),
    ).toEqual({
      "link-and-motivation": ["platinum-sponsor-session-1"],
      vercel: ["platinum-sponsor-session-2"],
      "dress-code": ["platinum-sponsor-session-3"],
      bengo4: ["platinum-sponsor-session-4"],
      cloudflare: ["platinum-sponsor-session-5"],
      "unique-vision": ["platinum-sponsor-session-6"],
    });
  });

  it("assigns lunch and student support programs to their sponsors", () => {
    expect(SPONSORS.BRONZE.find((sponsor) => sponsor.id === "i-cubed-systems")?.programIds).toEqual(
      ["student-support-sponsor-session-1"],
    );
    expect(
      SPONSORS.OPTION_ONLY.find((sponsor) => sponsor.id === "digitalvalue")?.programIds,
    ).toEqual(["lunch-sponsor-lt-1"]);
    expect(SPONSORS.OPTION_ONLY.find((sponsor) => sponsor.id === "supporterz")?.programIds).toEqual(
      ["student-support-sponsor-session-2"],
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
