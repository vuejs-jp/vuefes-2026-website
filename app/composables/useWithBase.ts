import { useRuntimeConfig } from "#app";
import { createWithBase } from "~~/shared/utils/createWithBase";

export function useWithBase() {
  const baseUrl = useRuntimeConfig().app.baseURL;
  const withBase = createWithBase(baseUrl);

  return withBase;
}
