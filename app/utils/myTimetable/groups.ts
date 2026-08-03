import { TIMETABLE_TRACKS } from "../../../server/static-data/timetable";
import type {
  TimetableCell,
  TimetableItem,
  TimetableTime,
  TimetableTrack,
} from "~~/server/static-data/types/timetable";

const TRACKS = Object.keys(TIMETABLE_TRACKS) as TimetableTrack[];

export type MyTimetableGroup = {
  id: string;
  time: TimetableTime;
  cards: TimetableCell[];
};

/** Groups overlapping time ranges for display only on the My Timetable page. */
export function createMyTimetableGroups(sourceItems: readonly TimetableItem[]): MyTimetableGroup[] {
  const sourceOrder = new Map(sourceItems.map((item, index) => [item, index]));
  const groups: MyTimetableGroup[] = [];
  let currentGroup: MyTimetableGroup | undefined;
  let currentGroupEnd = 0;

  for (const item of sortMyTimetableItemsForDisplay(sourceItems)) {
    if (item.isPcOnly) {
      continue;
    }

    const start = getTimeInMinutes(item.start);
    const end = getTimeInMinutes(item.end);
    if (start >= end) {
      throw new Error(`Invalid timetable range: ${item.id}`);
    }

    if (!currentGroup || start >= currentGroupEnd) {
      currentGroup = {
        id: `group-${item.start.replace(":", "")}`,
        time: item.start,
        cards: [],
      };
      currentGroupEnd = end;
      groups.push(currentGroup);
    } else {
      currentGroupEnd = Math.max(currentGroupEnd, end);
    }

    currentGroup.cards.push(createCard(item));
  }

  return groups;

  function createCard(item: TimetableItem): TimetableCell {
    const track = selectFirstTrack(item);
    const sourceIndex = sourceOrder.get(item);
    if (sourceIndex === undefined) {
      throw new Error(`Unknown timetable item: ${item.id}`);
    }

    return {
      id: `${item.id}-${sourceIndex}`,
      type: item.type,
      track,
      color: TIMETABLE_TRACKS[track].color,
      heading: item.heading ?? "",
      headingUrl: item.headingUrl,
      programs: item.programs,
      ...item.display,
      startTime: item.display?.startTime ?? item.start,
      endTime: item.display?.endTime ?? item.end,
    };
  }
}

/** Returns the chronological and track order used by My Timetable. */
export function sortMyTimetableItemsForDisplay(
  sourceItems: readonly TimetableItem[],
): TimetableItem[] {
  const sourceOrder = new Map(sourceItems.map((item, index) => [item, index]));

  return [...sourceItems].sort((left, right) => {
    const startDifference = left.start.localeCompare(right.start);
    if (startDifference !== 0) {
      return startDifference;
    }

    return (
      TRACKS.indexOf(selectFirstTrack(left)) - TRACKS.indexOf(selectFirstTrack(right)) ||
      getSourceIndex(left) - getSourceIndex(right)
    );
  });

  function getSourceIndex(item: TimetableItem): number {
    const index = sourceOrder.get(item);
    if (index === undefined) {
      throw new Error(`Unknown timetable item: ${item.id}`);
    }

    return index;
  }
}

function selectFirstTrack(item: TimetableItem): TimetableTrack {
  const track = TRACKS.find((candidate) => item.tracks.includes(candidate));
  if (!track) {
    throw new Error(`Timetable item has no tracks: ${item.id}`);
  }

  return track;
}

function getTimeInMinutes(time: TimetableTime): number {
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const hours = match?.[1];
  const minutes = match?.[2];
  if (!hours || !minutes) {
    throw new Error(`Invalid timetable time: ${time}`);
  }

  return Number(hours) * 60 + Number(minutes);
}
