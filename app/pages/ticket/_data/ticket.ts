import type { Temporal } from "temporal-polyfill-lite";

type Ticket = {
  url: string;
  prices: {
    general: {
      early: number;
      standard: number;
    };
    afterParty: {
      early: number;
      standard: number;
    };
    handsOn: number;
    individualSponsor: number | null;
  };
  deadlines: {
    earlyBird: Temporal.ZonedDateTimeLikeObject;
    cancellation: Temporal.ZonedDateTimeLikeObject;
  };
  nameBadge: {
    editingDeadline: Temporal.ZonedDateTimeLikeObject | string;
  };
};

export const TICKET = {
  url: "https://vuefes2026.peatix.com/view",
  prices: {
    general: {
      early: 7_000,
      standard: 8_000,
    },
    afterParty: {
      early: 10_000,
      standard: 11_000,
    },
    handsOn: 500,
    individualSponsor: 10000,
  },
  deadlines: {
    earlyBird: {
      year: 2026,
      month: 8,
      day: 31,
      hour: 23,
      minute: 59,
      timeZone: "Asia/Tokyo",
    },
    cancellation: {
      year: 2026,
      month: 9,
      day: 21,
      hour: 23,
      minute: 59,
      timeZone: "Asia/Tokyo",
    },
  },
  nameBadge: {
    editingDeadline: "2026年9月下旬ごろ（詳細は確定次第、掲載します）",
  },
} as const satisfies Ticket;
