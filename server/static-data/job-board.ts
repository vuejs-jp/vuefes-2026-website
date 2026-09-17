import type { JobBoardData } from "./types/job-board";

export const JOB_BOARDS: JobBoardData[] = [
  {
    sponsorId: "hennge",
    imageUrl: "/images/job-board/hennge.jpeg",
    linkUrl: "https://recruit.hennge.com/en/mid-career-ngh/",
    ja: {
      imageAlt: "HENNGE株式会社のジョブボード画像",
    },
    en: {
      imageAlt: "HENNGE's job board image",
    },
  },
  {
    sponsorId: "istyle",
    imageUrl: "/images/job-board/istyle.png",
    linkUrl: "https://www.istyle.co.jp/recruit/",
    ja: {
      imageAlt: "株式会社アイスタイルのジョブボード画像",
    },
    en: {
      imageAlt: "istyle Inc. job board image",
    },
  },
];
