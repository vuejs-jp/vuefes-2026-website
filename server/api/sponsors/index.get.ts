import { defineEventHandler, getQuery } from "h3";
import { SPONSORS } from "../../static-data/sponsors";
import { resolveSponsor } from "../../static-data/utils";
import type { Sponsor, OptionSponsor } from "../../static-data/types/sponsor";

export default defineEventHandler(
  (
    event,
  ): {
    PLATINA: Sponsor[];
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
      PLATINA: SPONSORS.PLATINA.map((s) => resolveSponsor(s, locale)),
      GOLD: SPONSORS.GOLD.map((s) => resolveSponsor(s, locale)),
      SILVER: SPONSORS.SILVER.map((s) => resolveSponsor(s, locale)),
      BRONZE: SPONSORS.BRONZE.map((s) => resolveSponsor(s, locale)),
      OPTION_ONLY: SPONSORS.OPTION_ONLY.map((s) => resolveSponsor(s, locale)),
      CREATIVE: SPONSORS.CREATIVE.map((s) => resolveSponsor(s, locale)),
      INDIVIDUAL: SPONSORS.INDIVIDUAL,
      OPTION: SPONSORS.OPTION.map((opt) => ({
        title: opt.title,
        data: opt.data.map((s) => resolveSponsor(s, locale)),
      })),
      JOB_BOARD: SPONSORS.JOB_BOARD.map((s) => resolveSponsor(s, locale)),
    };
  },
);
