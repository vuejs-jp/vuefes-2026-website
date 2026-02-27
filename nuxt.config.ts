import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "./modules/00.feature-flags.ts",
    "@nuxt/a11y",
    "@nuxt/scripts",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@nuxtjs/storybook",
    "nuxt-typed-router",
    "@sidebase/nuxt-auth",
    "nuxt-og-image",
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
    authOrigin:
      process.env.NODE_ENV === "production"
        ? process.env.CONTEXT === "production"
          ? "https://vuefes.jp/2026/api/auth"
          : `${process.env.DEPLOY_PRIME_URL}/2026/api/auth`
        : `http://localhost:${process.env.PORT || 3000}/api/auth`,

    // for Peatix API
    peatixApiOrigin: process.env.PEATIX_API_ORIGIN,
    peatixApiSecret: process.env.PEATIX_API_SECRET,
    peatixEventId: process.env.PEATIX_EVENT_ID,

    siteUrl:
      process.env.NODE_ENV === "production"
        ? process.env.CONTEXT === "production"
          ? "https://vuefes.jp/2026/"
          : `${process.env.DEPLOY_PRIME_URL}/2026/`
        : "http://localhost:3000/",

    public: {
      contactFormEndpoint:
        process.env.NUXT_PUBLIC_CONTACT_FORM_ENDPOINT ||
        "https://vuejs-jp.form.newt.so/v1/UR5LmScZc",
      siteUrl:
        process.env.NODE_ENV === "production"
          ? process.env.CONTEXT === "production"
            ? "https://vuefes.jp/2026/"
            : `${process.env.DEPLOY_PRIME_URL}/2026/`
          : "http://localhost:3000/",
    },
  },
  components: [{ path: "~/components", pathPrefix: false }],
  imports: { autoImport: false },
  devtools: { enabled: true },
  app: {
    baseURL:
      process.env.NODE_ENV === "production"
        ? (process.env.NUXT_BASE_PATH || "/2026/")
        : "/",
  },
  // @nuxt/robot don't support generate robots.txt when setting baseURL
  robots: { robotsTxt: false },

  site: {
    // The name and description are set for each language in the following files:
    // i18n/ja/ja.json, i18n/en/en.json
    url:
      process.env.CONTEXT === "branch-deploy"
        ? (process.env.DEPLOY_PRIME_URL || "https://main--vuefes-2026.netlify.app")
        : process.env.NODE_ENV === "production"
          ? (process.env.NUXT_SITE_URL || "https://vuefes.jp/")
          : "http://localhost:3000/",
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

  // Use `process.env.CONTEXT !== "production"` for dev only features
  featureFlags: {
    // ========================================================================
    // イベント開催前のフェーズベースフラグ
    // ========================================================================

    // --- 4月初: 初回ティザー公開 ---
    // スポンサー資料も公開（募集フォームは非公開、募集開始日時を記載して温める）
    sponsorDocument: false, // スポンサー資料のみ表示（募集フォームなし）

    // --- 4月中〜末: スポンサー募集開始 ---
    sponsorWanted: false, // スポンサー募集セクション表示
    sponsorClosed: false, // スポンサー募集終了メッセージ

    // --- 5月末: ゲストスピーカー公開 ---
    // CFP募集が始まることを匂わせる、トーク内容はまだ決まってないので一覧だけ
    guestSpeakers: false, // スピーカーセクション/ページ表示

    // --- 6月初: スポンサー公開 & CFP募集公開 ---
    // 抽選のもの(プラチナ等)が決まった段階で暫定公開、追加があれば随時
    sponsorList: false, // スポンサー一覧セクション/ページ
    cfpOpen: false, // CFP募集中セクション

    // --- 6月末: CFP募集〆切 ---
    cfpClosed: false, // CFP募集終了メッセージ

    // --- 7月初: ボランティアスタッフ募集 ---
    volunteerOpen: false, // ボランティア募集セクション
    volunteerClosed: false, // ボランティア募集終了

    // --- この間のいつか: タイムテーブル、CFPスピーカー、イベント（ハンズオン）、スポンサー ---
    // イベントは最低限ハンズオンは必須（チケットが別なので）、スピーカー一覧もあれば better
    timetable: false, // タイムテーブル表示
    cfpSpeakerList: false, // CFPスピーカー一覧表示
    eventPage: false, // イベントページ有効化（ハンズオン必須）

    // --- 8月初: チケット販売開始 ---
    // ネームカード登録、特商法ページ、個人スポンサー募集も含む
    ticketSales: false, // チケット販売セクション/ページ
    ctaTicket: false, // チケットCTA表示
    nameBadgeRegistration: false, // ネームカード登録機能
    tokushoPage: false, // 特定商取引法に基づく表示ページ
    individualSponsor: false, // 個人スポンサー募集

    // --- 8月初〜中: ストア、イベント（ハンズオン以外） ---
    store: false, // ストアセクション/ページ

    // --- 随時公開 ---
    staff: false, // スタッフ一覧
    relatedEvents: false, // 関連イベントページ
    // アクセスは常に表示

    // --- 学生支援（時期は要調整） ---
    studentSupportOpen: false, // 学生支援募集セクション
    studentSupportClosed: false, // 学生支援募集終了
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
  },

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
    fonts: [
      {
        name: "JetBrainsMono-Regular",
        path: "/fonts/og/JetBrainsMono-Regular.ttf",
      },
      {
        name: "IBMPlexSansJP-Regular",
        path: "/fonts/og/IBMPlexSansJP-Regular.ttf",
      },
      {
        name: "IBMPlexSansJP-SemiBold",
        path: "/fonts/og/IBMPlexSansJP-SemiBold.ttf",
      },
      {
        name: "ClashDisplay-Medium",
        path: "/fonts/og/ClashDisplay-Medium.ttf",
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
    disableServerSideAuth: false,
    baseURL:
      process.env.NODE_ENV === "production"
        ? process.env.CONTEXT === "production"
          ? "https://vuefes.jp/2026/api/auth"
          : `${process.env.DEPLOY_PRIME_URL}/2026/api/auth`
        : `http://localhost:${process.env.PORT || 3000}/api/auth`,
    provider: {
      type: "authjs",
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: {
      // The session will be refreshed every 5 second.
      enablePeriodically: 5000,
      enableOnWindowFocus: true,
    },
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
