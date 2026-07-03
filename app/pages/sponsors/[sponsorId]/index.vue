<script setup lang="ts">
import { useLocaleRoute, useRoute } from "@typed-router";
import SponsorTag from "../_components/SponsorTag.vue";
import XIcon from "~icons/icons/ic_x";
import GithubIcon from "~icons/icons/ic_github";
import BlueskyIcon from "~icons/icons/ic_bluesky";
import { TIMETABLE_TRACKS } from "~~/server/static-data/timetable";
import type { Sponsor } from "~~/server/static-data/types/sponsor";
import {
  computed,
  defineOgImage,
  definePageMeta,
  useI18n,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useSeoMeta,
  nextTick,
  onMounted,
  useFetch,
} from "#imports";
import { VFSection } from "#components";
import type { Program } from "~~/server/static-data/types/program.js";

definePageMeta({ prerender: true });

const route = useRoute("sponsors-sponsorId");
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

const { data: sponsorsData } = await useFetch("/api/sponsors", {
  query: { locale },
});

type SponsorWithPlan = Omit<Sponsor, "plan"> & { plan: string };
type TextSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "link";
      text: string;
      href: string;
    };
type TextParagraph =
  | {
      type: "spacer";
    }
  | {
      type: "content";
      segments: [TextSegment, ...TextSegment[]];
      hangingIndent: boolean;
    };

const urlPattern = /https?:\/\/[^\s<>"']+/g;
const trailingUrlPunctuationPattern = /[),.;:!?、。）」』】]+$/;

const splitTextByUrls = (text?: string): TextSegment[] => {
  if (!text) return [];

  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const matchIndex = match.index ?? 0;
    const trailingPunctuation = rawUrl.match(trailingUrlPunctuationPattern)?.[0] ?? "";
    const url = rawUrl.slice(0, rawUrl.length - trailingPunctuation.length);

    if (matchIndex > lastIndex) {
      segments.push({ type: "text", text: text.slice(lastIndex, matchIndex) });
    }

    if (url) {
      segments.push({ type: "link", text: url, href: url });
    }

    if (trailingPunctuation) {
      segments.push({ type: "text", text: trailingPunctuation });
    }

    lastIndex = matchIndex + rawUrl.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", text: text.slice(lastIndex) });
  }

  return segments;
};

const hasSegments = (segments: TextSegment[]): segments is [TextSegment, ...TextSegment[]] =>
  segments.length > 0;

const splitTextIntoParagraphs = (text?: string): TextParagraph[] => {
  if (!text) return [];

  return text.split(/\r?\n/).map((paragraph) => {
    if (paragraph.trim().length === 0) {
      return { type: "spacer" };
    }

    const segments = splitTextByUrls(paragraph);
    if (!hasSegments(segments)) {
      return { type: "spacer" };
    }

    return {
      type: "content",
      segments,
      hangingIndent: paragraph.trimStart().startsWith("・"),
    };
  });
};

const sponsors = computed((): SponsorWithPlan[] => {
  if (!sponsorsData.value) return [];
  return Object.entries(sponsorsData.value)
    .filter(([plan]) => plan !== "OPTION" && plan !== "INDIVIDUAL")
    .flatMap(([plan, planSponsors]) =>
      (planSponsors as Sponsor[]).map((sponsor) => ({ ...sponsor, plan })),
    ) as SponsorWithPlan[];
});

const currentSponsor = computed((): SponsorWithPlan | undefined =>
  sponsors.value.find((sponsor) => sponsor.id === route.params.sponsorId),
);

useSeoMeta({
  title: () => `${currentSponsor.value?.name || t("sponsors.title")}`,
  ogTitle: () => `Vue Fes Japan 2026 - ${currentSponsor.value?.name || t("sponsors.title")}`,
});

defineOgImage({
  component: "OgSponsor",

  props: {
    name: () => currentSponsor.value?.name,
    logoImageUrl: () => currentSponsor.value?.logoImageUrl,
    plan: () => currentSponsor.value?.plan,
  },
});

const trackStyles = (tracks: Program["tracks"]) => {
  const track = tracks[0];
  if (!track) {
    return {
      "--base-color": "var(--color-primary-base)",
      "--sub-color": "var(--color-primary-sub)",
    };
  }

  const accentColorName = TIMETABLE_TRACKS[track]?.color ?? "primary";
  return {
    "--base-color": `var(--color-${accentColorName}-base)`,
    "--sub-color": `var(--color-${accentColorName}-sub)`,
  };
};

