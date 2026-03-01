import type { SponsorData, Option, OptionSponsorData } from "./types/sponsor";

// TODO: 2026 年度のスポンサー情報を追加する
const SPONSORS_PLATINA: SponsorData[] = [];
const SPONSORS_GOLD: SponsorData[] = [];
const SPONSORS_SILVER: SponsorData[] = [];
const SPONSORS_BRONZE: SponsorData[] = [];
const SPONSORS_OPTION_ONLY: SponsorData[] = [];
const SPONSORS_CREATIVE: SponsorData[] = [];
const SPONSORS_INDIVIDUAL: string[] = [];

const filterSponsorsByOption = (option: Option): SponsorData[] => [
  ...SPONSORS_PLATINA.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_GOLD.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_SILVER.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_BRONZE.filter((sponsor) => sponsor.option?.includes(option)),
  ...SPONSORS_OPTION_ONLY.filter((sponsor) => sponsor.option?.includes(option)),
];

const SPONSORS_HALL_NAMING_RIGHTS: SponsorData[] = filterSponsorsByOption("hall-naming-rights");
const SPONSORS_ROOM_NAMING_RIGHTS: SponsorData[] = filterSponsorsByOption("room-naming-rights");
const SPONSORS_HANS_ON: SponsorData[] = filterSponsorsByOption("hands-on");
const SPONSORS_LIVE_TRANSLATION: SponsorData[] = filterSponsorsByOption("live-translation");
const SPONSORS_NAME_BADGE: SponsorData[] = filterSponsorsByOption("name-badge");
const SPONSORS_AFTER_PARTY: SponsorData[] = filterSponsorsByOption("after-party");
const SPONSORS_STUDENT_SUPPORT: SponsorData[] = filterSponsorsByOption("student-support");
const SPONSORS_STAFF_T_SHIRTS: SponsorData[] = filterSponsorsByOption("staff-t-shirts");
const SPONSORS_EXHIBITION: SponsorData[] = filterSponsorsByOption("exhibition");
const SPONSORS_INTERMISSION_SLIDE: SponsorData[] = filterSponsorsByOption("intermission-slide");
const SPONSORS_JOB_BOARD: SponsorData[] = filterSponsorsByOption("job-board");

const SPONSORS_OPTION: OptionSponsorData[] = [
  {
    title: "hallNamingRightsSponsor",
    data: SPONSORS_HALL_NAMING_RIGHTS,
  },
  {
    title: "roomNamingRightsSponsor",
    data: SPONSORS_ROOM_NAMING_RIGHTS,
  },
  {
    title: "handsOnSponsor",
    data: SPONSORS_HANS_ON,
  },
  {
    title: "liveTranslationSponsor",
    data: SPONSORS_LIVE_TRANSLATION,
  },
  {
    title: "nameBadgeSponsor",
    data: SPONSORS_NAME_BADGE,
  },
  {
    title: "afterPartySponsor",
    data: SPONSORS_AFTER_PARTY,
  },
  {
    title: "studentSupportSponsor",
    data: SPONSORS_STUDENT_SUPPORT,
  },
  {
    title: "staffTShirtsSponsor",
    data: SPONSORS_STAFF_T_SHIRTS,
  },
  {
    title: "exhibitionSponsor",
    data: SPONSORS_EXHIBITION,
  },
  {
    title: "intermissionSlideSponsor",
    data: SPONSORS_INTERMISSION_SLIDE,
  },
  {
    title: "jobBoardSponsor",
    data: SPONSORS_JOB_BOARD,
  },
];

export const SPONSORS = {
  PLATINA: SPONSORS_PLATINA,
  GOLD: SPONSORS_GOLD,
  SILVER: SPONSORS_SILVER,
  BRONZE: SPONSORS_BRONZE,
  OPTION_ONLY: SPONSORS_OPTION_ONLY,
  CREATIVE: SPONSORS_CREATIVE,
  INDIVIDUAL: SPONSORS_INDIVIDUAL,
  OPTION: SPONSORS_OPTION,
  JOB_BOARD: SPONSORS_JOB_BOARD,
};
