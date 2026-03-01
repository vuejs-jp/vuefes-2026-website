import type {
  SpeakerData,
  Speaker,
  StudentSupportSpeakerData,
  StudentSupportSpeaker,
} from "./types/speaker";
import type { SponsorData, Sponsor } from "./types/sponsor";
import type { RelatedEventsData, RelatedEvents } from "./types/related-events";
import type { Goods, GoodsData } from "./types/goods";
import { createWithBase } from "../../shared/utils/createWithBase";
import { useRuntimeConfig } from "#imports";
import type { Staff } from "./types/staff";

const withBase = (() => {
  const baseUrl = useRuntimeConfig().app.baseURL;
  return createWithBase(baseUrl);
})();

type Locale = "ja" | "en";

export function resolveSpeaker(data: SpeakerData, locale: Locale): Speaker {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...resolveBaseUrls(base), ...localeFields };

  type BaseData = Omit<SpeakerData, "ja" | "en">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      avatarUrl: withBase(base.avatarUrl),
    };
  }
}

export function resolveStudentSupportSpeaker(
  data: StudentSupportSpeakerData,
  locale: Locale,
): StudentSupportSpeaker {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...resolveBaseUrls(base), ...localeFields };

  type BaseData = Omit<StudentSupportSpeakerData, "ja" | "en">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      avatarUrl: withBase(base.avatarUrl),
    };
  }
}

export function resolveSponsor(data: SponsorData, locale: Locale): Sponsor {
  const { ja, en, session, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return {
    ...resolveBaseUrls(base),
    ...localeFields,
    session: session?.map((s) => ({
      ...(locale === "ja" ? s.ja : s.en),
      speaker: resolveSpeaker(s.speaker, locale),
    })),
  };

  type BaseData = Omit<SponsorData, "ja" | "en" | "session">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      logoImageUrl: withBase(base.logoImageUrl),
    };
  }
}

export function resolveRelatedEvents(data: RelatedEventsData, locale: Locale): RelatedEvents {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...resolveBaseUrls(base), ...localeFields };

  type BaseData = Omit<RelatedEventsData, "ja" | "en">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      coverUrl: withBase(base.coverUrl),
    };
  }
}

export function resolveStaff(data: Staff): Staff {
  return resolveBaseUrls(data);

  function resolveBaseUrls(data: Staff): Staff {
    const avatarUrl = data.avatarUrl;
    return {
      ...data,
      avatarUrl: avatarUrl ? withBase(avatarUrl) : undefined,
    };
  }
}

export function resolveGoods(data: GoodsData, locale: Locale): Goods {
  const { ja, en, specs, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return {
    ...resolveBaseUrls(base),
    ...localeFields,
    specs: {
      ...specs,
      ...(locale === "ja" ? specs.ja : specs.en),
    },
  };

  type BaseData = Omit<GoodsData, "ja" | "en" | "specs">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      src: withBase(base.src),
    };
  }
}

