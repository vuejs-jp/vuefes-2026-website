<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useI18n } from "#imports";
import { VFSection, JaCfpOpen, EnCfpOpen } from "#components";

const { locale, t } = useI18n();
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.cfp" :title="t('cfp.title')">
    <component :is="locale === 'ja' ? JaCfpOpen : EnCfpOpen" />
  </VFSection>
</template>
