import { defineEventHandler } from "h3";

import type { Timetable } from "../../static-data/types/timetable";

// TODO: 2026 年度のタイムテーブルを構築する
export default defineEventHandler((): Timetable => {
  return {
    id: "timetable",
    rows: [],
  };
});
