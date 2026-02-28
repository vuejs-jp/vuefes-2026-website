export interface SpeakerLocaleFields {
  name: string;
  title?: string;
  affiliation?: string;
  talkTitle?: string;
  talkOverview?: string;
}

export interface SpeakerData {
  id: string;
  avatarUrl: string;
  color: "default" | "purple" | "orange" | "navy";
  attendedIndex?: number;
  sponsorId?: string;
  slide?: string;
  talkSchedule?: string;
  talkTrack?: "hacomono" | "mates" | "feature" | "cyberAgent";
  socialUrls?: {
    x?: string;
    bluesky?: string;
    github?: string;
    mastodon?: string;
  };
  ja: SpeakerLocaleFields;
  en: SpeakerLocaleFields;
}

export interface Speaker {
  id: string;
  name: string;
  avatarUrl: string;
  color: "default" | "purple" | "orange" | "navy";
  attendedIndex?: number;
  affiliation?: string;
  title?: string;
  sponsorId?: string;
  slide?: string;
  talkSchedule?: string;
  talkTrack?: "hacomono" | "mates" | "feature" | "cyberAgent";
  talkTitle?: string;
  talkOverview?: string;
  socialUrls?: {
    x?: string;
    bluesky?: string;
    github?: string;
    mastodon?: string;
  };
}

export type StudentSupportSpeakerData = Omit<SpeakerData, "id" | "color">;
export type StudentSupportSpeaker = Omit<Speaker, "id" | "color">;
