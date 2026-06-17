import type { CellColor, TimetableTrack } from "./types/timetable";

export const TIMETABLE_TRACKS: Record<TimetableTrack, { color: CellColor }> = {
  track1: { color: "primary" },
  track2: { color: "purple" },
  track3: { color: "orange" },
  track4: { color: "navy" },
} as const;
