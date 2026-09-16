import { Temporal } from "temporal-polyfill-lite";

import { TICKET } from "../_data/ticket";

const nameBadgeEditingDeadlineInstant = Temporal.ZonedDateTime.from(
  TICKET.nameBadge.editingDeadline,
).toInstant();

export const hasNameBadgeEditingDeadlinePassed = (currentInstant = Temporal.Now.instant()) =>
  Temporal.Instant.compare(currentInstant, nameBadgeEditingDeadlineInstant) >= 0;
