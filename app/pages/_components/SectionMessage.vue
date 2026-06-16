<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useCoverImage, useI18n } from "#imports";
import { VFSection, JaMessage, EnMessage } from "#components";

const coverImage = useCoverImage();
const { locale, t } = useI18n();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.message"
    :title="t('message')"
    :cover-image="{
      alt: t('messageCoverImageAlt'),
      image: {
        pc: coverImage('message-pc'),
        sp: coverImage('message-sp'),
      },
    }"
  >
    <component :is="locale === 'ja' ? JaMessage : EnMessage" />
  </VFSection>
</template>