onMounted(async () => {
  if (!route.hash) return;
  const targetElement = document.getElementById(route.hash.substring(1));

  if (targetElement === null) return;
  await nextTick();
  requestAnimationFrame(() => targetElement.scrollIntoView());
});
</script>

<template>
  <div v-if="currentSponsor" id="pages-sponsor-detail">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Sponsor</h1>

    <VFSection :title="t('sponsors.details')">
      <div class="sponsor-images">
        <div class="image">
          <NuxtLink :to="currentSponsor.linkUrl.trim()" external target="_blank">
            <img :src="currentSponsor.logoImageUrl" :alt="currentSponsor.logoImageAlt" />
          </NuxtLink>
        </div>
        <NuxtLink
          :to="currentSponsor.linkUrl.trim()"
          external
          target="_blank"
          style="text-decoration: none"
        >
          <h2 class="name">
            {{ currentSponsor.name }}
          </h2>
        </NuxtLink>
      </div>
      <ul class="sponsor-tags">
        <li v-if="currentSponsor.plan !== 'OPTION_ONLY'">
          <SponsorTag :plan="currentSponsor.plan" />
        </li>
        <li v-for="option in currentSponsor.option" :key="option">
          <SponsorTag :plan="option" />
        </li>
      </ul>
      <div class="sponsor-description">
        <template
          v-for="(paragraph, paragraphIndex) in splitTextIntoParagraphs(currentSponsor.description)"
          :key="paragraphIndex"
        >
          <span
            v-if="paragraph.type === 'spacer'"
            class="text-paragraph-spacer"
            aria-hidden="true"
          ></span>
          <p
            v-else-if="paragraph.type === 'content'"
            class="text-paragraph"
            :class="{ 'text-paragraph-hanging-indent': paragraph.hangingIndent }"
          >
            <span v-for="(segment, segmentIndex) in paragraph.segments" :key="segmentIndex">
              <a
                v-if="segment.type === 'link'"
                :href="segment.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ segment.text }}
              </a>
              <template v-else>{{ segment.text }}</template>
            </span>
          </p>
        </template>
      </div>

      <div v-if="currentSponsor.program?.length" class="sponsor-session">
        <hr />

        <div
          v-for="program in currentSponsor.program"
          :key="program.id"
          class="sponsor-speaker-item"
        >
          <div
            v-if="program.tracks.length"
            class="session-track"
            :style="trackStyles(program.tracks)"
          >
            <div class="speaker-track">
              <template v-for="(track, index) in program.tracks" :key="track">
                <template v-if="index > 0"> / </template>
                {{ t(`timetable.track.${track}`) }}
              </template>
            </div>
            <div v-if="program.start && program.end" class="speaker-time">
              {{ program.start }} - {{ program.end }}
            </div>
          </div>

          <div class="session-detail">
            <h4 :id="program.id" class="sponsor-speaker-title">
              {{ program.title }}
            </h4>
            <div v-if="program.overview" class="sponsor-speaker-overview">
              <template
                v-for="(paragraph, paragraphIndex) in splitTextIntoParagraphs(program.overview)"
                :key="paragraphIndex"
              >
                <span
                  v-if="paragraph.type === 'spacer'"
                  class="text-paragraph-spacer"
                  aria-hidden="true"
                ></span>
                <p
                  v-else-if="paragraph.type === 'content'"
                  class="text-paragraph"
                  :class="{ 'text-paragraph-hanging-indent': paragraph.hangingIndent }"
                >
                  <span v-for="(segment, segmentIndex) in paragraph.segments" :key="segmentIndex">
                    <a
                      v-if="segment.type === 'link'"
                      :href="segment.href"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ segment.text }}
                    </a>
                    <template v-else>{{ segment.text }}</template>
                  </span>
                </p>
              </template>
            </div>
          </div>

          <div class="session-speakers">
            <div v-for="speaker in program.speakers" :key="speaker.id" class="session-speaker">
              <div class="session-speaker-image">
                <img :src="speaker.avatarUrl" :alt="speaker.name" loading="lazy" />
              </div>

              <div class="speaker">
                <p class="speaker-affiliation">
                  {{ speaker.affiliation }}<br v-if="speaker.affiliation && speaker.title" />
                  {{ speaker.title }}
                </p>

                <div class="speaker-name">
                  {{ speaker.name }}
                </div>

                <div class="speaker-socials">
                  <NuxtLink
                    v-if="speaker.socialUrls?.github"
                    :to="speaker.socialUrls.github"
                    external
                    target="_blank"
                  >
                    <GithubIcon :aria-label="t('snsIconImageAlt.github')" role="img" />
                  </NuxtLink>

                  <NuxtLink
                    v-if="speaker.socialUrls?.x"
                    :to="speaker.socialUrls.x"
                    external
                    target="_blank"
                  >
                    <XIcon :aria-label="t('snsIconImageAlt.x')" role="img" />
                  </NuxtLink>

                  <NuxtLink
                    v-if="speaker.socialUrls?.bluesky"
                    :to="speaker.socialUrls.bluesky"
                    external
                    target="_blank"
                  >
                    <BlueskyIcon :aria-label="t('snsIconImageAlt.bluesky')" role="img" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="view-all-sponsors">
        <VFButton outlined :link="localeRoute({ name: 'sponsors' })">
          {{ t("back") }}
        </VFButton>
      </div>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-sponsor-detail {
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

  hr {
    margin: 0;
    border: solid 1px var(--color-divider);
  }
}

