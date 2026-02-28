export interface RelatedEventsLocaleFields {
  title: string;
  coverAlt: string;
  description: string;
}

export interface RelatedEventsData {
  id: string;
  coverUrl: string;
  date: string;
  linkUrl: string;
  ja: RelatedEventsLocaleFields;
  en: RelatedEventsLocaleFields;
}

export interface RelatedEvents {
  id: string;
  title: string;
  coverUrl: string;
  coverAlt: string;
  date: string;
  description: string;
  linkUrl: string;
}
