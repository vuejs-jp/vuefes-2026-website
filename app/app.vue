<script setup lang="ts">
import "~/assets/styles/main.css";
import { useAutoThemeChanger } from "./stores/animation";

import { useI18n, useHead, useSeoMeta } from "#imports";
import { NuxtPage, NuxtRouteAnnouncer } from "#components";

const { t } = useI18n();

// NOTE: use getter to handle locale changes
const title = () => `${t("nuxtSiteConfig.name")} %separator %s`;
const description = () => t("nuxtSiteConfig.description");
const ogImage = "https://vuefes.jp/2026/og-image.png";

useHead({ templateParams: { separator: "-" } });
useSeoMeta({
  titleTemplate: title,
  ogImage,
  ogTitle: title,
  description,
  ogDescription: description,
});

useAutoThemeChanger();
</script>

<template>
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
