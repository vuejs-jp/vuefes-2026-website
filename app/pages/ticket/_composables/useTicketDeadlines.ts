import { Temporal } from "temporal-polyfill-lite";

import { TICKET } from "../_data/ticket";
import { formatTicketDeadline } from "../_utils/formatTicketDeadline";
import { computed, useI18n } from "#imports";

const earlyBirdDeadline = Temporal.ZonedDateTime.from(TICKET.deadlines.earlyBird);
const cancellationDeadline = Temporal.ZonedDateTime.from(TICKET.deadlines.cancellation);

const formatNameBadgeEditingDeadline = (
  deadline: Temporal.ZonedDateTimeLikeObject | string,
  locale: string,
) =>
  formatTicketDeadline(
    typeof deadline === "string" ? deadline : Temporal.ZonedDateTime.from(deadline),
    locale,
    "nameBadgeEditing",
  );

export const useTicketDeadlines = () => {
  const { locale } = useI18n();

  return {
    earlyBirdDeadline: computed(() =>
      formatTicketDeadline(earlyBirdDeadline, locale.value, "dateTimeWithWeekday"),
    ),
    cancellationDeadline: computed(() =>
      formatTicketDeadline(cancellationDeadline, locale.value, "dateWithWeekday"),
    ),
    cancellationDate: computed(() =>
      formatTicketDeadline(
        cancellationDeadline,
        locale.value,
        locale.value === "en" ? "date" : "shortDateWithWeekday",
      ),
    ),
    nameBadgeEditingDeadline: computed(() =>
      formatNameBadgeEditingDeadline(TICKET.nameBadge.editingDeadline, locale.value),
    ),
  };
};
