import type { TimetableItem } from "~~/server/static-data/types/timetable";
import type { MyTimetableSelectionId } from "./types";

/** Projects timetable data to items containing at least one selected program. */
export function createMyTimetableItems(
  timetableItems: readonly TimetableItem[],
  selectedIdSet: ReadonlySet<MyTimetableSelectionId>,
): TimetableItem[] {
  return timetableItems.flatMap((item) => {
    if (item.type === "schedule") {
      return [];
    }

    const selectedPrograms = item.programs.filter((program) => selectedIdSet.has(program.id));
    return selectedPrograms.length ? [{ ...item, programs: selectedPrograms }] : [];
  });
}
