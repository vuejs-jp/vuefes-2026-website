import { parseMyTimetableSelectionIds, serializeMyTimetableSelectionIds } from "./codec";
import type { MyTimetableSelectionId } from "./types";

export const MY_TIMETABLE_STORAGE_KEY = "vuefes-2026-my-timetable";
export const MY_TIMETABLE_ENABLED_STORAGE_KEY = "vuefes-2026-my-timetable-enabled";

export type MyTimetableStorage = Pick<Storage, "getItem" | "setItem">;

export function readStoredMyTimetableSelection(
  storage: MyTimetableStorage | undefined,
): MyTimetableSelectionId[] {
  if (!storage) {
    return [];
  }

  try {
    return parseStoredMyTimetableSelection(storage.getItem(MY_TIMETABLE_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeStoredMyTimetableSelection(
  storage: MyTimetableStorage | undefined,
  ids: readonly MyTimetableSelectionId[],
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(MY_TIMETABLE_STORAGE_KEY, stringifyStoredMyTimetableSelection(ids));
    return true;
  } catch {
    return false;
  }
}

export function readStoredMyTimetableEnabled(storage: MyTimetableStorage | undefined): boolean {
  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(MY_TIMETABLE_ENABLED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeStoredMyTimetableEnabled(
  storage: MyTimetableStorage | undefined,
  enabled: boolean,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(MY_TIMETABLE_ENABLED_STORAGE_KEY, String(enabled));
    return true;
  } catch {
    return false;
  }
}

export function parseStoredMyTimetableSelection(value: string | null): MyTimetableSelectionId[] {
  if (!value) {
    return [];
  }

  return parseMyTimetableSelectionIds(value) ?? [];
}

export function stringifyStoredMyTimetableSelection(
  ids: readonly MyTimetableSelectionId[],
): string {
  return serializeMyTimetableSelectionIds(ids);
}
