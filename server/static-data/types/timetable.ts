import type { Program, ProgramTrack, TimeString } from "./program";
import type { Speaker } from "./speaker";

export type TimetableItemType = "session" | "lightningTalk" | "schedule" | "event";
export type TimetableTime = TimeString;
export type TimetableTrack = ProgramTrack;

export type TimetableSpeaker = Pick<Speaker, "id" | "name" | "affiliation" | "title" | "avatarUrl">;

export type TimetableProgram = Pick<
  Program,
  "id" | "title" | "url" | "slideUrl" | "type" | "tracks"
> & {
  speakers: TimetableSpeaker[];
};

export interface TimetableItem {
  id: string;
  type: TimetableItemType;
  tracks: TimetableTrack[];
  isPcOnly?: boolean;
  heading?: string;
  headingUrl?: string;
  start: TimetableTime;
  end: TimetableTime;
  programs: TimetableProgram[];
  display?: TimetableDisplay;
}

export interface TimetableResponse {
  items: TimetableItem[];
}

export type CellColor = "primary" | "purple" | "orange" | "navy" | "grey";
export interface TimetableDisplay {
  /** Overrides the displayed start time. An empty string hides it. */
  startTime?: string;
  /** Overrides the displayed end time. An empty string hides it. */
  endTime?: string;
  color?: CellColor;
}

export type TimetableCell = TimetableDisplay & {
  id: string;
  type: TimetableItemType;
  track?: TimetableTrack;
  heading: string;
  headingUrl?: string;
  programs: TimetableProgram[];
  colspan?: number;
  rowspan?: number;
};
