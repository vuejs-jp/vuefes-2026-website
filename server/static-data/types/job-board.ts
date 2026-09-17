export interface JobBoardLocaleFields {
  imageAlt: string;
}

export interface JobBoardData {
  sponsorId: string;
  imageUrl: string;
  linkUrl: string;
  ja: JobBoardLocaleFields;
  en: JobBoardLocaleFields;
}

export interface JobBoard {
  sponsorId: string;
  imageUrl: string;
  linkUrl: string;
  imageAlt: string;
}
