<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useI18n, useWithBase } from "#imports";
import { VFSection, JaSponsorDocument, EnSponsorDocument } from "#components";

const withBase = useWithBase();
const { locale, t } = useI18n();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.sponsorWanted"
    :title="t('sponsorWanted')"
    :cover-image="{
      alt: t('sponsorWantedCoverImageAlt'),
      image: {
        pc: { src: withBase('/images/top/cover/sponsor-wanted-pc.svg') },
        sp: { src: withBase('/images/top/cover/sponsor-wanted-sp.svg') },
      },
    }"
  >
    <component :is="locale === 'ja' ? JaSponsorDocument : EnSponsorDocument" />
    <slot />
  </VFSection>
</template>
