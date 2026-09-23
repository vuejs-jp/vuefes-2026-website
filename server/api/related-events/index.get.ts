import { defineEventHandler } from "h3";
import { getLegacyQuery } from "../../utils/getLegacyQuery";
import { RELATED_EVENTS } from "../../static-data/related-events";
import { resolveRelatedEvents } from "../../static-data/utils";
import type { RelatedEvents } from "../../static-data/types/related-events";

export default defineEventHandler((event): RelatedEvents[] => {
  const query = getLegacyQuery(event);
  const locale = (query.locale as "ja" | "en") || "ja";

  return RELATED_EVENTS.map((e) => resolveRelatedEvents(e, locale));
});
