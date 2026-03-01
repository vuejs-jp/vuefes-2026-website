import { defineEventHandler, getQuery } from "h3";
import { GOODS } from "../../static-data/goods";
import { resolveGoods } from "../../static-data/utils";
import type { Goods } from "../../static-data/types/goods";

export default defineEventHandler((event): Goods[] => {
  const query = getQuery(event);
  const locale = (query.locale as "ja" | "en") || "ja";

  return GOODS.map((e) => resolveGoods(e, locale));
});
