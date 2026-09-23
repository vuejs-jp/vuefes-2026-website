import { defineEventHandler } from "h3";
import { getLegacyQuery } from "../../utils/getLegacyQuery";
import { createTimetable } from "../../utils/createTimetable";

export default defineEventHandler((event) => {
  const query = getLegacyQuery(event);
  const locale = query.locale === "en" ? "en" : "ja";

  return createTimetable(locale);
});
