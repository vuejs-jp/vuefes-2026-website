# Vue Fes Japan 2026

## Requirement

- Node.js 24.14.0
- [Vite+](https://vite.plus/) (`vp`)

## Setup

```sh
# clone via ssh
git clone git@github.com:vuejs-jp/vuefes-2026.git
cd vuefes-2026

# install Vite+ globally
curl -fsSL https://vite.plus | bash

# install dependencies
vp install

# launch application dev server
vp run dev
```

This repo uses Vite+ for dependency management and task orchestration, while the app itself still runs through Nuxt and Nuxi commands wrapped as Vite Tasks. Use `vp run <task>` for commands such as `dev`, `build`, `preview`, `check`, and `deploy`.

## Checks

```sh
# format, lint, textlint, spell, and typecheck
vp run check

# apply fixes, then re-run spell and typecheck
vp run fix
```

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

See: https://nuxt.com/docs/4.x/api/nuxt-config#ignore

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

## Plans Overview

### Others

- [ ] Migrate to Cloudflare Workers
- [x] remove PrimeVue (Carousel, Form)
- [ ] Performance Improvements
- [ ] Accessibility Improvements
- [ ] ~~Story Improvements~~
- [ ] Refactor Static Datasets
