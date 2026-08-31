import type { Speaker } from "./speaker";

export type TimeString = `${number}${number}:${number}${number}`;
export type ProgramType = "session" | "lightningTalk" | "panelDiscussion" | "event";
export type ProgramTrack = "track1" | "track2" | "track3" | "track4";

export interface Program {
  id: string;
  url?: string;
  type: ProgramType;
  slideUrl?: string;
  start: TimeString;
  end: TimeString;
  tracks: ProgramTrack[];
  speakers: Speaker[];
  facilitators: Speaker[];
  title?: string;
  overview?: string;
}

type LocaleFieldsKey = "title" | "overview";
type ProgramLocaleFields = Pick<Program, LocaleFieldsKey>;
export type ProgramData = Omit<Program, LocaleFieldsKey | "speakers" | "facilitators"> & {
  speakerIds: string[];
  facilitatorIds?: string[];
  ja: ProgramLocaleFields;
  en: ProgramLocaleFields;
};
