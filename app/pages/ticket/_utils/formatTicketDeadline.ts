import type { Temporal } from "temporal-polyfill-lite";

type TicketDeadlineFormat =
  | "date"
  | "dateWithWeekday"
  | "dateTimeWithWeekday"
  | "nameBadgeEditing"
  | "shortDateWithWeekday";

export const formatTicketDeadline = (
  deadline: Temporal.ZonedDateTime | string,
  locale: string,
  format: TicketDeadlineFormat,
) => {
  if (typeof deadline === "string") return deadline;

  if (format === "nameBadgeEditing") {
    const formattedDeadline = deadline.toLocaleString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: locale === "en" ? "long" : "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDeadline}${locale === "en" ? " (JST)" : "（JST）"}`;
  }

  const weekday = deadline.toLocaleString(locale, { weekday: "short" });

  if (locale === "en") {
    const month = deadline.toLocaleString(locale, { month: "long" });
    const date = `${month} ${deadline.day}, ${deadline.year}`;

    if (format === "date") return date;
    if (format === "shortDateWithWeekday") {
      return `${month} ${deadline.day} (${weekday})`;
    }
    if (format === "dateWithWeekday") return `${date} (${weekday})`;

    return `${month} ${deadline.day} (${weekday}) at ${deadline
      .toPlainTime()
      .toString({ smallestUnit: "minute" })}`;
  }

  const date = `${deadline.year}/${deadline.month}/${deadline.day}`;

  if (format === "date") return date;
  if (format === "shortDateWithWeekday") {
    return `${deadline.month}/${deadline.day}（${weekday}）`;
  }
  if (format === "dateWithWeekday") return `${date}（${weekday}）`;

  return `${deadline.month}/${deadline.day}（${weekday}）${deadline
    .toPlainTime()
    .toString({ smallestUnit: "minute" })}`;
};
