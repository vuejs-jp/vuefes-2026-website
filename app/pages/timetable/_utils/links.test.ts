import { describe, expect, it } from "vite-plus/test";
import { getTimetableCellLinkUrl } from "./links";
import type { TimetableCell, TimetableProgram } from "~~/server/static-data/types/timetable";

function createProgram(id: string, url?: string): TimetableProgram {
  return {
    id,
    type: "session",
    title: id,
    url,
    tracks: ["track1"],
    speakers: [],
  };
}

function createCell(
  programs: TimetableProgram[],
  headingUrl?: string,
): Pick<TimetableCell, "headingUrl" | "programs"> {
  return { headingUrl, programs };
}

describe("getTimetableCellLinkUrl", () => {
  it("uses the heading URL for a cell without programs", () => {
    expect(getTimetableCellLinkUrl(createCell([], "/event"))).toBe("/event");
  });

  it("prefers the program URL for a cell with one program", () => {
    expect(
      getTimetableCellLinkUrl(createCell([createProgram("session", "/speaker")], "/event")),
    ).toBe("/speaker");
  });

  it("falls back to the heading URL when the only program has no URL", () => {
    expect(getTimetableCellLinkUrl(createCell([createProgram("session")], "/event"))).toBe(
      "/event",
    );
  });

  it("does not make a cell with multiple programs and a heading URL clickable", () => {
    expect(
      getTimetableCellLinkUrl(
        createCell(
          [createProgram("first", "/speaker/first"), createProgram("second", "/speaker/second")],
          "/event",
        ),
      ),
    ).toBeUndefined();
  });

  it("does not make a cell with multiple programs and no heading URL clickable", () => {
    expect(
      getTimetableCellLinkUrl(
        createCell([
          createProgram("first", "/speaker/first"),
          createProgram("second", "/speaker/second"),
        ]),
      ),
    ).toBeUndefined();
  });

  it("does not make a cell without any URL clickable", () => {
    expect(getTimetableCellLinkUrl(createCell([createProgram("session")]))).toBeUndefined();
  });
});
