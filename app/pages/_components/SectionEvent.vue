<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { useCoverImage, useI18n } from "#imports";

const coverImage = useCoverImage();
const { t } = useI18n();
const localeRoute = useLocaleRoute();
</script>

<template>
  <VFSection
    :cover-image="{
      alt: t('event.coverImageAlt'),
      image: {
        pc: coverImage('event-pc', 'jpg'),
        sp: coverImage('event-sp', 'jpg'),
      },
    }"
  >
    <div class="button-container">
      <VFButton :link="localeRoute('/event')">
        {{ t("event.view") }}
      </VFButton>
      <VFButton :link="localeRoute('/store')">
        {{ t("store.view") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.button-container {
  display: flex;
  justify-content: center;
  column-gap: 32px;
  text-align: center;

  @media (--mobile) {
    flex-direction: column;
    align-items: center;
    row-gap: 24px;
  }

  a {
    width: fit-content;
  }
}
</style>
