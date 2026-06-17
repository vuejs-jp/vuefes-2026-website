export interface Speaker {
  id: string;
  avatarUrl: string;
  color: "default" | "purple" | "orange" | "navy";
  attendedIndex?: number;
  socialUrls?: {
    x?: string;
    bluesky?: string;
    github?: string;
    mastodon?: string;
  };
  name: string;
  title?: string;
  affiliation?: string;
  bio?: string;
}

type LocaleFieldsKey = "name" | "title" | "affiliation" | "bio";
type SpeakerLocaleFields = Pick<Speaker, LocaleFieldsKey>;
export type SpeakerData = Omit<Speaker, LocaleFieldsKey> & {
  ja: SpeakerLocaleFields;
  en: SpeakerLocaleFields;
};
