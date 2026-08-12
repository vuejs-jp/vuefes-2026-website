<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { HOME_HEADING_ID } from "~/constant";
import { useCoverImage, useI18n } from "#imports";
import { VFSection, JaCheckTheItems, EnCheckTheItems } from "#components";

const coverImage = useCoverImage();
const { locale, t } = useI18n();
const localeRoute = useLocaleRoute();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.store"
    :title="t('store.panel.title')"
    :cover-image="{
      alt: t('store.coverImageAlt'),
      image: {
        pc: coverImage('store-pc', 'jpg'),
        sp: coverImage('store-sp', 'jpg'),
      },
    }"
  >
    <component :is="locale === 'ja' ? JaCheckTheItems : EnCheckTheItems" />
    <div class="button-container">
      <VFButton :link="localeRoute('/store')">
        {{ t("store.view") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.button-container {
  text-align: center;

  margin-top: 32px;
  @media (--mobile) {
    margin-top: 24px;
  }
}
</style>
