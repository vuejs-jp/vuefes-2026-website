import { navigateTo, useLocaleRoute } from "@typed-router";
import { defineNuxtRouteMiddleware, useAuth } from "#imports";
import { NAME_BADGE_REDIRECT_QUERY } from "~/constant";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.vfFeatures.nameBadgeRegistration) return;

  const { status, data } = useAuth();
  const localeRoute = useLocaleRoute();
  const AUTHENTICATED_ONLY = [
    localeRoute({ name: "ticket-userId-edit", params: { userId: ":userId" } }),
  ];

  if (
    status.value === "authenticated" &&
    to.name === localeRoute({ name: "ticket" })?.name &&
    to.query.redirect === NAME_BADGE_REDIRECT_QUERY &&
    data.value?.userId
  ) {
    return await navigateTo(
      localeRoute({
        name: "ticket-userId",
        params: { userId: data.value.userId },
      }),
      { replace: true },
    );
  }

  if (status.value !== "authenticated") {
    for (const route of AUTHENTICATED_ONLY) {
      if (to.name === route?.name) {
        return await navigateTo(localeRoute("/ticket"));
      }
    }
  }
});
