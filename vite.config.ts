import { defineConfig } from "vite-plus";

const jsLike = ["*.js", "*.jsx", "*.ts", "*.tsx", "*.mjs", "*.cjs", "*.mts", "*.cts", "*.vue"];

const fmtLike = [...jsLike, "*.json", "*.yml", "*.yaml", "*.md", "*.mdc"];

const textLike = ["*.md", "*.mdc"];

const gitFiles = (patterns: string[]) =>
  `git ls-files -z --cached --others --exclude-standard -- ${patterns.map((pattern) => `'${pattern}'`).join(" ")}`;

const runOnGitFiles = (command: string, patterns: string[]) =>
  `${gitFiles(patterns)} | xargs -0 sh -c '[ "$#" -eq 0 ] || ${command} "$@"' sh`;

const spell = [
  "git ls-files --cached --others --exclude-standard",
  "cspell lint --file-list stdin --no-must-find-files --cache",
].join(" | ");

const check = [
  runOnGitFiles("vp fmt --check", fmtLike),
  runOnGitFiles("vp lint", jsLike),
  runOnGitFiles("textlint", textLike),
  spell,
  "nuxi typecheck",
].join(" && ");

const fix = [
  runOnGitFiles("vp fmt", fmtLike),
  runOnGitFiles("vp lint --fix", jsLike),
  runOnGitFiles("textlint --fix", textLike),
  spell,
  "nuxi typecheck",
].join(" && ");

const netlify = "./node_modules/.bin/netlify";

const buildEnv = [
  "NODE_OPTIONS",
  "NUXT_BASE_PATH",
  "CONTEXT",
  "AUTH_SECRET",
  "AUTH_ORIGIN",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_DATABASE_ID",
  "CLOUDFLARE_R2_ACCESS_KEY_ID",
  "CLOUDFLARE_R2_SECRET_ACCESS",
  "CLOUDFLARE_R2_BUCKET_NAME",
  "OAUTH_GITHUB_CLIENT_ID",
  "OAUTH_GITHUB_CLIENT_SECRET_ID",
  "OAUTH_GOOGLE_CLIENT_ID",
  "OAUTH_GOOGLE_CLIENT_SECRET_ID",
  "PEATIX_API_ORIGIN",
  "PEATIX_API_SECRET",
  "PEATIX_EVENT_ID",
];

export default defineConfig({
  staged: {
    "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,vue,json,yml,yaml,md,mdc}": "vp fmt",
    "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,vue}": "vp lint --fix",
    "*.{md,mdc}": "textlint --fix",
  },
  run: {
    cache: {
      scripts: false,
      tasks: false,
    },
    tasks: {
      dev: {
        command: "nuxt dev",
        cache: false,
      },
      build: {
        command: "nuxt build",
        env: buildEnv,
      },
      preview: {
        command: "nuxt preview",
        cache: false,
      },
      check: {
        command: check,
      },
      fix: {
        command: fix,
        cache: false,
      },
      "db:generate": {
        command: "drizzle-kit generate",
        cache: false,
      },
      "db:migrate": {
        command: "drizzle-kit migrate",
        cache: false,
      },
      "peatix-api-gen": {
        command: "node --experimental-strip-types scripts/peatix-api-gen.ts",
        cache: false,
      },
      release: {
        command: "node --experimental-strip-types scripts/release.ts",
        cache: false,
      },
      deploy: {
        command: `${netlify} deploy --no-build --dir=.output/public`,
        dependsOn: ["build"],
        cache: false,
      },
      "deploy:preview": {
        command: `${netlify} deploy --no-build --dir=.output/public`,
        cache: false,
      },
      "deploy:release": {
        command: `${netlify} deploy --no-build --prod --dir=.output/public`,
        cache: false,
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
