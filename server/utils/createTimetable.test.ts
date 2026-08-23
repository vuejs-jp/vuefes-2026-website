import { describe, expect, it } from "vite-plus/test";
import { createTimetable } from "./createTimetable";

describe("createTimetable", () => {
  it("keeps the timetable structure stable across locales", () => {
    const japanese = createTimetable("ja");
    const english = createTimetable("en");

    expect(english.items.map((item) => item.id)).toEqual(japanese.items.map((item) => item.id));
    expect(japanese.items.find((item) => item.id === "opening")?.heading).toBe("オープニング");
    expect(english.items.find((item) => item.id === "opening")?.heading).toBe("Opening");
  });

  it("matches the published timetable layout", () => {
    const timetable = createTimetable("ja");
    const expectedSessions = [
      ["session-1", "posva", "track1", "12:50", "13:20"],
      ["session-2", "jp-knj", "track2", "12:50", "13:20"],
      ["session-3", "ics-ikeda", "track3", "12:50", "13:20"],
      ["session-4", "ykoizumi0903", "track1", "13:35", "14:05"],
      ["session-5", "wan9chi", "track2", "13:35", "14:05"],
      ["session-6", "ktsn", "track3", "13:35", "14:05"],
      ["session-7", "naokihaba", "track1", "14:20", "14:50"],
      ["session-8", "hiranuma", "track2", "14:20", "14:50"],
      ["session-9", "yamanoku", "track3", "14:20", "14:50"],
      ["session-10", "ubugeeei", "track1", "15:05", "15:35"],
      ["session-11", "Hal-Spidernight", "track2", "15:05", "15:35"],
      ["session-12", "is78-dev", "track3", "15:05", "15:35"],
      ["session-13", "t0daaay", "track4", "15:05", "15:35"],
      ["session-14", "themarcba", "track3", "15:50", "16:20"],
      ["session-15", "alvarosabu", "track4", "15:50", "16:20"],
      ["session-16", "yut0naga1", "track4", "16:35", "17:05"],
      ["session-17", "mnmxmx", "track2", "16:55", "17:25"],
      ["session-18", "ushironoko", "track4", "17:20", "17:50"],
    ] as const;

    for (const [programId, speakerId, track, start, end] of expectedSessions) {
      const item = timetable.items.find((candidate) =>
        candidate.programs.some((program) => program.id === programId),
      );

      expect(item).toMatchObject({ tracks: [track], start, end });
      expect(item?.programs[0]?.speakers.map((speaker) => speaker.id)).toEqual([speakerId]);
    }

    expect(timetable.items.find((item) => item.id === "opening")?.tracks).toEqual([
      "track1",
      "track2",
    ]);
    expect(timetable.items.find((item) => item.id === "keynote")?.tracks).toEqual([
      "track1",
      "track2",
    ]);
    expect(timetable.items).toContainEqual(
      expect.objectContaining({
        id: "schedule-10:50-10:55-track1-track2",
        tracks: ["track1", "track2"],
      }),
    );
  });

  it("includes the published lunch sponsor lightning talk as a single program", () => {
    const timetable = createTimetable("ja");
    const lunchSponsorLightningTalk = timetable.items.find(
      (item) => item.id === "lightningTalk-11:40-11:45-track3",
    );

    expect(lunchSponsorLightningTalk).toMatchObject({
      type: "lightningTalk",
      tracks: ["track3"],
      start: "11:40",
      end: "11:45",
      heading: "ランチスポンサーセッション",
      programs: [{ id: "lunch-sponsor-lt-1", title: "TBD" }],
    });
    expect(lunchSponsorLightningTalk?.programs).toHaveLength(1);
  });
});
