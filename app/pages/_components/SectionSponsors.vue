<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { HOME_HEADING_ID } from "~/constant";
import { useBreakpoint, useI18n, useWithBase, useFetch } from "#imports";
import { VFSection, SponsorGrid } from "#components";
import type { OptionSponsor } from "~~/server/static-data/types/sponsor";
import type { SponsorsResponse } from "~/utils/apiResponses";

const bp = useBreakpoint();
const withBase = useWithBase();
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

const { data: sponsorsData } = await useFetch<SponsorsResponse>("/api/sponsors", {
  query: { locale },
});

const hasSponsors = (sponsors?: unknown[] | null): boolean => (sponsors?.length ?? 0) > 0;
const hasOptionSponsors = (options?: OptionSponsor[] | null): boolean =>
  options?.some((option) => option.data.length > 0) ?? false;
</script>

<template>
  <VFSection
    :id="HOME_HEADING_ID.sponsorWanted"
    :cover-image="{
      alt: t('sponsors.coverImageAlt'),
      image: {
        pc: { src: withBase('/images/top/cover/sponsors-pc.svg') },
        sp: { src: withBase('/images/top/cover/sponsors-sp.svg') },
      },
    }"
  >
    <div v-if="hasSponsors(sponsorsData?.PLATINUM)" class="sponsor-list">
      <VFHeading id="platinum-sponsors">
        {{ t("sponsors.platinumSponsor") }}
      </VFHeading>
      <div class="sponsor-grid-container">
        <SponsorGrid
          :sponsors="sponsorsData?.PLATINUM ?? []"
          :columns="bp === 'mobile' ? 1 : 2"
          gap="24px"
          image-only
        />
      </div>
    </div>

    <div v-if="hasSponsors(sponsorsData?.GOLD)" class="sponsor-list">
      <VFHeading id="gold-sponsors">
        {{ t("sponsors.goldSponsor") }}
      </VFHeading>
      <div class="sponsor-grid-container">
        <SponsorGrid
          :sponsors="sponsorsData?.GOLD ?? []"
          :columns="bp === 'mobile' ? 2 : 3"
          gap="24px"
          image-only
        />
      </div>
    </div>

    <div v-if="hasSponsors(sponsorsData?.SILVER)" class="sponsor-list">
      <VFHeading id="silver-sponsors">
        {{ t("sponsors.silverSponsor") }}
      </VFHeading>
      <div class="sponsor-grid-container">
        <SponsorGrid
          :sponsors="sponsorsData?.SILVER ?? []"
          :columns="bp === 'mobile' ? 2 : 4"
          gap="24px"
          image-only
        />
      </div>
    </div>

    <div v-if="hasSponsors(sponsorsData?.BRONZE)" class="sponsor-list">
      <VFHeading id="bronze-sponsors">
        {{ t("sponsors.bronzeSponsor") }}
      </VFHeading>
      <div class="sponsor-grid-container">
        <SponsorGrid
          :sponsors="sponsorsData?.BRONZE ?? []"
          :columns="bp === 'mobile' ? 2 : 4"
          gap="24px"
          image-only
        />
      </div>
    </div>

    <div v-if="hasOptionSponsors(sponsorsData?.OPTION)" class="sponsor-list">
      <VFHeading id="option-sponsors">
        {{ t("sponsors.optionSponsor") }}
      </VFHeading>
      <div v-for="option in (sponsorsData?.OPTION ?? []) as OptionSponsor[]" :key="option.title">
        <div v-if="option.data.length > 0" class="sponsor-option-container">
          <h3>{{ t(`sponsors.${option.title}`) }}</h3>
          <SponsorGrid
            :sponsors="option.data"
            :columns="bp === 'mobile' ? 2 : 4"
            gap="24px"
            image-only
          />
        </div>
      </div>
    </div>

    <div v-if="hasSponsors(sponsorsData?.CREATIVE)" class="sponsor-list">
      <VFHeading id="creative-sponsors">
        {{ t("sponsors.creativeSponsor") }}
      </VFHeading>
      <div class="sponsor-grid-container">
        <SponsorGrid
          :sponsors="sponsorsData?.CREATIVE ?? []"
          :columns="bp === 'mobile' ? 2 : 3"
          gap="24px"
          image-only
        />
      </div>
    </div>

    <div v-if="hasSponsors(sponsorsData?.INDIVIDUAL)" class="sponsor-list">
      <VFHeading id="individual-sponsors">
        {{ t("sponsors.individualSponsor") }}
      </VFHeading>
      <div class="sponsor-individual-container">
        <span v-for="(name, index) in sponsorsData?.INDIVIDUAL ?? []" :key="index">{{ name }}</span>
      </div>
    </div>

    <div class="view-all-sponsors">
      <VFButton :link="localeRoute({ name: 'sponsors' })">
        {{ t("sponsors.viewAll") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.sponsor-list:not(:first-child) {
  margin-top: 2rem;
}

.view-all-sponsors {
  display: grid;
  place-items: center;
  margin-top: 32px;
}

.sponsor-grid-container {
  margin-top: 32px;
  margin-bottom: 40px;

  @media (--mobile) {
    margin-top: 24px;
    margin-bottom: 24px;
  }
}

.sponsor-option-container {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.sponsor-individual-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
</style>
