import type { TimetableItem } from "~~/server/static-data/types/timetable";
import type { MyTimetableSelectionId, MyTimetableSelectionIndex } from "./types";

const selectionIndexCache = new WeakMap<readonly TimetableItem[], MyTimetableSelectionIndex>();

export function createSelectableMyTimetableProgramIdSet(
  timetableItems: readonly TimetableItem[],
): ReadonlySet<MyTimetableSelectionId> {
  return new Set(
    timetableItems.flatMap((item) =>
      item.type === "schedule" ? [] : item.programs.map((program) => program.id),
    ),
  );
}

export function createMyTimetableSelectionIndex(
  timetableItems: readonly TimetableItem[],
): MyTimetableSelectionIndex {
  const cachedIndex = selectionIndexCache.get(timetableItems);
  if (cachedIndex) {
    return cachedIndex;
  }

  const orderedIds = [...createSelectableMyTimetableProgramIdSet(timetableItems)];
  const selectionIndex = {
    orderedIds,
    indexById: new Map(orderedIds.map((id, index) => [id, index])),
    fingerprint: fingerprintSelectionIds(orderedIds),
  } satisfies MyTimetableSelectionIndex;

  selectionIndexCache.set(timetableItems, selectionIndex);
  return selectionIndex;
}

/** Creates the canonical selected-ID set used for membership checks and updates. */
export function createSelectableMyTimetableSelectionIdSet(
  selectableIdSet: ReadonlySet<MyTimetableSelectionId>,
  selectionIds: readonly MyTimetableSelectionId[],
): ReadonlySet<MyTimetableSelectionId> {
  return new Set(selectionIds.filter((id) => selectableIdSet.has(id)));
}

export function haveSameMyTimetableSelection(
  firstIds: ReadonlySet<MyTimetableSelectionId>,
  secondIds: readonly MyTimetableSelectionId[],
): boolean {
  return firstIds.size === secondIds.length && secondIds.every((id) => firstIds.has(id));
}

/** Adds programs without removing the selections already in a personal timetable. */
export function addMyTimetableSelection(
  selectedIdSet: ReadonlySet<MyTimetableSelectionId>,
  addedIds: readonly MyTimetableSelectionId[],
): MyTimetableSelectionId[] {
  return [...selectedIdSet, ...addedIds.filter((id) => !selectedIdSet.has(id))];
}

/** Toggles one program or a group of programs as a single checkbox operation. */
export function toggleMyTimetableSelection(
  selectedIdSet: ReadonlySet<MyTimetableSelectionId>,
  toggledIds: readonly MyTimetableSelectionId[],
): MyTimetableSelectionId[] {
  if (!toggledIds.length) {
    return [...selectedIdSet];
  }

  const areAllSelected = toggledIds.every((id) => selectedIdSet.has(id));
  if (areAllSelected) {
    return [...selectedIdSet].filter((id) => !toggledIds.includes(id));
  }

  return [...selectedIdSet, ...toggledIds.filter((id) => !selectedIdSet.has(id))];
}

/** FNV-1a identifies the ordered timetable used by a compact selection URL. */
function fingerprintSelectionIds(ids: readonly string[]): string {
  let hash = 0x811c9dc5;

  for (const id of ids) {
    for (let index = 0; index < id.length; index += 1) {
      hash ^= id.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    hash ^= 0xff;
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}
