import { describe, expect, it } from "vite-plus/test";
import { createDesktopTimetable, createMobileTimetable } from "./index";
import type { TimetableItem, TimetableTime } from "~~/server/static-data/types/timetable";

function createItem(
  id: string,
  tracks: TimetableItem["tracks"],
  start: TimetableTime,
  end: TimetableTime,
  type: TimetableItem["type"] = "session",
): TimetableItem {
  return {
    id,
    tracks,
    type,
    start,
    end,
    heading: id,
    programs: [],
  };
}

function createViews(items: readonly TimetableItem[]) {
  return {
    desktopRows: createDesktopTimetable(items),
    mobileGroups: createMobileTimetable(items),
  };
}

function getItem<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (!item) {
    throw new Error(`Expected item at index ${index}`);
  }

  return item;
}

describe("desktop and mobile timetable builders", () => {
  it("returns empty desktop and mobile structures when there are no items", () => {
    expect(createViews([])).toEqual({
      desktopRows: [],
      mobileGroups: [],
    });
  });

  it("combines contiguous tracks and time intervals into one table cell", () => {
    const main = createItem("main", ["track1", "track2"], "10:00", "11:00");
    main.display = {
      ...main.display,
      startTime: "00:00",
      endTime: "00:00",
    };

    const { desktopRows } = createViews([
      main,
      createItem("boundary", ["track3"], "10:30", "10:45"),
    ]);

    const mainCell = getItem(desktopRows, 0).cells.find((cell) => cell.heading === "main");

    expect(mainCell).toMatchObject({
      colspan: 2,
      rowspan: 3,
      track: "track1",
      color: "primary",
      startTime: "00:00",
      endTime: "00:00",
    });
  });

  it("lets content override a schedule without hiding the schedule elsewhere", () => {
    const { desktopRows, mobileGroups } = createViews([
      createItem(
        "schedule",
        ["track1", "track2", "track3", "track4"],
        "09:00",
        "10:00",
        "schedule",
      ),
      createItem("session", ["track1", "track2"], "09:30", "10:00"),
    ]);

    expect(getItem(desktopRows, 0).cells).toEqual(
      expect.arrayContaining([expect.objectContaining({ heading: "schedule", colspan: 4 })]),
    );
    expect(getItem(desktopRows, 1).cells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ heading: "session", colspan: 2 }),
        expect.objectContaining({ heading: "schedule", colspan: 2 }),
      ]),
    );
    expect(mobileGroups).toEqual([
      expect.objectContaining({
        time: "09:00",
        cards: [expect.objectContaining({ heading: "schedule" })],
      }),
      expect.objectContaining({
        time: "09:30",
        cards: [expect.objectContaining({ heading: "session" })],
      }),
    ]);
  });

  it("does not merge different items that happen to have the same id", () => {
    const { desktopRows } = createViews([
      createItem("same-id", ["track3"], "15:00", "15:30"),
      createItem("same-id", ["track4"], "15:00", "15:30"),
    ]);

    const cells = getItem(desktopRows, 0).cells.filter((cell) => cell.heading === "same-id");

    expect(cells).toHaveLength(2);
    expect(cells).toEqual([
      expect.objectContaining({ track: "track3", color: "orange", colspan: 1 }),
      expect.objectContaining({ track: "track4", color: "navy", colspan: 1 }),
    ]);
  });

  it("combines a simultaneous break across contiguous tracks", () => {
    const { desktopRows } = createViews([
      createItem("break", ["track1", "track2", "track3"], "13:20", "13:35", "schedule"),
    ]);

    expect(getItem(desktopRows, 0).cells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          heading: "break",
          track: "track1",
          colspan: 3,
        }),
      ]),
    );
  });

  it("preserves an explicit track color in desktop cells and mobile cards", () => {
    const item = createItem("colored", ["track1"], "10:00", "10:30");
    item.display = { color: "navy" };

    const { desktopRows, mobileGroups } = createViews([item]);

    expect(getItem(desktopRows, 0).cells).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "navy" })]),
    );
    expect(getItem(mobileGroups, 0).cards).toEqual([expect.objectContaining({ color: "navy" })]);
  });

  it("preserves explicitly defined heading and program links", () => {
    const item = createItem("linked", ["track1"], "10:00", "10:30");
    item.heading = "Linked session";
    item.headingUrl = "/event?session=linked#linked";
    item.programs = [
      {
        id: "presentation",
        type: "session",
        title: "Presentation title",
        url: "/event?session=presentation#presentation",
        tracks: ["track1"],
        speakers: [
          {
            id: "speaker",
            name: "Speaker",
            avatarUrl: "/speaker.png",
          },
        ],
        slideUrl: "https://example.com/slides",
      },
    ];

    const { desktopRows, mobileGroups } = createViews([item]);
    const expectedDisplay = expect.objectContaining({
      heading: item.heading,
      headingUrl: item.headingUrl,
      programs: item.programs,
    });

    expect(getItem(desktopRows, 0).cells).toEqual(expect.arrayContaining([expectedDisplay]));
    expect(getItem(mobileGroups, 0).cards).toEqual([expectedDisplay]);
  });

  it("rejects overlapping content on the same track", () => {
    const items = [
      createItem("first", ["track1"], "10:00", "11:00"),
      createItem("second", ["track1"], "10:30", "11:30"),
    ];

    expect(() => createViews(items)).toThrow(
      "Timetable items overlap on track1 at 10:30: first, second",
    );
  });

  it("rejects overlapping schedules instead of depending on input order", () => {
    const items = [
      createItem("first", ["track1"], "10:00", "11:00", "schedule"),
      createItem("second", ["track1"], "10:30", "11:30", "schedule"),
    ];

    expect(() => createViews(items)).toThrow(
      "Timetable items overlap on track1 at 10:30: first, second",
    );
  });

  it("creates desktop cells and mobile cards independently", () => {
    const { desktopRows, mobileGroups } = createViews([
      createItem("split", ["track3", "track1"], "10:00", "10:30"),
    ]);
    const cells = getItem(desktopRows, 0).cells.filter((cell) => cell.heading === "split");

    expect(cells).toEqual([
      expect.objectContaining({ track: "track1", colspan: 1 }),
      expect.objectContaining({ track: "track3", colspan: 1 }),
    ]);
    expect(mobileGroups).toEqual([
      expect.objectContaining({
        time: "10:00",
        cards: [expect.objectContaining({ heading: "split", track: "track1" })],
      }),
    ]);
  });

  it("rejects invalid times and ranges", () => {
    const invalidTime = createItem("invalid-time", ["track1"], "10:00", "11:00");
    invalidTime.end = "25:00";
    const invalidRange = createItem("invalid-range", ["track1"], "11:00", "10:00");

    expect(() => createViews([invalidTime])).toThrow("Invalid timetable time: 25:00");
    expect(() => createViews([invalidRange])).toThrow("Invalid timetable range: invalid-range");
  });

  it("rejects items that are not assigned to a track", () => {
    const item = createItem("no-track", [], "10:00", "11:00");

    expect(() => createViews([item])).toThrow("Timetable item has no tracks: no-track");
  });

  it("groups mobile cards by calculation start time and preserves display time", () => {
    const first = createItem("first", ["track2"], "10:00", "10:30");
    first.display = { startTime: "09:55", endTime: "10:35" };
    const second = createItem("second", ["track1"], "10:00", "10:15");

    const { mobileGroups } = createViews([first, second]);

    expect(mobileGroups).toEqual([
      expect.objectContaining({
        time: "10:00",
        cards: [
          expect.objectContaining({ heading: "second", track: "track1" }),
          expect.objectContaining({
            heading: "first",
            track: "track2",
            startTime: "09:55",
            endTime: "10:35",
          }),
        ],
      }),
    ]);
  });

  it("uses calculation times when display times are omitted", () => {
    const { desktopRows, mobileGroups } = createViews([
      createItem("default-time", ["track1"], "10:00", "10:30"),
    ]);

    expect(getItem(desktopRows, 0).cells).toEqual(
      expect.arrayContaining([expect.objectContaining({ startTime: "10:00", endTime: "10:30" })]),
    );
    expect(getItem(mobileGroups, 0).cards).toEqual([
      expect.objectContaining({ startTime: "10:00", endTime: "10:30" }),
    ]);
  });

  it("resolves display time overrides independently and preserves empty strings", () => {
    const startOverride = createItem("start-override", ["track1"], "10:00", "10:30");
    startOverride.display = { startTime: "09:55" };
    const hiddenTime = createItem("hidden-time", ["track2"], "10:00", "10:30");
    hiddenTime.display = { startTime: "", endTime: "" };

    const { mobileGroups } = createViews([startOverride, hiddenTime]);

    expect(getItem(mobileGroups, 0).cards).toEqual([
      expect.objectContaining({ startTime: "09:55", endTime: "10:30" }),
      expect.objectContaining({ startTime: "", endTime: "" }),
    ]);
  });

  it("omits PC-only items from mobile without affecting desktop", () => {
    const item = createItem("pc-only", ["track3"], "10:00", "10:30");
    item.isPcOnly = true;

    const { desktopRows, mobileGroups } = createViews([item]);

    expect(getItem(desktopRows, 0).cells).toEqual(
      expect.arrayContaining([expect.objectContaining({ heading: "pc-only", track: "track3" })]),
    );
    expect(mobileGroups).toEqual([]);
  });
});

describe("public timetable builders", () => {
  it("creates desktop rows independently", () => {
    const rows = createDesktopTimetable([createItem("desktop", ["track1"], "10:00", "10:30")]);

    expect(getItem(rows, 0).cells).toEqual(
      expect.arrayContaining([expect.objectContaining({ heading: "desktop", track: "track1" })]),
    );
  });

  it("creates mobile groups independently", () => {
    const groups = createMobileTimetable([createItem("mobile", ["track2"], "10:00", "10:30")]);

    expect(groups).toEqual([
      expect.objectContaining({
        time: "10:00",
        cards: [expect.objectContaining({ heading: "mobile", track: "track2" })],
      }),
    ]);
  });

  it("applies shared validation to the mobile builder", () => {
    const items = [
      createItem("first", ["track1"], "10:00", "12:00"),
      createItem("second", ["track1"], "11:00", "11:30"),
    ];

    expect(() => createMobileTimetable(items)).toThrow(
      "Timetable items overlap on track1 at 11:00: first, second",
    );
  });
});
