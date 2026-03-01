import { defineEventHandler } from "h3";
import { PHOTO_CATEGORIES } from "../../static-data/photo";
import type { PhotoCategory } from "../../static-data/types/photo";

export default defineEventHandler((): PhotoCategory[] => {
  return PHOTO_CATEGORIES;
});
