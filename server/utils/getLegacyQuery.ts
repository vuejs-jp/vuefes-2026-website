import type { H3Event } from "h3";
import { getQuery as getH3V1Query } from "h3-v1";

export function getLegacyQuery(event: H3Event): Record<string, string | string[]> {
  // Nitro passes an h3 v1 event, while Nuxt currently types route events as h3 v2.
  return getH3V1Query<Record<string, string | string[]>>(
    event as unknown as Parameters<typeof getH3V1Query>[0],
  );
}
