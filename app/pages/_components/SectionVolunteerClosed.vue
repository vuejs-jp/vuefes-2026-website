<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useI18n } from "#imports";
import { VFSection, JaVolunteerClosed, EnVolunteerClosed } from "#components";

const { locale, t } = useI18n();
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.volunteer" :title="t('volunteer.title')">
    <component :is="locale === 'ja' ? JaVolunteerClosed : EnVolunteerClosed" />
  </VFSection>
</template>
