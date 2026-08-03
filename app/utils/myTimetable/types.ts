import type { TimetableProgram } from "~~/server/static-data/types/timetable";

export type MyTimetableSelectionId = TimetableProgram["id"];

export type MyTimetableSelectionIndex = {
  orderedIds: readonly MyTimetableSelectionId[];
  indexById: ReadonlyMap<MyTimetableSelectionId, number>;
  fingerprint: string;
};
