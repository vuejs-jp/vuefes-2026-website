<script setup lang="ts">
import { Temporal } from "temporal-polyfill-lite";
import { useI18n, useRuntimeConfig, useCurrentInstant, computed } from "#imports";
import { VFSection, JaStudentSupportOpen, EnStudentSupportOpen } from "#components";
import { HOME_HEADING_ID } from "~/constant";

const { locale, t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const currentInstant = useCurrentInstant();
const studentApplyPeriod = runtimeConfig.public.buttonActivationPeriods.studentApply;
const studentApplyStartsAt = Temporal.ZonedDateTime.from(studentApplyPeriod.startsAt).toInstant();
const isStudentApplyActive = computed(
  () =>
    currentInstant.value !== null &&
    Temporal.Instant.compare(currentInstant.value, studentApplyStartsAt) >= 0,
);
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.studentSupport" :title="t('student.title')">
    <component :is="locale === 'ja' ? JaStudentSupportOpen : EnStudentSupportOpen" />
    <div class="application-student">
      <VFButton :link="t('student.guidelineLink')" :external="true">
        {{ t("student.guideline") }}
      </VFButton>
      <VFButton
        :link="isStudentApplyActive ? t('student.applyLink') : undefined"
        :external="isStudentApplyActive ? true : undefined"
        :disabled="!isStudentApplyActive"
      >
        {{ t("student.apply") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
.application-student {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 24px 32px;
  text-align: center;
}
</style>
