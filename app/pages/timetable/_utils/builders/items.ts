import { TIMETABLE_TRACKS } from "../../../../../server/static-data/timetable";
import type {
  TimetableCell,
  TimetableItem,
  TimetableTime,
  TimetableTrack,
} from "~~/server/static-data/types/timetable";

export const TRACKS = Object.keys(TIMETABLE_TRACKS) as TimetableTrack[];

export function validateTimetableItems(items: readonly TimetableItem[]): void {
  for (const item of items) {
    if (item.tracks.length === 0) {
      throw new Error(`Timetable item has no tracks: ${item.id}`);
    }

    const startMinutes = getTimeInMinutes(item.start);
    const endMinutes = getTimeInMinutes(item.end);

    if (startMinutes >= endMinutes) {
      throw new Error(`Invalid timetable range: ${item.id}`);
    }
  }

  validateNoOverlaps(items);
}

export function getTimeInMinutes(time: TimetableTime): number {
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const hours = match?.[1];
  const minutes = match?.[2];

  if (!hours || !minutes) {
    throw new Error(`Invalid timetable time: ${time}`);
  }

  return Number(hours) * 60 + Number(minutes);
}

export function createTimetableCell(
  item: TimetableItem,
  track: TimetableTrack,
  id: string,
  layout: { colspan?: number; rowspan?: number } = {},
): TimetableCell {
  return {
    id,
    type: item.type,
    track,
    color: TIMETABLE_TRACKS[track].color,
    heading: item.heading ?? "",
    headingUrl: item.headingUrl,
    programs: item.programs,
    ...layout,
    ...item.display,
    startTime: item.display?.startTime ?? item.start,
    endTime: item.display?.endTime ?? item.end,
  };
}

function validateNoOverlaps(items: readonly TimetableItem[]): void {
  for (const track of TRACKS) {
    const trackItems = items.filter((item) => item.tracks.includes(track));

    for (const isSchedule of [false, true]) {
      const comparableItems = trackItems
        .filter((item) => (item.type === "schedule") === isSchedule)
        .sort((left, right) => getTimeInMinutes(left.start) - getTimeInMinutes(right.start));

      const [firstItem, ...remainingItems] = comparableItems;
      if (!firstItem) {
        continue;
      }

      let activeItem = firstItem;
      for (const current of remainingItems) {
        if (getTimeInMinutes(current.start) < getTimeInMinutes(activeItem.end)) {
          throw new Error(
            `Timetable items overlap on ${track} at ${current.start}: ${activeItem.id}, ${current.id}`,
          );
        }

        activeItem = current;
      }
    }
  }
}
