import { navigateTo, useLocaleRoute } from "@typed-router";
import { defineNuxtRouteMiddleware } from "#imports";

/**
 * フィーチャーフラグによるページアクセス制御ミドルウェア
 *
 * 注意: ビルド時にはフラグが false のページは除外されるため、
 * このミドルウェアは主に開発時のフォールバックとして機能します。
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const localeRoute = useLocaleRoute();

  // フィーチャーフラグとルートのマッピング
  const featureGatedRoutes = [
    { routes: ["timetable", "timetable-my"], enabled: import.meta.vfFeatures.timetable },
    {
      routes: ["speaker", "speaker-speakerId"],
      enabled: import.meta.vfFeatures.guestSpeakers,
    },
    {
      routes: ["sponsors", "sponsors-sponsorId"],
      enabled: import.meta.vfFeatures.sponsorList,
    },
    { routes: ["event"], enabled: import.meta.vfFeatures.eventPage },
    { routes: ["store"], enabled: import.meta.vfFeatures.store },
    {
      routes: ["ticket", "ticket-userId", "ticket-userId-edit"],
      enabled: import.meta.vfFeatures.ticketSales,
    },
    { routes: ["related-events"], enabled: import.meta.vfFeatures.relatedEvents },
    { routes: ["photo"], enabled: import.meta.vfFeatures.photoSection },
    { routes: ["tokusho"], enabled: import.meta.vfFeatures.tokushoPage },
  ];

  for (const gate of featureGatedRoutes) {
    // 各ルート名をロケール付きルート名に変換
    const routeNames = gate.routes.map((r) => localeRoute({ name: r as any })?.name);

    // フラグが無効で、現在のルートが対象の場合はインデックスにリダイレクト
    if (!gate.enabled && routeNames.includes(to.name as string)) {
      return navigateTo(localeRoute({ name: "index" }));
    }
  }
});
