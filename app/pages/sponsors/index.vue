<script setup lang="ts">
import SponsorGrid from "../../components/SponsorGrid.vue";
import type { OptionSponsor } from "~~/server/static-data/types/sponsor";
import type { SponsorsResponse } from "~/utils/apiResponses";

import {
  definePageMeta,
  useBreakpoint,
  useI18n,
  useRuntimeConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  usePageSeoMeta,
  useFetch,
} from "#imports";
import { VFSection } from "#components";

definePageMeta({ prerender: true });

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();
const bp = useBreakpoint();

const { data: sponsorsData } = await useFetch<SponsorsResponse>("/api/sponsors", {
  query: { locale },
});
const hasSponsors = (sponsors?: unknown[] | null): boolean => (sponsors?.length ?? 0) > 0;
const hasOptionSponsors = (options?: OptionSponsor[] | null): boolean =>
  options?.some((option) => option.data.length > 0) ?? false;

usePageSeoMeta({
  title: t("sponsors.title"),
  image: `${runtimeConfig.public.siteUrl}images/og/sponsors.png`,
});
</script>

<template>
  <div id="pages-sponsors">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Sponsor</h1>

    <VFSection
      v-if="hasSponsors(sponsorsData?.PLATINUM)"
      id="platinum-sponsor"
      :title="t('sponsors.platinumSponsor')"
    >
      <SponsorGrid
        :sponsors="sponsorsData?.PLATINUM ?? []"
        :columns="bp === 'mobile' ? 1 : 2"
        :gap="bp === 'mobile' ? '24px' : '32px'"
      />
    </VFSection>

    <VFSection
      v-if="hasSponsors(sponsorsData?.GOLD)"
      id="gold-sponsor"
      :title="t('sponsors.goldSponsor')"
    >
      <SponsorGrid
        :sponsors="sponsorsData?.GOLD ?? []"
        :columns="bp === 'mobile' ? 2 : 3"
        :gap="bp === 'mobile' ? '24px' : '32px'"
      />
    </VFSection>

    <VFSection
      v-if="hasSponsors(sponsorsData?.SILVER)"
      id="silver-sponsor"
      :title="t('sponsors.silverSponsor')"
    >
      <SponsorGrid
        :sponsors="sponsorsData?.SILVER ?? []"
        :columns="bp === 'mobile' ? 2 : 4"
        :gap="bp === 'mobile' ? '24px' : '32px'"
      />
    </VFSection>

    <VFSection
      v-if="hasSponsors(sponsorsData?.BRONZE)"
      id="bronze-sponsor"
      :title="t('sponsors.bronzeSponsor')"
    >
      <SponsorGrid
        :sponsors="sponsorsData?.BRONZE ?? []"
        :columns="bp === 'mobile' ? 2 : 4"
        :gap="bp === 'mobile' ? '24px' : '32px'"
      />
    </VFSection>

    <VFSection
      v-if="hasOptionSponsors(sponsorsData?.OPTION)"
      id="option-sponsor"
      :title="t('sponsors.optionSponsor')"
    >
      <div v-for="option in (sponsorsData?.OPTION ?? []) as OptionSponsor[]" :key="option.title">
        <div v-if="option.data.length > 0" class="sponsor-option-container">
          <h2 class="sponsor-option-title">
            {{ t(`sponsors.${option.title}`) }}
          </h2>
          <SponsorGrid :sponsors="option.data" :columns="bp === 'mobile' ? 2 : 4" gap="24px" />
        </div>
      </div>
    </VFSection>

    <VFSection
      v-if="hasSponsors(sponsorsData?.CREATIVE)"
      id="creative-sponsor"
      :title="t('sponsors.creativeSponsor')"
    >
      <SponsorGrid
        :sponsors="sponsorsData?.CREATIVE ?? []"
        :columns="bp === 'mobile' ? 2 : 3"
        :gap="bp === 'mobile' ? '24px' : '32px'"
      />
    </VFSection>

    <VFSection
      v-if="hasSponsors(sponsorsData?.INDIVIDUAL)"
      id="individual-sponsor"
      :title="t('sponsors.individualSponsor')"
    >
      <div class="sponsor-individual-container">
        <span v-for="(name, index) in sponsorsData?.INDIVIDUAL ?? []" :key="index">{{ name }}</span>
      </div>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-sponsors {
  display: grid;
  row-gap: 1.5rem;
  @media (--mobile) {
    row-gap: 1rem;
  }

  h1 {
    font-family: "ClashDisplay-Semibold";
    font-size: 3rem;
    padding: 7.5rem 0;
    margin: 0;

    @media (--mobile) {
      padding: 2.5rem 0.75rem;
    }
  }
}

.sponsor-option-container {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 40px;

  @media (--mobile) {
    margin-top: 32px;
  }
}

.sponsor-option-title {
  display: flex;
  align-items: center;
  column-gap: 8px;
  margin: 0;
  color: var(--color-text-default);
}

.sponsor-individual-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
</style>
