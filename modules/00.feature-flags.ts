import { defineNuxtModule, addTemplate } from "nuxt/kit";
import type { NuxtPage } from "nuxt/schema";

export interface FeatureFlags {
  [key: string]: boolean;
}

export type ModuleOptions = FeatureFlags;

/**
 * ページルートとフィーチャーフラグのマッピング
 * フラグが false の場合、該当ページはビルドから除外される（情報漏洩防止）
 */
interface FeatureGatedRoute {
  /** ページのパスパターン (正規表現として評価) */
  pathPattern: RegExp;
  /** 対応するフィーチャーフラグ名 */
  flag: keyof FeatureFlags;
}

const featureGatedRoutes: FeatureGatedRoute[] = [
  // タイムテーブル
  { pathPattern: /^\/timetable$/, flag: "timetable" },

  // スピーカー関連
  { pathPattern: /^\/speaker(\/.*)?$/, flag: "guestSpeakers" },

  // スポンサー関連
  { pathPattern: /^\/sponsors(\/.*)?$/, flag: "sponsorList" },

  // イベントページ
  { pathPattern: /^\/event$/, flag: "eventPage" },

  // ストア
  { pathPattern: /^\/store$/, flag: "store" },

  // チケット関連
  { pathPattern: /^\/ticket(\/.*)?$/, flag: "ticketSales" },

  // 関連イベント
  { pathPattern: /^\/related-events$/, flag: "relatedEvents" },

  // フォトページ（イベント後）
  { pathPattern: /^\/photo$/, flag: "photoSection" },

  // 特定商取引法に基づく表示
  { pathPattern: /^\/tokusho$/, flag: "tokushoPage" },
];

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "feature-flags",
    configKey: "featureFlags",
  },
  defaults: {},
  async setup(options, nuxt) {
    const featureFlags = options || {};
    const defines: Record<string, string> = {};
    for (const [key, value] of Object.entries(featureFlags)) {
      defines[`import.meta.vfFeatures.${key}`] = JSON.stringify(value);
    }

    /**
     * ページ除外フック（情報漏洩防止）
     * フィーチャーフラグが false の場合、該当ページをビルドから完全に除外する
     *
     * 注意:
     * - 開発モード (nuxt dev): ページ除外をスキップ（ホットリロード対応）
     * - 型チェック (nuxt typecheck): ページ除外をスキップ（型定義維持）
     * - 本番ビルド (nuxt build): ページ除外を実行（情報漏洩防止）
     *
     * 本番ビルド時のみページを除外することで、開発中は全ルートの型定義を維持し、
     * 本番環境では未公開コンテンツの情報漏洩を防ぎます。
     ---------------------------------------------------------------------------- */
    nuxt.hook("pages:extend", (pages) => {
      // 開発モードまたは nuxt prepare/typecheck 時はページ除外をスキップ
      // _build は実際のビルド時のみ true になる
      // @ts-expect-error _build is an internal Nuxt option not exposed in types
      const isProductionBuild = !nuxt.options.dev && nuxt.options._build;

      if (!isProductionBuild) {
        return;
      }

      const pagesToRemove: NuxtPage[] = [];

      const checkAndMarkForRemoval = (page: NuxtPage, parentPath = "") => {
        const fullPath = parentPath + (page.path || "");

        for (const gatedRoute of featureGatedRoutes) {
          if (gatedRoute.pathPattern.test(fullPath) && !featureFlags[gatedRoute.flag]) {
            pagesToRemove.push(page);
            return; // このページは削除対象なので子ページのチェックは不要
          }
        }

        // 子ページも再帰的にチェック
        if (page.children) {
          for (const child of page.children) {
            checkAndMarkForRemoval(child, fullPath);
          }
        }
      };

      for (const page of pages) {
        checkAndMarkForRemoval(page);
      }

      // ページを削除
      for (const page of pagesToRemove) {
        const index = pages.indexOf(page);
        if (index !== -1) {
          pages.splice(index, 1);
        }
      }
    });

    const typeContent = generateTypeDeclarations(featureFlags);

    /**
     * For client (Nuxt Vite)
     ---------------------------------------------------------------------------- */

    nuxt.options.vite = nuxt.options.vite || {};
    nuxt.options.vite.define = {
      ...nuxt.options.vite.define,
      ...defines,
    };

    addTemplate({
      filename: "types/feature-flags.d.ts",
      getContents: () => typeContent,
      write: true,
    });

    nuxt.hook("prepare:types", async ({ references }) => {
      references.push({ path: "./types/feature-flags.d.ts" });
    });

    /**
     * For server (Nitro)
     ---------------------------------------------------------------------------- */

    nuxt.options.nitro = nuxt.options.nitro || {};
    nuxt.options.nitro.esbuild = nuxt.options.nitro.esbuild || {};
    nuxt.options.nitro.esbuild.options = nuxt.options.nitro.esbuild.options || {};
    nuxt.options.nitro.esbuild.options.define = {
      ...nuxt.options.nitro.esbuild.options.define,
      ...defines,
    };
    nuxt.options.nitro.replace = { ...nuxt.options.nitro.replace, ...defines };

    addTemplate({
      filename: "types/nitro-feature-flags.d.ts",
      getContents: () => typeContent,
      write: true,
    });

    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.typescript = nitroConfig.typescript || {};
      nitroConfig.typescript.tsConfig = nitroConfig.typescript.tsConfig || {};
      nitroConfig.typescript.tsConfig.compilerOptions =
        nitroConfig.typescript.tsConfig.compilerOptions || {};
      nitroConfig.typescript.tsConfig.compilerOptions.types =
        nitroConfig.typescript.tsConfig.compilerOptions.types || [];
      if (Array.isArray(nitroConfig.typescript.tsConfig.compilerOptions.types)) {
        nitroConfig.typescript.tsConfig.compilerOptions.types.push(
          "../.nuxt/types/nitro-feature-flags",
        );
      }
    });

    nuxt.hook("prepare:types", async ({ references }) => {
      references.push({ path: "./types/nitro-feature-flags.d.ts" });
    });
  },
});

function generateTypeDeclarations(featureFlags: FeatureFlags): string {
  const flagTypes = Object.entries(featureFlags)
    .map(([key, value]) => `    readonly ${key}: ${typeof value};`)
    .join("\n");

  return `// Auto-generated feature flags type definitions
// Do not edit this file directly

declare global {
  interface ImportMetaFeatureFlags {
${flagTypes}
  }

  interface ImportMeta {
    readonly vfFeatures: ImportMetaFeatureFlags;
  }
}

export {};
`;
}
