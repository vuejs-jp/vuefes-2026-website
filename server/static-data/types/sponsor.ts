import type { SpeakerData, Speaker } from "./speaker";

export interface SponsorLocaleFields {
  name: string;
  logoImageAlt: string;
  description?: string;
}

export interface SponsorSessionLocaleFields {
  title: string;
  overview: string;
}

export interface SponsorSessionData {
  speaker: SpeakerData;
  ja: SponsorSessionLocaleFields;
  en: SponsorSessionLocaleFields;
}

export interface SponsorData {
  id: string;
  logoImageUrl: string;
  linkUrl: string;
  plan: "platina" | "gold" | "silver" | "bronze" | "creative" | "option-only";
  option?: Option[];
  session?: SponsorSessionData[];
  ja: SponsorLocaleFields;
  en: SponsorLocaleFields;
}

export interface Sponsor {
  id: string;
  name: string;
  logoImageUrl: string;
  logoImageAlt: string;
  linkUrl: string;
  plan: "platina" | "gold" | "silver" | "bronze" | "creative" | "option-only";
  option?: Option[];
  description?: string;
  session?: {
    title: string;
    overview: string;
    speaker: Speaker;
  }[];
}

export type Option =
  | "hall-naming-rights"
  | "room-naming-rights"
  | "hands-on"
  | "live-translation"
  | "name-badge"
  | "after-party"
  | "student-support"
  | "staff-t-shirts"
  | "exhibition"
  | "intermission-slide"
  | "job-board";

export interface OptionSponsorData {
  title: string;
  data: SponsorData[];
}

export interface OptionSponsor {
  title: string;
  data: Sponsor[];
}
