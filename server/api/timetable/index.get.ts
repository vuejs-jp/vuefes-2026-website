import { defineEventHandler, getQuery } from "h3";
import { createTimetable } from "../../utils/createTimetable";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const locale = query.locale === "en" ? "en" : "ja";

  return createTimetable(locale);
});
