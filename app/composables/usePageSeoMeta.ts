import type { PageSeoMetaInput } from "~/utils/createPageSeoMeta";
import { createPageSeoMeta } from "~/utils/createPageSeoMeta";
import { useSeoMeta } from "#imports";

export function usePageSeoMeta(input: PageSeoMetaInput) {
  return useSeoMeta(createPageSeoMeta(input));
}
