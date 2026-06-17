import { createTimetableCell, getTimeInMinutes, TRACKS, validateTimetableItems } from "./items";
import type {
  TimetableCell,
  TimetableItem,
  TimetableTime,
  TimetableTrack,
} from "~~/server/static-data/types/timetable";

export type MobileTimetableGroup = {
  id: string;
  time: TimetableTime;
  cards: TimetableCell[];
};

export function createMobileTimetable(
  sourceItems: readonly TimetableItem[],
): MobileTimetableGroup[] {
  validateTimetableItems(sourceItems);
  const sourceOrder = new Map(sourceItems.map((item, index) => [item, index]));

  const groupsByTime = new Map<TimetableTime, MobileTimetableGroup>();

  for (const item of sourceItems.filter((item) => !item.isPcOnly).sort(compareItems)) {
    const group = groupsByTime.get(item.start) ?? {
      id: `group-${item.start.replace(":", "")}`,
      time: item.start,
      cards: [],
    };

    group.cards.push(createCard(item));
    groupsByTime.set(item.start, group);
  }

  return [...groupsByTime.values()];

  function compareItems(left: TimetableItem, right: TimetableItem): number {
    const startDifference = getTimeInMinutes(left.start) - getTimeInMinutes(right.start);
    if (startDifference !== 0) {
      return startDifference;
    }

    return (
      TRACKS.indexOf(selectTrack(left)) - TRACKS.indexOf(selectTrack(right)) ||
      getSourceIndex(left) - getSourceIndex(right)
    );
  }

  function createCard(item: TimetableItem): TimetableCell {
    return createTimetableCell(item, selectTrack(item), `${item.id}-${getSourceIndex(item)}`);
  }

  function selectTrack(item: TimetableItem): TimetableTrack {
    const track = TRACKS.find((candidate) => item.tracks.includes(candidate));
    if (!track) {
      throw new Error(`Timetable item has no tracks: ${item.id}`);
    }

    return track;
  }

  function getSourceIndex(item: TimetableItem): number {
    const index = sourceOrder.get(item);
    if (index === undefined) {
      throw new Error(`Unknown timetable item: ${item.id}`);
    }

    return index;
  }
}
