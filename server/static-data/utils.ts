import type {
  SpeakerData,
  Speaker,
  StudentSupportSpeakerData,
  StudentSupportSpeaker,
} from "./types/speaker";
import type { SponsorData, Sponsor } from "./types/sponsor";
import type { RelatedEventsData, RelatedEvents } from "./types/related-events";
import type { Goods, GoodsData } from "./types/goods";

type Locale = "ja" | "en";

export function resolveSpeaker(data: SpeakerData, locale: Locale): Speaker {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...base, ...localeFields };
}

export function resolveStudentSupportSpeaker(
  data: StudentSupportSpeakerData,
  locale: Locale,
): StudentSupportSpeaker {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...base, ...localeFields };
}

export function resolveSponsor(data: SponsorData, locale: Locale): Sponsor {
  const { ja, en, session, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return {
    ...base,
    ...localeFields,
    session: session?.map((s) => ({
      ...(locale === "ja" ? s.ja : s.en),
      speaker: resolveSpeaker(s.speaker, locale),
    })),
  };
}

export function resolveRelatedEvents(data: RelatedEventsData, locale: Locale): RelatedEvents {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...base, ...localeFields };
}

export function resolveGoods(data: GoodsData, locale: Locale): Goods {
  const { ja, en, specs, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return {
    ...base,
    ...localeFields,
    specs: {
      ...specs,
      ...(locale === "ja" ? specs.ja : specs.en),
    },
  };
}
