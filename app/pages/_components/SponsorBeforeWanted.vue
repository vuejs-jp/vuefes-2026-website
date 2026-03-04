<script setup lang="ts">
import { useI18n } from "#imports";
import { JaSponsorBeforeWanted, EnSponsorBeforeWanted } from "#components";

const { locale } = useI18n();
</script>

<template>
  <component :is="locale === 'ja' ? JaSponsorBeforeWanted : EnSponsorBeforeWanted" />
</template>
