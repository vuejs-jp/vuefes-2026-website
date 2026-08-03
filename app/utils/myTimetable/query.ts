import { parseMyTimetableSelectionIds } from "./codec";
import type { MyTimetableSelectionId, MyTimetableSelectionIndex } from "./types";

export const MY_TIMETABLE_QUERY_KEY = "s";
export const MY_TIMETABLE_SHARED_QUERY_KEY = "shared";

export function encodeMyTimetableQuerySelection(
  selectionIndex: MyTimetableSelectionIndex,
  selectionIds: readonly MyTimetableSelectionId[],
): string {
  const indexes = [
    ...new Set(
      selectionIds
        .map((id) => selectionIndex.indexById.get(id))
        .filter((index): index is number => index !== undefined),
    ),
  ].sort((first, second) => first - second);

  if (!indexes.length) {
    return "";
  }

  return `${selectionIndex.fingerprint}~${encodeIndexRanges(indexes)}`;
}

export function createMyTimetableShareUrl(options: {
  siteBaseUrl: string;
  localizedPath: string;
  selectionIndex: MyTimetableSelectionIndex;
  selectionIds: readonly MyTimetableSelectionId[];
  isShared: boolean;
}): string {
  const selection = encodeMyTimetableQuerySelection(options.selectionIndex, options.selectionIds);
  if (!selection) {
    return "";
  }

  const baseUrl = options.siteBaseUrl.endsWith("/")
    ? options.siteBaseUrl
    : `${options.siteBaseUrl}/`;
  const url = new URL(options.localizedPath.replace(/^\/+/, ""), baseUrl);
  url.search = `${MY_TIMETABLE_QUERY_KEY}=${selection}${
    options.isShared ? `&${MY_TIMETABLE_SHARED_QUERY_KEY}` : ""
  }`;
  return url.toString();
}

/**
 * Decodes the compact selection only when its timetable fingerprint matches.
 * Legacy JSON selections remain readable, with unavailable program IDs ignored.
 */
export function decodeMyTimetableQuerySelection(
  selectionIndex: MyTimetableSelectionIndex,
  value: unknown,
): MyTimetableSelectionId[] | null {
  if (typeof value !== "string") {
    return null;
  }

  const compactSelection = decodeCompactSelection(selectionIndex, value);
  if (compactSelection) {
    return compactSelection;
  }

  const legacySelection = parseMyTimetableSelectionIds(value);
  const selectableIds = legacySelection?.filter((id) => selectionIndex.indexById.has(id));
  return selectableIds?.length ? selectableIds : null;
}

function decodeCompactSelection(
  selectionIndex: MyTimetableSelectionIndex,
  value: string,
): MyTimetableSelectionId[] | null {
  const [fingerprint, ranges, ...rest] = value.split("~");
  if (rest.length || fingerprint !== selectionIndex.fingerprint || !ranges) {
    return null;
  }

  const indexes = decodeIndexRanges(ranges, selectionIndex.orderedIds.length);
  return (
    indexes?.map((index) => selectionIndex.orderedIds[index] as MyTimetableSelectionId) ?? null
  );
}

function encodeIndexRanges(indexes: readonly number[]): string {
  const ranges: string[] = [];
  let start = indexes[0] as number;
  let end = start;

  for (const index of indexes.slice(1)) {
    if (index === end + 1) {
      end = index;
      continue;
    }

    ranges.push(formatIndexRange(start, end));
    start = index;
    end = index;
  }

  ranges.push(formatIndexRange(start, end));
  return ranges.join(".");
}

function formatIndexRange(start: number, end: number): string {
  const encodedStart = start.toString(36);
  return start === end ? encodedStart : `${encodedStart}-${end.toString(36)}`;
}

function decodeIndexRanges(value: string, upperBound: number): number[] | null {
  const indexes: number[] = [];
  let previous = -1;

  for (const range of value.split(".")) {
    const parts = range.split("-");
    if (parts.length > 2) {
      return null;
    }

    const start = parseBase36Index(parts[0]);
    const end = parseBase36Index(parts[1] ?? parts[0]);
    if (start === null || end === null || start > end || start <= previous || end >= upperBound) {
      return null;
    }

    for (let index = start; index <= end; index += 1) {
      indexes.push(index);
    }
    previous = end;
  }

  return indexes.length ? indexes : null;
}

function parseBase36Index(value: string | undefined): number | null {
  if (!value || !/^(0|[1-9a-z][0-9a-z]*)$/.test(value)) {
    return null;
  }

  const index = Number.parseInt(value, 36);
  return Number.isSafeInteger(index) && index.toString(36) === value ? index : null;
}
