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
  "cspell lint --file-list stdin --no-must-find-files --no-cache",
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

const buildEnv = [
  "NODE_OPTIONS",
  "NITRO_PRESET",
  "APP_ENV",
  "APP_ORIGIN",
  "NUXT_BASE_PATH",
  "AUTH_SECRET",
  "AUTH_ORIGIN",
  "NUXT_SITE_URL",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_DATABASE_ID",
  "CLOUDFLARE_R2_ACCESS_KEY_ID",
  "CLOUDFLARE_R2_SECRET_ACCESS",
  "CLOUDFLARE_R2_BUCKET_NAME",
  "OAUTH_GITHUB_CLIENT_ID",
  "OAUTH_GITHUB_CLIENT_SECRET_ID",
  "OAUTH_GOOGLE_CLIENT_ID",
  "OAUTH_GOOGLE_CLIENT_SECRET",
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
        command: "node scripts/peatix-api-gen.ts",
        cache: false,
      },
      boot: {
        command: "node scripts/boot.ts",
        cache: false,
      },
      release: {
        command: "node scripts/release.ts",
        cache: false,
      },
      "netlify:bootstrap": {
        command: "node scripts/netlify/bootstrap.ts",
        cache: false,
      },
      "tfstate:create": {
        command: "node scripts/cloudflare/create-tfstate-bucket.ts",
        cache: false,
      },
      deploy: {
        command: "node scripts/netlify/deploy.ts deploy",
        dependsOn: ["build"],
        cache: false,
      },
      "deploy:preview": {
        command: "node scripts/netlify/deploy.ts preview",
        dependsOn: ["build"],
        cache: false,
      },
      "deploy:pr-preview": {
        command: "node scripts/netlify/deploy.ts pr-preview",
        cache: false,
      },
      "deploy:release": {
        command: "node scripts/netlify/deploy.ts release",
        dependsOn: ["build"],
        cache: false,
      },
      "terraform:backend": {
        command: "node scripts/terraform/write-backend.ts",
        cache: false,
      },
      "terraform:init": {
        command: "node scripts/terraform/run.ts init",
        cache: false,
      },
      "terraform:fmt": {
        command: "node scripts/terraform/run.ts fmt",
        cache: false,
      },
      "terraform:fmt:check": {
        command: "node scripts/terraform/run.ts fmt:check",
        cache: false,
      },
      "terraform:validate": {
        command: "node scripts/terraform/run.ts validate",
        cache: false,
      },
      "terraform:plan": {
        command: "node scripts/terraform/run.ts plan",
        cache: false,
      },
      "terraform:plan:ci": {
        command: "node scripts/terraform/run.ts plan:ci",
        cache: false,
      },
      "terraform:show-plan": {
        command: "node scripts/terraform/run.ts show-plan",
        cache: false,
      },
      "terraform:apply": {
        command: "node scripts/terraform/run.ts apply",
        cache: false,
      },
      "terraform:apply:ci": {
        command: "node scripts/terraform/run.ts apply:ci",
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
