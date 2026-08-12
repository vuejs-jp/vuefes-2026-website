import { defineEventHandler } from "h3";
import { GOODS } from "../../static-data/goods";
import { resolveGoods } from "../../static-data/utils";
import type { Goods } from "../../static-data/types/goods";

export default defineEventHandler((event): Goods[] => {
  const requestedLocale = new URL(event.path, "http://localhost").searchParams.get("locale");
  const locale = requestedLocale === "en" ? "en" : "ja";

  return GOODS.map((e) => resolveGoods(e, locale));
});
