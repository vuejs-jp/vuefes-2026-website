# Vue Fes Japan 2026

## Requirement

- Nix with flakes enabled
- [Vite+](https://vite.plus/) (`vp`)

## Setup

```sh
# clone via ssh
git clone git@github.com:vuejs-jp/vuefes-2026.git
cd vuefes-2026
git submodule update --init --recursive

# enter the dev shell (Node.js 24 + Terraform)
nix develop

# install Vite+ globally if you don't have it yet
curl -fsSL https://vite.plus | bash

# install dependencies
vp install

# launch application dev server
vp run dev
```

The Nix dev shell provides the runtime used by this repo, and Vite+ handles package management and task execution.
This repo uses Vite+ for dependency management and task orchestration, while the app itself still runs through Nuxt, Netlify CLI, and Terraform wrapped as Vite Tasks. Use `vp run <task>` for commands such as `dev`, `build`, `preview`, `check`, `deploy:*`, and `terraform:*`.

## Yearly Rollover

When you copy this repository for the next year, start with:

```sh
vp run boot 2027
```

`vp run boot <year>` rewrites the in-repo year strings automatically and prints a clear TODO list for the remaining manual work:

- review the generated diff
- replace logo / visual assets managed in Google Drive
- initialize the `netlify-master` submodule
- update `netlify-master/netlify.toml` redirects
- commit and push the redirect change in `vuejs-jp/vuefes-2019`

## Netlify Deploy

Fill `.env` or `.env.local` from [`.env.example`](/Users/ubugeeei/projects/personal/oss/vuejs-jp/vuefes-2026/.env.example) before running deploy or Terraform tasks.
Production values are `APP_ORIGIN=https://vuefes.jp` and `NUXT_BASE_PATH=/2026/`. If you set `NUXT_SITE_URL`, keep it origin-only as `https://vuefes.jp/`.

### First-Time Setup

1. Create the blank Netlify site from CLI.
2. Apply Terraform so site settings, env vars, and domains are managed as code.
3. After that, use tag push for production deploys.

```sh
# one-time tfstate bucket bootstrap
vp run tfstate:create

# one-time blank site bootstrap for Netlify
vp run netlify:bootstrap

# apply Netlify / Cloudflare settings via Vite tasks
vp run terraform:plan

vp run terraform:apply
```

### Day-To-Day

```sh
# preview / draft deploy to the year site
vp run deploy:preview

# production deploy to the year site
vp run deploy:release

# normal production flow from GitHub Actions
vp run release patch
```

`vp run release <alpha|beta|rc|minor|patch>` creates and pushes a `v*` tag, and the tag push triggers the production workflow.

`vp run tfstate:create`, `vp run netlify:bootstrap`, `vp run terraform:init`, `vp run terraform:plan`, `vp run terraform:apply`, and `vp run deploy:*` all read settings from `.env` or `.env.local`.

### Root Redirect Hub

The root `vuefes.jp` redirect hub is maintained in [`netlify-master`](./netlify-master), which is a git submodule pointing at `vuejs-jp/vuefes-2019`.

When the current year changes, update the redirect rules in the submodule and open a pull request against `vuejs-jp/vuefes-2019`. The 2026 repository no longer deploys the root site from GitHub Actions.

## Checks

```sh
# check only staged files; installed as the pre-commit hook by `vp config`
vp staged

# format, lint, textlint, spell, and typecheck the whole repo
vp run check

# apply fixes, then re-run spell and typecheck
vp run fix
```

GitHub Actions CI is intentionally limited to non-draft pull requests before merge.
It checks the PR diff through `vp run --cache check:staged`, runs cached typecheck, then runs the build without the VP task cache.
PR preview deploys run only for same-repository pull requests when a collaborator comments `/preview` or manually dispatches the workflow, so opening or updating a PR does not spend a second preview build.

## Database Migration

Uses [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) to run migrations on Cloudflare D1.

Requires the following environment variables: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_API_TOKEN`.

```sh
# Generate migration files from schema changes
vp run db:generate

# Apply migrations to D1
vp run db:migrate
```

## Feature Flags Module

This project includes a custom Nuxt module for managing feature flags with full TypeScript support.

### Features

- **Type-safe**: Auto-generates TypeScript definitions for all feature flags
- **Universal**: Works seamlessly in both client and server environments
- **Build-time resolution**: All feature flags are resolved during build step, not at runtime
- **Zero runtime overhead**: Flags are replaced at build time with constants
- **Tree-shaking friendly**: Unused code paths are eliminated from the final bundle

### Configuration

Configure feature flags in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  featureFlags: {
    timetable: true,
    soldOutAfterParty: false,
  },
});
```

### Usage

#### Dynamic Component Import

Use feature flags with dynamic imports to conditionally load components:

```vue
<script setup lang="ts">
// Conditionally import component based on feature flag
const BetaFeature = import.meta.vfFeatures.betaFeature
  ? defineAsyncComponent(() => import("~/components/BetaFeature.vue"))
  : null;
</script>

<template>
  <div>
    <BetaFeature v-if="BetaFeature" />
  </div>
</template>
```

#### Page-level Feature Flags

Control page generation with Nuxt's `ignore` option:

This approach completely excludes pages from the build, resulting in smaller bundle sizes and true 404s when features are disabled.

See: <https://nuxt.com/docs/4.x/api/nuxt-config#ignore>

#### Server API Routes

Control API endpoints with feature flags:

```ts
// server/api/timetable.get.ts
export default defineEventHandler(async (event) => {
  // Block API if feature is disabled
  if (!import.meta.vfFeatures.timetable) {
    throw createError({
      statusCode: 404,
      statusMessage: "Endpoint not available",
    });
  }

  // Return timetable data
  return await getTimetableData();
});
```
