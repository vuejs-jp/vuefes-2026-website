import { describe, expect, it } from "vite-plus/test";
import {
  addMyTimetableSelection,
  createMyTimetableGroups,
  createMyTimetableItems,
  createMyTimetableShareUrl,
  createMyTimetableSelectionIndex,
  createSelectableMyTimetableProgramIdSet,
  createSelectableMyTimetableSelectionIdSet,
  decodeMyTimetableQuerySelection,
  encodeMyTimetableQuerySelection,
  haveSameMyTimetableSelection,
  MY_TIMETABLE_QUERY_KEY,
  readStoredMyTimetableEnabled,
  readStoredMyTimetableSelection,
  sortMyTimetableItemsForDisplay,
  toggleMyTimetableSelection,
  writeStoredMyTimetableEnabled,
  writeStoredMyTimetableSelection,
  type MyTimetableStorage,
} from "./myTimetable";
import type { TimetableItem, TimetableProgram } from "~~/server/static-data/types/timetable";
import { createTimetable } from "../../server/utils/createTimetable";

function createProgram(id: string): TimetableProgram {
  return {
    id,
    title: id,
    type: "session",
    tracks: ["track1"],
    speakers: [],
  };
}

function createItem(id: string, programs: TimetableProgram[]): TimetableItem {
  return {
    id,
    type: "lightningTalk",
    tracks: ["track1"],
    start: "10:00",
    end: "11:00",
    programs,
  };
}

const items = [
  createItem("first-slot", [createProgram("first"), createProgram("second")]),
  createItem("second-slot", [createProgram("third")]),
  createItem("third-slot", [createProgram("fourth"), createProgram("fifth")]),
];
const selectableIdSet = createSelectableMyTimetableProgramIdSet(items);
const selectionIndex = createMyTimetableSelectionIndex(items);

describe("my timetable storage", () => {
  it("round-trips whether My Timetable is enabled", () => {
    const storage = createMemoryStorage();

    expect(writeStoredMyTimetableEnabled(storage, true)).toBe(true);
    expect(readStoredMyTimetableEnabled(storage)).toBe(true);

    expect(writeStoredMyTimetableEnabled(storage, false)).toBe(true);
    expect(readStoredMyTimetableEnabled(storage)).toBe(false);
  });

  it("defaults My Timetable to disabled when stored state is invalid", () => {
    expect(readStoredMyTimetableEnabled(createMemoryStorage("invalid"))).toBe(false);
  });

  it("round-trips a canonical JSON selection", () => {
    const storage = createMemoryStorage();

    expect(writeStoredMyTimetableSelection(storage, ["first", "fourth", "first"])).toBe(true);
    expect(readStoredMyTimetableSelection(storage)).toEqual(["first", "fourth"]);
  });

  it("discards malformed storage", () => {
    const storage = createMemoryStorage("not-json");

    expect(readStoredMyTimetableSelection(storage)).toEqual([]);
  });

  it("falls back to in-memory behavior when storage access fails", () => {
    const unavailableStorage: MyTimetableStorage = {
      getItem() {
        throw new Error("Storage unavailable");
      },
      setItem() {
        throw new Error("Storage unavailable");
      },
    };

    expect(readStoredMyTimetableSelection(unavailableStorage)).toEqual([]);
    expect(writeStoredMyTimetableSelection(unavailableStorage, ["first"])).toBe(false);
    expect(readStoredMyTimetableEnabled(unavailableStorage)).toBe(false);
    expect(writeStoredMyTimetableEnabled(unavailableStorage, true)).toBe(false);
  });
});

