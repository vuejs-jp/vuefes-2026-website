<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import { computed, useI18n, useLazyFetch, useState, watch } from "#imports";
import { EnSpeaker, JaSpeaker, NuxtLink, VFButton, VFCarousel } from "#components";
import type { Speaker } from "~~/server/static-data/types/speaker";
import { HOME_HEADING_ID } from "~/constant";

const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

const { data: speakersData } = useLazyFetch("/api/speakers", {
  query: { locale },
  server: false,
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
  speakerId: string;
  color: ColorSet;
};

const attendedSpeakers = computed(() => {
  return (speakersData.value?.speakers ?? []).filter((it) => it.attendedIndex !== undefined);
});

const EVAN_YOU_ID = "yyx990803";
const RANDOM_SPEAKER_COUNT = 4;
const featuredSpeakerIds = useState<string[]>("featured-speaker-ids", () => []);

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

watch(
  attendedSpeakers,
  (attendedSpeakers) => {
    if (attendedSpeakers.length === 0) return;
    const evanYou = attendedSpeakers.find((it) => it.id === EVAN_YOU_ID);
    const featuredSpeakerCount = Math.min(
      attendedSpeakers.length,
      RANDOM_SPEAKER_COUNT + (evanYou ? 1 : 0),
    );
    if (
      featuredSpeakerIds.value.length === featuredSpeakerCount &&
      featuredSpeakerIds.value.every((id) => attendedSpeakers.some((speaker) => speaker.id === id))
    ) {
      return;
    }

    featuredSpeakerIds.value = [
      evanYou?.id,
      ...shuffleArray(attendedSpeakers.filter((it) => it.id !== EVAN_YOU_ID))
        .slice(0, RANDOM_SPEAKER_COUNT)
        .map((it) => it.id),
    ].filter((id): id is string => id !== undefined);
  },
  { immediate: true },
);

const speakers = computed<CarouselSpeaker[]>(() => {
  const colorSetIter = new ColorSetIter();

  const _speakers = featuredSpeakerIds.value
    .map((id) => attendedSpeakers.value.find((it) => it.id === id))
    .filter((it): it is Speaker => it !== undefined)
    .map((it) => ({
      ...it,
      id: it.name,
      speakerId: it.id,
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

    <div class="carousel" :aria-busy="speakers.length === 0">
      <VFCarousel
        v-if="speakers.length > 0"
        :items="speakers"
        :loop="true"
        :label="t('speakers.title')"
        :slide-label="slideLabel"
        :prev-label="t('speakers.previous')"
        :next-label="t('speakers.next')"
      >
        <template #slide="{ data: speaker }">
          <NuxtLink
            :to="
              localeRoute({ name: 'speaker-speakerId', params: { speakerId: speaker.speakerId } })
            "
            class="speaker-card"
          >
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
          </NuxtLink>
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
  --speaker-card-height: 341px;
  --vf-carousel-navigation-gap: 16px;
  --vf-carousel-navigation-button-size: 48px;
  --speaker-carousel-height: calc(
    var(--speaker-card-height) + var(--vf-carousel-navigation-gap) +
      var(--vf-carousel-navigation-button-size)
  );

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
    display: block;
    position: relative;
    border-radius: 10px;
    height: var(--speaker-card-height);
    overflow: hidden;
    margin-inline: 0.55rem;
    border: 1px solid var(--color-divider-light);
    color: inherit;
    text-decoration: none;

    .speaker-avatar {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    @media (any-hover: hover) {
      &:hover .speaker-avatar {
        transform: scale(1.05);
      }
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
  min-height: var(--speaker-carousel-height);
  margin: 0 calc(50% - 60cqw) 32px;

  @media (--carousel) {
    width: 214cqw;
    margin: 0 calc(50% - 107cqw) 24px;
  }
}
</style>
