import { defineEventHandler, getQuery } from "h3";

import type { Timetable } from "../../static-data/types/timetable";

// TODO: 2026 年度のタイムテーブルを構築する
export default defineEventHandler(async (event): Promise<Timetable> => {
  return {
    id: "timetable",
    rows: [],
  };
});