describe("my timetable query", () => {
  it("round-trips stable program IDs", () => {
    const selection = ["first", "fourth", "fifth"];
    const encoded = encodeMyTimetableQuerySelection(selectionIndex, selection);

    expect(encoded).toMatch(/^[0-9a-z]+~[0-9a-z.-]+$/);
    expect(decodeMyTimetableQuerySelection(selectionIndex, encoded)).toEqual(selection);
  });

  it("rejects compact queries created for a different timetable", () => {
    const encoded = encodeMyTimetableQuerySelection(selectionIndex, ["first", "fourth"]);
    const expandedSelectionIndex = createMyTimetableSelectionIndex([
      ...items,
      createItem("new-slot", [createProgram("new-program")]),
    ]);

    expect(decodeMyTimetableQuerySelection(expandedSelectionIndex, encoded)).toBeNull();
  });

  it("rejects malformed and out-of-bounds compact ranges", () => {
    const fingerprint = selectionIndex.fingerprint;

    expect(decodeMyTimetableQuerySelection(selectionIndex, `${fingerprint}~1.0`)).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, `${fingerprint}~0-1.1`)).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, `${fingerprint}~5`)).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, `${fingerprint}~01`)).toBeNull();
  });

  it("keeps the deployment base path and encodes selections in a localized URL", () => {
    const shareUrl = createMyTimetableShareUrl({
      siteBaseUrl: "https://vuefes.jp/2026/",
      localizedPath: "/en/timetable/my",
      selectionIndex,
      selectionIds: ["first", "fourth"],
      isShared: false,
    });

    expect(shareUrl).toBe("https://vuefes.jp/2026/en/timetable/my?s=rxxkxo~0.3");
    expect(
      decodeMyTimetableQuerySelection(
        selectionIndex,
        new URL(shareUrl).searchParams.get(MY_TIMETABLE_QUERY_KEY),
      ),
    ).toEqual(["first", "fourth"]);
  });

  it("adds a bare shared parameter without degrading the encoded selection", () => {
    expect(
      createMyTimetableShareUrl({
        siteBaseUrl: "https://vuefes.jp/2026/",
        localizedPath: "/timetable/my",
        selectionIndex,
        selectionIds: ["first", "fourth"],
        isShared: true,
      }),
    ).toBe("https://vuefes.jp/2026/timetable/my?s=rxxkxo~0.3&shared");
  });

  it("does not create a shared URL without a selection", () => {
    expect(
      createMyTimetableShareUrl({
        siteBaseUrl: "https://vuefes.jp/2026/",
        localizedPath: "/timetable/my",
        selectionIndex,
        selectionIds: [],
        isShared: true,
      }),
    ).toBe("");
  });

  it("keeps available programs when decoding a legacy JSON query", () => {
    const reducedSelectionIndex = createMyTimetableSelectionIndex([
      createItem("first-slot", [createProgram("first")]),
    ]);

    expect(
      decodeMyTimetableQuerySelection(reducedSelectionIndex, JSON.stringify(["first", "fourth"])),
    ).toEqual(["first"]);
  });

  it("rejects malformed queries and queries without a current program", () => {
    expect(decodeMyTimetableQuerySelection(selectionIndex, "not-json")).toBeNull();
    expect(
      decodeMyTimetableQuerySelection(selectionIndex, JSON.stringify({ id: "first" })),
    ).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, JSON.stringify([1]))).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, JSON.stringify(["unknown"]))).toBeNull();
    expect(decodeMyTimetableQuerySelection(selectionIndex, ["first"])).toBeNull();
  });

  it("uses the compact fingerprint and ranges for the current timetable", () => {
    const currentSelectionIndex = createMyTimetableSelectionIndex(createTimetable("ja").items);

    expect(currentSelectionIndex.fingerprint).toBe("1f6ur15");
    expect(
      encodeMyTimetableQuerySelection(currentSelectionIndex, [
        "session-8",
        "session-5",
        "session-4",
        "student-support-contents",
        "lightning-talk-3",
        "lightning-talk-4",
        "keynote",
      ]),
    ).toBe("1f6ur15~1.a.f-g.j.v-w");
  });
});

describe("my timetable selections", () => {
  const firstProgramId = "first";
  const secondProgramId = "second";
  const thirdProgramId = "third";

  it("adds a shared selection without removing or duplicating personal selections", () => {
    expect(
      addMyTimetableSelection(new Set([firstProgramId, secondProgramId]), [
        secondProgramId,
        thirdProgramId,
      ]),
    ).toEqual([firstProgramId, secondProgramId, thirdProgramId]);
  });

  it("adds every program when a whole slot is checked", () => {
    expect(
      toggleMyTimetableSelection(new Set([firstProgramId]), [firstProgramId, secondProgramId]),
    ).toEqual([firstProgramId, secondProgramId]);
  });

  it("removes every program when a fully checked slot is unchecked", () => {
    expect(
      toggleMyTimetableSelection(new Set([firstProgramId, secondProgramId, thirdProgramId]), [
        firstProgramId,
        secondProgramId,
      ]),
    ).toEqual([thirdProgramId]);
  });

  it("allows an individual program to be removed after a bulk selection", () => {
    expect(
      toggleMyTimetableSelection(new Set([firstProgramId, secondProgramId]), [secondProgramId]),
    ).toEqual([firstProgramId]);
  });

  it("filters unknown and duplicate selection IDs", () => {
    expect(
      createSelectableMyTimetableSelectionIdSet(selectableIdSet, [
        firstProgramId,
        "unknown",
        firstProgramId,
      ]),
    ).toEqual(new Set([firstProgramId]));
  });

  it("compares selections without depending on their order", () => {
    expect(
      haveSameMyTimetableSelection(new Set([firstProgramId, secondProgramId]), [
        secondProgramId,
        firstProgramId,
      ]),
    ).toBe(true);
    expect(haveSameMyTimetableSelection(new Set([firstProgramId]), [secondProgramId])).toBe(false);
  });

  it("projects only selected programs while retaining timetable semantics", () => {
    const [item] = createMyTimetableItems(items, new Set([secondProgramId]));

    expect(item?.id).toBe("first-slot");
    expect(item?.start).toBe("10:00");
    expect(item?.programs.map((program) => program.id)).toEqual(["second"]);
  });
});

