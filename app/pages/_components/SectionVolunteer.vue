<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useI18n, useWithBase } from "#imports";
import { VFSection, JaVolunteer, EnVolunteer } from "#components";

const withBase = useWithBase();
const { locale, t } = useI18n();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.volunteer"
    :title="t('volunteer.title')"
    :cover-image="{
      alt: t('volunteer.coverImageAlt'),
      image: {
        pc: { src: withBase('/images/top/cover/volunteer-pc.svg') },
        sp: { src: withBase('/images/top/cover/volunteer-sp.svg') },
      },
    }"
  >
    <component :is="locale === 'ja' ? JaVolunteer : EnVolunteer" />

    <div class="volunteer-apply-button">
      <VFButton :link="t('volunteer.applyLink')">
        {{ t("volunteer.applyButton") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.volunteer-apply-button {
  display: block;
  margin: 0 auto;
  margin-top: 2rem;
  width: fit-content;

  @media (--mobile) {
    margin-top: 1.5rem;
  }
}
</style>
