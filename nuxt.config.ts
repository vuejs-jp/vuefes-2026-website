import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import type { NuxtPage } from "nuxt/schema";
import type { Temporal } from "temporal-polyfill-lite";

// https://nuxt.com/docs/api/configuration/nuxt-config

const localPort = process.env.PORT || "3000";
const localOrigin = `http://localhost:${localPort}`;
const appEnv =
  process.env.APP_ENV || (process.env.NODE_ENV === "production" ? "production" : "development");
const appBasePath =
  process.env.NODE_ENV === "production" ? process.env.NUXT_BASE_PATH || "/2026/" : "/";

const normalizeOrigin = (value: string) => value.replace(/\/+$/, "");
const normalizePath = (value: string) => {
  if (!value) {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const joinUrl = (origin: string, path: string) =>
  new URL(path, `${normalizeOrigin(origin)}/`).toString();

const appOrigin =
  process.env.APP_ORIGIN || (appEnv === "production" ? "https://vuefes.jp" : localOrigin);
const publicSiteUrl = joinUrl(appOrigin, normalizePath(appBasePath));
const siteOrigin = new URL(process.env.NUXT_SITE_URL || joinUrl(appOrigin, "/")).origin;
const authOrigin =
  process.env.AUTH_ORIGIN || joinUrl(appOrigin, `${normalizePath(appBasePath)}api/auth`);
type ButtonActivationPeriod = {
  startsAt: Temporal.ZonedDateTimeLikeObject;
  endsAt?: Temporal.ZonedDateTimeLikeObject;
};

const buttonActivationPeriods = {
  cfpApply: {
    startsAt: {
      year: 2026,
      month: 6,
      day: 1,
      hour: 12,
      minute: 0,
      timeZone: "Asia/Tokyo",
    },
    endsAt: {
      year: 2026,
      month: 6,
      day: 30,
      hour: 20,
      minute: 59,
      second: 59,
      timeZone: "Asia/Tokyo",
    },
  },
  studentApply: {
    startsAt: {
      year: 2026,
      month: 6,
      day: 1,
      hour: 12,
      minute: 0,
      timeZone: "Asia/Tokyo",
    },
  },
} satisfies Record<string, ButtonActivationPeriod>;

const featureFlags = {
  // ========================================================================
  // イベント開催前のフェーズベースフラグ
  // ========================================================================

  // --- 4月初: 初回ティザー公開 ---
  // スポンサー資料も公開（募集フォームは非公開、募集開始日時を記載して温める）
  sponsorDocument: true, // スポンサー資料のみ表示（募集フォームなし）

  // --- 4月中〜末: スポンサー募集開始 ---
  sponsorWanted: true, // スポンサー募集セクション表示
  sponsorClosed: false, // スポンサー募集終了メッセージ

  // --- 5月末: ゲストスピーカー公開 ---
  // CFP募集が始まることを匂わせる、トーク内容はまだ決まってないので一覧だけ
  guestSpeakers: true, // スピーカーセクション/ページ表示

  // --- 6月初: スポンサー公開 & CFP募集公開 ---
  // 抽選のもの(プラチナ等)が決まった段階で暫定公開、追加があれば随時
  sponsorList: true, // スポンサー一覧セクション/ページ
  cfpOpen: false, // CFP募集中セクション
  ctaCfp: false, // CFP募集CTA表示

  // --- 6月末: CFP募集〆切 ---
  cfpClosed: false, // CFP募集終了メッセージ

  // --- 7月初: ボランティアスタッフ募集 ---
  volunteerOpen: true, // ボランティア募集セクション
  volunteerClosed: true, // ボランティア募集終了
  ctaVolunteer: false, // ボランティア募集CTA表示

  // --- この間のいつか: タイムテーブル、CFPスピーカー、イベント（ハンズオン）、スポンサー ---
  // イベントは最低限ハンズオンは必須（チケットが別なので）、スピーカー一覧もあれば better
  timetable: true, // タイムテーブル表示
  timetableVenueMap: true, // タイムテーブルページの会場マップ表示
  separateSpeakingType: false, // スピーカー一覧で登壇形式によるセクション分けを行う
  cfpSpeakerList: false, // CFPスピーカー一覧表示
  eventPage: true, // イベントページ有効化（ハンズオン必須）

  // --- 8月初: チケット販売開始 ---
  // ネームカード登録、特商法ページ、個人スポンサー募集も含む
  ticketSales: true, // チケット販売セクション/ページ
  ctaTicket: true, // チケットCTA表示
  // 編集期限到来時はフロント側で自動的に閉じ、確認後にこのフラグを false にする
  nameBadgeRegistration: false, // ネームカード登録機能
  tokushoPage: true, // 特定商取引法に基づく表示ページ
  individualSponsor: false, // 個人スポンサー募集

  // --- 8月初〜中: ストア、イベント（ハンズオン以外） ---
  store: true, // ストアセクション/ページ

  // --- 随時公開 ---
  staff: false, // スタッフ一覧
  relatedEvents: false, // 関連イベントページ
  // アクセスは常に表示

  // --- 学生支援（時期は要調整） ---
  studentSupportOpen: true, // 学生支援募集セクション
  studentSupportDisabled: false, // 学生支援募集のボタンを非活性(募集終了後、文言掲出までの暫定措置)
  studentSupportClosed: true, // 学生支援募集終了
  studentSupportEvent: false, // イベントページの学生支援コンテンツ

  // ========================================================================
  // イベント開催後のフラグ
  // ========================================================================
  // thanksメッセージ、当日の写真、セッションスライド、動画（翌年公開後）
  photoSection: false, // フォトセクション表示（イベント後）
  sessionSlides: false, // セッションスライド表示
  sessionVideo: false, // セッション動画表示（翌年公開後）

  // ========================================================================
  // 売り切れ・終了フラグ
  // ========================================================================
  soldOutAfterParty: false, // アフターパーティー売り切れ
  soldOutEarlyBirdAfterParty: false, // 早割アフターパーティー売り切れ
  soldOutEarlyBird: false, // 早割チケット売り切れ
  soldOutGeneral: false, // 一般チケット売り切れ
  soldOutHandsOn: false, // ハンズオン売り切れ
  soldOutIndividualSponsor: false, // 個人スポンサー売り切れ
  ticketSalesClosed: false, // チケット販売終了
  expiredNameBadgeRegistration: false, // ネームカード登録期限終了

  // ========================================================================
  // スピーカー詳細フラグ（個別に公開タイミングを制御）
  // ========================================================================
  guestDetailsEvan: false,
  guestDetailsDaniel: false,
  guestDetailsJohnson: false,
  guestDetailsAkryum: false,
  guestDetailsBaku: false,
  guestDetailsOgawa: false,
  guestDetailsLeaysgur: false,
};

export default defineNuxtConfig({
  modules: [
    "./modules/00.feature-flags.ts",
    "@nuxt/a11y",
    "@nuxt/fonts",
    "@nuxt/scripts",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "nuxt-typed-router",
    "@sidebase/nuxt-auth",
    "nuxt-og-image",
    "@vizejs/nuxt",
  ],

  $production: {
    scripts: {
      registry: {
        googleAnalytics: {
          id: process.env.NUXT_PUBLIC_GA_ID || "G-H7VEJHSZH4",
        },
      },
    },
  },

  compatibilityDate: "2024-11-01",
  features: { inlineStyles: false },
  future: { compatibilityVersion: 4 },
  experimental: {
    inlineRouteRules: true,
    defaults: {
      nuxtLink: {
        // NOTE: removing noopener, noreferrer
        externalRelAttribute: "",
      },
    },
  },
  runtimeConfig: {
    // for OAuth
    authSecret: process.env.AUTH_SECRET,
    githubClientId: process.env.OAUTH_GITHUB_CLIENT_ID,
    githubClientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET_ID,
    googleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    authOrigin,

    // for Peatix API
    peatixApiOrigin: process.env.PEATIX_API_ORIGIN,
    peatixApiSecret: process.env.PEATIX_API_SECRET,
    peatixEventId: process.env.PEATIX_EVENT_ID,

    siteUrl: publicSiteUrl,

    public: {
      contactFormEndpoint:
        process.env.NUXT_PUBLIC_CONTACT_FORM_ENDPOINT || "https://ssgform.com/s/ATe50Qadv1hZ",
      buttonActivationPeriods,
      siteUrl: publicSiteUrl,
    },
  },
  components: [{ path: "~/components", pathPrefix: false, extensions: ["vue"] }],
  imports: { autoImport: false },
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NODE_ENV === "production" ? process.env.NUXT_BASE_PATH || "/2026/" : "/",
  },
  // @nuxt/robot don't support generate robots.txt when setting baseURL
  robots: { robotsTxt: false },

  site: {
    // The name and description are set for each language in the following files:
    // i18n/ja/ja.json, i18n/en/en.json
    url: siteOrigin,
  },

  plugins: ["~/plugins/v-click-outside.ts"],

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        drafts: {
          customMedia: true,
        },
        nonStandard: {
          deepSelectorCombinator: true,
        },
      },
    },
    plugins: [
      Icons({
        customCollections: {
          icons: FileSystemIconLoader("./public/images/icons", (svg) =>
            svg.replace(/#007F62/g, "var(--color-base)"),
          ),
          logo: FileSystemIconLoader("./public/images/logo", (svg) =>
            svg.replace(/#007F62/g, "var(--color-base)"),
          ),
        },
      }) as any,
    ],
  },

  featureFlags,

  i18n: {
    langDir: ".",
    locales: [
      {
        code: "ja",
        language: "ja-JP",
        name: "Japanese",
        file: "ja/index.yaml",
      },
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en/index.yaml",
      },
    ],
    defaultLocale: "ja",
    // FIXME: https://github.com/vuejs-jp/vuefes-2025/issues/236
    detectBrowserLanguage: false,
  },

  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
    },
    enabled: true,
    runtimeCacheStorage: false,
  },

  fonts: {
    families: [
      {
        name: "OgJetBrainsMono-Regular",
        src: "/fonts/og/JetBrainsMono-Regular.ttf",
        weight: 400,
        style: "normal",
        global: true,
        preload: false,
      },
      {
        name: "OgIBMPlexSansJP-Regular",
        src: "/fonts/og/IBMPlexSansJP-Regular.ttf",
        weight: 400,
        style: "normal",
        global: true,
        preload: false,
      },
      {
        name: "OgIBMPlexSansJP-SemiBold",
        src: "/fonts/og/IBMPlexSansJP-SemiBold.ttf",
        weight: 400,
        style: "normal",
        global: true,
        preload: false,
      },
      {
        name: "OgClashDisplay-Medium",
        src: "/fonts/og/ClashDisplay-Medium.ttf",
        weight: 400,
        style: "normal",
        global: true,
        preload: false,
      },
    ],
  },

  seo: {
    meta: {
      twitterSite: "@vuefes",
      twitterCreator: "@vuefes",
    },
  },
  // img:{
  //  domains: ['vuefes.jp/2025'],
  //  provider: "ipx",
  // },

  auth: {
    disableServerSideAuth: !featureFlags.nameBadgeRegistration,
    baseURL: authOrigin,
    provider: {
      type: "authjs",
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: featureFlags.nameBadgeRegistration
      ? {
          enablePeriodically: 5000,
          enableOnWindowFocus: true,
        }
      : {
          enablePeriodically: false,
          enableOnWindowFocus: false,
        },
  },

  vize: {
    compiler: false,
    lint: true,
  },

  hooks: {
    // Private Folder Impl
    "pages:extend": (pages) => {
      const pagesToRemove: NuxtPage[] = [];
      pages.forEach((page) => {
        if (/\/_[^/]+/.test(page.path)) {
          pagesToRemove.push(page);
        }
      });
      pagesToRemove.forEach((page) => {
        pages.splice(pages.indexOf(page), 1);
      });
    },
  },
});