describe("my timetable display groups", () => {
  it("groups simultaneous cards in chronological and track order", () => {
    const late = createItem("late", [createProgram("late-program")]);
    late.start = "11:00";
    late.end = "11:30";

    const earlyTrack2 = createItem("early-track2", [createProgram("track2-program")]);
    earlyTrack2.tracks = ["track2"];
    earlyTrack2.start = "10:00";
    earlyTrack2.end = "10:30";

    const earlyTrack1 = createItem("early-track1", [createProgram("track1-program")]);
    earlyTrack1.start = "10:00";
    earlyTrack1.end = "10:30";

    expect(createMyTimetableGroups([late, earlyTrack2, earlyTrack1])).toEqual([
      expect.objectContaining({
        time: "10:00",
        cards: [
          expect.objectContaining({ heading: "", track: "track1" }),
          expect.objectContaining({ heading: "", track: "track2" }),
        ],
      }),
      expect.objectContaining({
        time: "11:00",
        cards: [expect.objectContaining({ track: "track1" })],
      }),
    ]);
  });

  it("groups partially overlapping items with different start times", () => {
    const first = createItem("first", [createProgram("first-program")]);
    first.start = "10:00";
    first.end = "11:00";

    const second = createItem("second", [createProgram("second-program")]);
    second.tracks = ["track2"];
    second.start = "10:30";
    second.end = "11:30";

    expect(createMyTimetableGroups([first, second])).toEqual([
      expect.objectContaining({
        time: "10:00",
        cards: [
          expect.objectContaining({ startTime: "10:00", endTime: "11:00" }),
          expect.objectContaining({ startTime: "10:30", endTime: "11:30" }),
        ],
      }),
    ]);
  });

  it("keeps touching but non-overlapping items in separate groups", () => {
    const first = createItem("first", [createProgram("first-program")]);
    first.start = "10:00";
    first.end = "10:30";

    const second = createItem("second", [createProgram("second-program")]);
    second.start = "10:30";
    second.end = "11:00";

    expect(createMyTimetableGroups([first, second]).map((group) => group.time)).toEqual([
      "10:00",
      "10:30",
    ]);
  });

  it("keeps transitively overlapping items in one group", () => {
    const first = createItem("first", [createProgram("first-program")]);
    first.start = "10:00";
    first.end = "10:30";

    const second = createItem("second", [createProgram("second-program")]);
    second.start = "10:20";
    second.end = "10:40";

    const third = createItem("third", [createProgram("third-program")]);
    third.start = "10:35";
    third.end = "11:00";

    const groups = createMyTimetableGroups([first, second, third]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.time).toBe("10:00");
    expect(groups[0]?.cards).toHaveLength(3);
  });

  it("uses display overrides and omits PC-only items", () => {
    const visible = createItem("visible", [createProgram("visible-program")]);
    visible.display = {
      startTime: "09:55",
      endTime: "10:35",
      color: "navy",
    };

    const pcOnly = createItem("pc-only", [createProgram("pc-only-program")]);
    pcOnly.isPcOnly = true;

    expect(createMyTimetableGroups([pcOnly, visible])).toEqual([
      expect.objectContaining({
        cards: [
          expect.objectContaining({
            startTime: "09:55",
            endTime: "10:35",
            color: "navy",
          }),
        ],
      }),
    ]);
  });

  it("sorts source items without mutating them", () => {
    const late = createItem("late", [createProgram("late-program")]);
    late.start = "11:00";
    late.end = "11:30";
    const early = createItem("early", [createProgram("early-program")]);
    early.start = "10:00";
    early.end = "10:30";
    const source = [late, early];

    expect(sortMyTimetableItemsForDisplay(source)).toEqual([early, late]);
    expect(source).toEqual([late, early]);
  });
});

function createMemoryStorage(initialValue?: string): MyTimetableStorage {
  let value = initialValue ?? null;

  return {
    getItem() {
      return value;
    },
    setItem(_key, nextValue) {
      value = nextValue;
    },
  };
}
