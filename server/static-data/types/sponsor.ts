import type { Program } from "./program";

export interface Sponsor {
  id: string;
  logoImageUrl: string;
  linkUrl: string;
  plan: "platinum" | "gold" | "silver" | "bronze" | "creative" | "option-only";
  option?: Option[];
  program?: Program[];
  name: string;
  logoImageAlt: string;
  description?: string;
}

type LocaleFieldsKey = "name" | "logoImageAlt" | "description" | "linkUrl";
type SponsorLocaleFields = Pick<Sponsor, LocaleFieldsKey>;
export type SponsorData = Omit<Sponsor, LocaleFieldsKey | "program"> & {
  programIds?: string[];
  ja: SponsorLocaleFields;
  en: SponsorLocaleFields;
};

export type Option =
  | "hall-naming-rights"
  | "room-naming-rights"
  | "hands-on"
  | "live-translation"
  | "name-badge"
  | "after-party"
  | "student-support-standard"
  | "student-support-mini"
  | "staff-t-shirts"
  | "exhibition"
  | "intermission-slide"
  | "job-board"
  | "media"
  | "tool";

export interface OptionSponsorData {
  title: string;
  data: SponsorData[];
}

export interface OptionSponsor {
  title: string;
  data: Sponsor[];
}
