<script setup lang="ts">
import { Temporal } from "temporal-polyfill-lite";
import { computed } from "vue";
import { HOME_HEADING_ID } from "~/constant";
import { useI18n, useWithBase, useRuntimeConfig, useCurrentInstant } from "#imports";
import { VFSection, JaCfpOpen, EnCfpOpen } from "#components";

const withBase = useWithBase();
const { locale, t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const currentInstant = useCurrentInstant();
const cfpApplyPeriod = runtimeConfig.public.buttonActivationPeriods.cfpApply;
const cfpApplyStartsAt = Temporal.ZonedDateTime.from(cfpApplyPeriod.startsAt).toInstant();
const cfpApplyEndsAt = Temporal.ZonedDateTime.from(cfpApplyPeriod.endsAt).toInstant();
const isCfpApplyActive = computed(
  () =>
    currentInstant.value !== null &&
    Temporal.Instant.compare(currentInstant.value, cfpApplyStartsAt) >= 0 &&
    Temporal.Instant.compare(currentInstant.value, cfpApplyEndsAt) < 0,
);
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.cfp"
    :title="t('cfp.title')"
    :cover-image="{
      alt: t('cfp.coverImageAlt'),
      image: {
        pc: { src: withBase('/images/top/cover/cfp-pc.svg') },
        sp: { src: withBase('/images/top/cover/cfp-sp.svg') },
      },
    }"
  >
    <component :is="locale === 'ja' ? JaCfpOpen : EnCfpOpen" />

    <div class="application-cfp">
      <VFButton
        :link="isCfpApplyActive ? t('cfp.applyLink') : undefined"
        :external="isCfpApplyActive ? true : undefined"
        :disabled="!isCfpApplyActive"
      >
        {{ t("cfp.apply") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
.application-cfp {
  margin-top: 2rem;
  display: grid;
  place-items: center;
}
</style>
