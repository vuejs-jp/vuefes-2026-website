<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { HOME_HEADING_ID } from "~/constant";
import { useCoverImage, useI18n } from "#imports";
import { VFSection, JaGetYourTicket, EnGetYourTicket } from "#components";

const coverImage = useCoverImage();
const { locale, t } = useI18n();
const localeRoute = useLocaleRoute();
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.ticket"
    :title="t('ticket.title')"
    :cover-image="{
      alt: t('ticket.coverImageAlt'),
      image: {
        pc: coverImage('get-your-ticket-pc', 'jpg'),
        sp: coverImage('get-your-ticket-sp', 'jpg'),
      },
    }"
  >
    <component :is="locale === 'ja' ? JaGetYourTicket : EnGetYourTicket" />
    <div class="button-container">
      <VFButton :link="localeRoute('/ticket')">
        {{ t("ticket.viewTicketDetails") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.button-container {
  text-align: center;

  margin-top: 32px;
  @media (--mobile) {
    margin-top: 24px;
  }
}
</style>
