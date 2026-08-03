import { Temporal } from "temporal-polyfill-lite";
import { describe, expect, it } from "vite-plus/test";

import { formatTicketDeadline } from "./formatTicketDeadline";

const earlyBirdDeadline = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 8,
  day: 31,
  hour: 23,
  minute: 59,
  timeZone: "Asia/Tokyo",
});

const cancellationDeadline = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 9,
  day: 21,
  hour: 23,
  minute: 59,
  timeZone: "Asia/Tokyo",
});

describe("formatTicketDeadline", () => {
  it("returns a text deadline as-is", () => {
    const deadline = "2026年9月下旬ごろ（詳細は確定次第、掲載します）";

    expect(formatTicketDeadline(deadline, "ja", "nameBadgeEditing")).toBe(deadline);
  });

  it("formats the early bird deadline in Japanese", () => {
    expect(formatTicketDeadline(earlyBirdDeadline, "ja", "dateTimeWithWeekday")).toBe(
      "8/31（月）23:59",
    );
  });

  it("formats the early bird deadline in English", () => {
    expect(formatTicketDeadline(earlyBirdDeadline, "en", "dateTimeWithWeekday")).toBe(
      "August 31 (Mon) at 23:59",
    );
  });

  it("formats the cancellation deadline in Japanese", () => {
    expect(formatTicketDeadline(cancellationDeadline, "ja", "dateWithWeekday")).toBe(
      "2026/9/21（月）",
    );
    expect(formatTicketDeadline(cancellationDeadline, "ja", "shortDateWithWeekday")).toBe(
      "9/21（月）",
    );
  });

  it("formats the cancellation deadline in English", () => {
    expect(formatTicketDeadline(cancellationDeadline, "en", "dateWithWeekday")).toBe(
      "September 21, 2026 (Mon)",
    );
    expect(formatTicketDeadline(cancellationDeadline, "en", "date")).toBe("September 21, 2026");
  });
});
