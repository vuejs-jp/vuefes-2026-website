import { defineEventHandler } from "h3";
import { getLegacyQuery } from "../../utils/getLegacyQuery";
import { JOB_BOARDS } from "../../static-data/job-board";
import { resolveJobBoard } from "../../static-data/utils";
import type { JobBoard } from "../../static-data/types/job-board";

export default defineEventHandler((event): JobBoard[] => {
  const query = getLegacyQuery(event);
  const locale = (query.locale as "ja" | "en") || "ja";

  return JOB_BOARDS.map((e) => resolveJobBoard(e, locale));
});
