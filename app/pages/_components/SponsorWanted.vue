<script setup lang="ts">
import { useI18n } from "#imports";
import { JaSponsorWanted, EnSponsorWanted } from "#components";

const { locale } = useI18n();
</script>

<template>
  <component :is="locale === 'ja' ? JaSponsorWanted : EnSponsorWanted" />
</template>