.sponsor-images {
  display: grid;
  width: fit-content;
  max-width: 400px;
  margin: 0 auto;

  img {
    aspect-ratio: 399.983 / 224.792;
  }

  .name {
    margin-top: 1rem;
  }
}

.sponsor-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (--mobile) {
    margin-top: 1.5rem;
  }
}
.sponsor-description {
  margin: 2rem 0;

  @media (--mobile) {
    margin: 1.5rem 0;
  }
}

/* sponsor session */

.sponsor-session {
  display: grid;
  gap: 2rem 0;
  margin-top: 2rem;
}

.sponsor-speaker-item {
  display: grid;
  gap: 1rem;
  @media (--mobile) {
    gap: 1.5rem;
  }
}

.sponsor-speaker-overview {
  margin-bottom: 2.5rem;

  @media (--mobile) {
    margin-bottom: 2.25rem;
  }
}

.sponsor-description,
.sponsor-speaker-overview {
  a {
    color: var(--color-primary-base);
    overflow-wrap: anywhere;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

.text-paragraph {
  margin: 0;

  & + & {
    margin-top: 8px;
  }
}

.text-paragraph-spacer {
  display: block;
  height: 1.25em;
  margin-top: 0;

  @media (--mobile) {
    height: 1rem;
  }
}

.text-paragraph + .text-paragraph-spacer {
  margin-top: 0;
}

.text-paragraph-hanging-indent {
  padding-left: 1em;
  text-indent: -1em;
}

.session-detail {
  h4 {
    margin: 0 0 1.5rem;
    font-size: var(--typography-h2-size);
    line-height: var(--typography-h2-line-height);
    font-family: IBMPlexSansJP-Bold;
    scroll-margin-top: 102px;
    @media (--mobile) {
      margin-bottom: 0.5rem;
      scroll-margin-top: 74px;
    }
  }
}

.session-speakers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 2rem;
}

.session-speaker {
  display: grid;
  grid-template-columns: minmax(8rem, 11.25rem) 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (--mobile) {
    grid-template-columns: repeat(2, calc(50% - 0.75rem));
  }
}

.session-speaker-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
  }
}

.speaker-affiliation {
  margin: 0;
  font-size: var(--typography-caption-size);
  line-height: var(--typography-caption-line-height);
}
.speaker-name {
  margin-top: 4px;
  font-size: var(--typography-h2-size);
  line-height: var(--typography-h2-line-height);
}

.speaker-socials {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-text-default);
    transition: transform 0.2s;

    @media (any-hover: hover) {
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.view-all-sponsors {
  display: grid;
  place-items: center;
  margin-top: 2rem;
  @media (--mobile) {
    margin-bottom: 1.5rem;
  }
}

.session-track {
  width: fit-content;
}

.speaker-track {
  display: grid;
  place-items: center;
  width: fit-content;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  background-color: var(--base-color);
  color: var(--sub-color);
  @media (--mobile) {
    height: 29px;
    font-size: 14px;
  }
}
.speaker-time {
  display: grid;
  place-items: center;
  width: fit-content;
  height: 28px;
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 0 16px;
  font-family: JetBrainsMono-Medium;
  font-size: 14px;
  border: 1px solid var(--base-color);
  border-radius: 100px;
  background-color: #fff;
  color: var(--base-color);
  @media (--mobile) {
    height: 25px;
    margin-bottom: 0;
    font-size: 12px;
  }
}
</style>
