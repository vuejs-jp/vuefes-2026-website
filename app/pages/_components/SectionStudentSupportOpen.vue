<script setup lang="ts">
import { useI18n } from "#imports";
import { VFSection, JaStudentSupportOpen, EnStudentSupportOpen } from "#components";
import { HOME_HEADING_ID } from "~/constant";

const { locale, t } = useI18n();
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.studentSupport" :title="t('student.title')">
    <component :is="locale === 'ja' ? JaStudentSupportOpen : EnStudentSupportOpen" />
  </VFSection>
</template>
