<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useCoverImage, useI18n } from "#imports";
import { VFSection } from "#components";
import { useLocaleRoute } from "@typed-router";

const coverImage = useCoverImage();
const { t } = useI18n();
const localeRoute = useLocaleRoute();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.jobBoard"
    :cover-image="{
      alt: t('jobBoard.coverImageAlt'),
      image: {
        pc: coverImage('job-board-pc'),
        sp: coverImage('job-board-sp'),
      },
    }"
  >
    <div class="view-all-job-boards">
      <VFButton :link="localeRoute({ name: 'job-board' })">
        {{ t("jobBoard.viewAll") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style>
.view-all-job-boards {
  display: grid;
  place-items: center;
}
</style>
