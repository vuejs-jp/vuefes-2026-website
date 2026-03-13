<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { computed, useI18n, useFetch } from "#imports";
import { EnSpeaker, JaSpeaker, VFButton, VFCarousel } from "#components";
import type { Speaker } from "~~/server/static-data/types/speaker";
import { HOME_HEADING_ID } from "~/constant";

const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

const { data: speakersData } = await useFetch("/api/speakers", {
  query: { locale },
});

interface ColorSet {
  base: string;
  sub: string;
}

class ColorSetIter {
  static THEMES = ["primary", "orange", "navy", "purple"];
  private index = -1;

  public next(): ColorSet {
    this.index = (this.index + 1) % ColorSetIter.THEMES.length;
    const theme = ColorSetIter.THEMES[this.index];
    return {
      base: `var(--color-${theme}-base)`,
      sub: `var(--color-${theme}-sub)`,
    };
  }
}

type CarouselSpeaker = Omit<Speaker, "id" | "color"> & {
  id: string;
  color: ColorSet;
};

const speakers = computed<CarouselSpeaker[]>(() => {
  const colorSetIter = new ColorSetIter();

  const allSpeakers = [
    ...(speakersData.value?.sessionSpeakers ?? []),
    ...(speakersData.value?.panelDiscussionSpeakers ?? []),
  ];

  const _speakers = allSpeakers
    .filter((it, index, speakers) => index === speakers.findIndex((s) => s.name === it.name))
    .filter((it) => it.attendedIndex !== undefined)
    .sort((a, b) => a.attendedIndex! - b.attendedIndex!)
    .map((it) => ({
      ...it,
      id: it.name,
      color: colorSetIter.next(),
    }));

  return _speakers;
});

const slideLabel = (index: number, total: number) => t("speakers.slideLabel", { index, total });
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.speaker" :title="t('speakers.title')" class="section-speakers">
    <component :is="locale === 'ja' ? JaSpeaker : EnSpeaker" />

    <h3 class="featured-speaker-heading">
      {{ t("speakers.featured") }}
    </h3>

    <div class="carousel">
      <VFCarousel
        :items="speakers"
        :loop="true"
        :label="t('speakers.title')"
        :slide-label="slideLabel"
        :prev-label="t('speakers.previous')"
        :next-label="t('speakers.next')"
      >
        <template #slide="{ data: speaker }">
          <div class="speaker-card">
            <img
              :src="speaker.avatarUrl"
              :alt="`${speaker.name}${speaker.affiliation ? `, ${speaker.affiliation}` : ''}${speaker.title ? `, ${speaker.title}` : ''}`"
              class="speaker-avatar"
              loading="lazy"
              decoding="async"
              width="300"
              height="341"
            />
            <p
              v-if="speaker.affiliation || speaker.title"
              :style="{
                color: speaker.color.base,
                backgroundColor: speaker.color.sub,
              }"
              class="speaker-affiliation"
              aria-hidden="true"
            >
              {{ speaker.affiliation }}<br v-if="speaker.affiliation && speaker.title" />
              {{ speaker.title }}
            </p>

            <p
              class="speaker-name"
              :style="{
                color: speaker.color.sub,
                backgroundColor: speaker.color.base,
              }"
              aria-hidden="true"
            >
              {{ speaker.name }}
            </p>
          </div>
        </template>
      </VFCarousel>
    </div>

    <div class="view-all-speakers">
      <VFButton :link="localeRoute({ name: 'speaker' })">
        {{ t("speakers.viewAll") }}
      </VFButton>
    </div>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.section-speakers {
  container-type: inline-size;
  overflow: hidden;
  h3.featured-speaker-heading {
    margin-bottom: 1rem;
    color: var(--color-base);
    text-align: center;
    font-size: 18px;

    @media (--mobile) {
      margin-top: 1.5rem;
      font-size: 16px;
    }
  }

  .speaker-card {
    position: relative;
    border-radius: 10px;
    height: 341px;
    overflow: hidden;
    margin-inline: 0.55rem;
    border: 1px solid var(--color-divider-light);

    .speaker-avatar {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .speaker-affiliation {
      position: absolute;
      right: 0;
      padding: 0.4rem 0.53rem;
      font-size: 0.75rem;
      font-family: JetBrainsMono-Regular;
      line-height: 1.2;
      letter-spacing: -0.015em;
      text-align: right;
    }

    .speaker-name {
      width: fit-content;
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 1.53rem;
      font-family: IBMPlexSansJP-Regular;
      padding: 0.667rem 1.067rem 0.533rem 1.067rem;
      line-height: 1;
      letter-spacing: -0.031em;
    }
  }

  .view-all-speakers {
    display: grid;
    place-items: center;
  }
}

.carousel {
  width: 120cqw;
  margin: 0 calc(50% - 60cqw) 32px;

  @media (--carousel) {
    width: 214cqw;
    margin: 0 calc(50% - 107cqw) 24px;
  }
}
</style>
