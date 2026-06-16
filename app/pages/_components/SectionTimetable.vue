<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { useI18n, useWithBase } from "#imports";

const withBase = useWithBase();
const { t } = useI18n();
const localeRoute = useLocaleRoute();
</script>

<template>
  <VFSection
    :cover-image="{
      alt: t('timetable.coverImageAlt'),
      image: {
        pc: { src: withBase('/images/top/cover/timetable-pc.svg') },
        sp: { src: withBase('/images/top/cover/timetable-sp.svg') },
      },
    }"
  >
    <div class="button-container">
      <VFButton :link="localeRoute('/timetable')">
        {{ t("timetable.view") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.button-container {
  text-align: center;
}
</style>
