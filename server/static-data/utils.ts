import type { SpeakerData, Speaker } from "./types/speaker";
import type { SponsorData, Sponsor } from "./types/sponsor";
import type { ProgramData, Program } from "./types/program";
import type { RelatedEventsData, RelatedEvents } from "./types/related-events";
import type { JobBoardData, JobBoard } from "./types/job-board";
import type { Goods, GoodsData } from "./types/goods";
import type { Staff } from "./types/staff";

const appBaseUrl =
  process.env.NODE_ENV === "production" ? process.env.NUXT_BASE_PATH || "/2026/" : "/";
// Keep this local: this module is also bundled into a Satori server chunk, where
// imports that escape the generated chunk directory cannot be resolved.
const withBase = (path: string) => (appBaseUrl + path).replace(/\/\//g, "/");

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

export function resolveProgram(
  data: ProgramData,
  speakers: readonly SpeakerData[],
  locale: Locale,
): Program {
  const { ja, en, speakerIds, facilitatorIds = [], ...base } = data;
  const localeFields = locale === "ja" ? ja : en;

  const resolveSpeakers = (ids: readonly string[]): Speaker[] =>
    ids.map((speakerId) => {
      const speaker = speakers.find((candidate) => candidate.id === speakerId);
      if (!speaker) {
        throw new Error(`Speaker not found: ${speakerId}`);
      }
      return resolveSpeaker(speaker, locale);
    });

  return {
    ...base,
    ...localeFields,
    speakers: resolveSpeakers(speakerIds),
    facilitators: resolveSpeakers(facilitatorIds),
  };
}

export function resolveSponsor(
  data: SponsorData,
  programs: readonly ProgramData[],
  speakers: readonly SpeakerData[],
  locale: Locale,
): Sponsor {
  const { ja, en, programIds, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return {
    ...resolveBaseUrls(base),
    ...localeFields,
    program: programIds?.map((programId) => {
      const program = programs.find((candidate) => candidate.id === programId);
      if (!program) {
        throw new Error(`Program not found: ${programId}`);
      }
      return resolveProgram(program, speakers, locale);
    }),
  };

  type BaseData = Omit<SponsorData, "ja" | "en" | "programIds">;
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

export function resolveJobBoard(data: JobBoardData, locale: Locale): JobBoard {
  const { ja, en, ...base } = data;
  const localeFields = locale === "ja" ? ja : en;
  return { ...resolveBaseUrls(base), ...localeFields };

  type BaseData = Omit<JobBoardData, "ja" | "en">;
  function resolveBaseUrls(base: BaseData): BaseData {
    return {
      ...base,
      imageUrl: withBase(base.imageUrl),
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
