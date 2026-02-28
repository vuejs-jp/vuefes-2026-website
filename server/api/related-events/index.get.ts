import { defineEventHandler, getQuery } from "h3";
import { RELATED_EVENTS } from "../../static-data/related-events";
import { resolveRelatedEvents } from "../../static-data/utils";
import type { RelatedEvents } from "../../static-data/types/related-events";

export default defineEventHandler((event): RelatedEvents[] => {
  const query = getQuery(event);
  const locale = (query.locale as "ja" | "en") || "ja";

  return RELATED_EVENTS.map((e) => resolveRelatedEvents(e, locale));
});
