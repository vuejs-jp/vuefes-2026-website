import { defineEventHandler, getQuery } from "h3";
import { SPONSORS } from "../../static-data/sponsors";
import { PROGRAMS } from "../../static-data/programs";
import { SPEAKERS } from "../../static-data/speakers";
import { resolveSponsor } from "../../static-data/utils";
import type { Sponsor, OptionSponsor } from "../../static-data/types/sponsor";

export default defineEventHandler(
  (
    event,
  ): {
    PLATINUM: Sponsor[];
    GOLD: Sponsor[];
    SILVER: Sponsor[];
    BRONZE: Sponsor[];
    OPTION_ONLY: Sponsor[];
    CREATIVE: Sponsor[];
    INDIVIDUAL: string[];
    OPTION: OptionSponsor[];
    JOB_BOARD: Sponsor[];
  } => {
    const query = getQuery(event);
    const locale = (query.locale as "ja" | "en") || "ja";

    return {
      PLATINUM: SPONSORS.PLATINUM.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      GOLD: SPONSORS.GOLD.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      SILVER: SPONSORS.SILVER.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      BRONZE: SPONSORS.BRONZE.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      OPTION_ONLY: SPONSORS.OPTION_ONLY.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      CREATIVE: SPONSORS.CREATIVE.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      INDIVIDUAL: SPONSORS.INDIVIDUAL,
      OPTION: SPONSORS.OPTION.map((opt) => ({
        title: opt.title,
        data: opt.data.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
      })),
      JOB_BOARD: SPONSORS.JOB_BOARD.map((s) => resolveSponsor(s, PROGRAMS, SPEAKERS, locale)),
    };
  },
);
