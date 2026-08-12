<script setup lang="ts">
import { useLocaleRoute, useRoute } from "@typed-router";
import XIcon from "~icons/icons/ic_x";
import GithubIcon from "~icons/icons/ic_github";
import BlueskyIcon from "~icons/icons/ic_bluesky";
import { TIMETABLE_TRACKS } from "~~/server/static-data/timetable";
import type { Program } from "~~/server/static-data/types/program";
import {
  computed,
  defineOgImage,
  definePageMeta,
  useI18n,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  usePageSeoMeta,
  useRouter,
  useFetch,
} from "#imports";
import { VFSection } from "#components";

definePageMeta({ prerender: true });

const route = useRoute("speaker-speakerId");
const router = useRouter();
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();

const { data: speakersData } = await useFetch("/api/speakers", {
  query: { locale },
});

const currentSpeaker = computed(() =>
  speakersData.value?.speakers.find((speaker) => speaker.id === route.params.speakerId),
);

const currentPrograms = computed(
  () =>
    speakersData.value?.programs.filter(
      (program) =>
        program.type !== "panelDiscussion" &&
        program.type !== "event" &&
        program.speakers.some((speaker) => speaker.id === route.params.speakerId),
    ) ?? [],
);

const pageDescription = computed(
  () =>
    currentPrograms.value.find((program) => program.title)?.title ||
    currentSpeaker.value?.bio ||
    t("speakers.description"),
);

const splitLines = (text?: string) => (text ? text.split("\n") : []);

usePageSeoMeta({
  title: () => currentSpeaker.value?.name || t("speakers.title"),
  description: () => pageDescription.value,
});

defineOgImage("OgSpeaker", {
  name: () => currentSpeaker.value?.name ?? "",
  avatarUrl: () => currentSpeaker.value?.avatarUrl ?? "",
  speakerTitle: () => currentSpeaker.value?.title,
  affiliation: () => currentSpeaker.value?.affiliation,
  color: () => currentSpeaker.value?.color || "default",
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(localeRoute({ name: "speaker" }));
  }
};

const trackStyles = (tracks: Program["tracks"]) => {
  const track = tracks[0];
  const accentColorName = track ? (TIMETABLE_TRACKS[track]?.color ?? "primary") : "primary";
  return {
    "--base-color": `var(--color-${accentColorName}-base)`,
    "--sub-color": `var(--color-${accentColorName}-sub)`,
  };
};
</script>

<template>
  <div v-if="currentSpeaker" id="pages-speaker-detail">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Speaker</h1>

    <VFSection>
      <div
        v-for="program in currentPrograms.filter(
          (program) => program.tracks.length > 0 || (program.start && program.end),
        )"
        :key="program.id"
        class="speaker-program-schedule"
        :style="trackStyles(program.tracks)"
      >
        <div v-if="program.tracks.length" class="speaker-track">
          <template v-for="(track, index) in program.tracks" :key="track">
            <template v-if="index > 0"> / </template>
            {{ t(`timetable.track.${track}`) }}
          </template>
        </div>
        <div v-if="program.start && program.end" class="speaker-time">
          {{ program.start }} - {{ program.end }}
        </div>
      </div>

      <div class="speaker-information">
        <div class="speaker-avatar">
          <img :src="currentSpeaker.avatarUrl" :alt="currentSpeaker.name" />
        </div>
        <div class="speaker-details">
          <div v-for="program in currentPrograms" :key="program.id" class="speaker-program">
            <h3 v-if="program.title" class="session-title">
              {{ program.title }}
            </h3>

            <div v-if="program.overview" class="session-overview">
              <template v-for="(paragraph, idx) in splitLines(program.overview)" :key="idx">
                <template v-if="paragraph">
                  <p
                    :style="
                      paragraph.startsWith('・') ? 'text-indent: -1em; padding-left: 1em;' : ''
                    "
                  >
                    {{ paragraph }}
                  </p>
                </template>
                <template v-else>
                  <span class="session-overview-spacer"></span>
                </template>
              </template>
            </div>
          </div>

          <h2 class="speaker-name">
            {{ currentSpeaker.name }}
          </h2>

          <div class="speaker-meta">
            <p v-if="currentSpeaker.affiliation" class="speaker-affiliation">
              {{ currentSpeaker.affiliation }}
            </p>
            <p v-if="currentSpeaker.title" class="speaker-title">
              {{ currentSpeaker.title }}
            </p>
          </div>

          <div v-if="currentSpeaker.bio" class="speaker-bio">
            <div class="speaker-bio-body">
              <template v-for="(paragraph, idx) in splitLines(currentSpeaker.bio)" :key="idx">
                <p v-if="paragraph">
                  {{ paragraph }}
                </p>
                <span v-else class="speaker-bio-spacer"></span>
              </template>
            </div>
          </div>

          <div v-if="currentSpeaker.socialUrls" class="speaker-social">
            <a
              v-if="currentSpeaker.socialUrls.github"
              :href="currentSpeaker.socialUrls.github"
              target="_blank"
              aria-label="GitHub"
            >
              <GithubIcon width="1.5rem" height="1.5rem" />
            </a>
            <a
              v-if="currentSpeaker.socialUrls.x"
              :href="currentSpeaker.socialUrls.x"
              target="_blank"
              aria-label="X (Twitter)"
            >
              <XIcon width="1.5rem" height="1.5rem" />
            </a>
            <a
              v-if="currentSpeaker.socialUrls.bluesky"
              :href="currentSpeaker.socialUrls.bluesky"
              target="_blank"
              aria-label="Bluesky"
            >
              <BlueskyIcon width="1.5rem" height="1.5rem" />
            </a>
          </div>
        </div>

        <!-- Mobile layout -->
        <div class="speaker-meta-mobile">
          <h2 class="speaker-name">
            {{ currentSpeaker.name }}
          </h2>

          <p v-if="currentSpeaker.affiliation" class="speaker-affiliation">
            {{ currentSpeaker.affiliation }}
          </p>
          <p v-if="currentSpeaker.title" class="speaker-title">
            {{ currentSpeaker.title }}
          </p>
        </div>

        <div v-if="currentSpeaker.bio" class="speaker-bio-mobile">
          <div class="speaker-bio-body">
            <template v-for="(paragraph, idx) in splitLines(currentSpeaker.bio)" :key="idx">
              <p v-if="paragraph">
                {{ paragraph }}
              </p>
              <span v-else class="speaker-bio-spacer"></span>
            </template>
          </div>
        </div>

        <div v-if="currentSpeaker.socialUrls" class="speaker-social-mobile">
          <a
            v-if="currentSpeaker.socialUrls.github"
            :href="currentSpeaker.socialUrls.github"
            target="_blank"
            aria-label="GitHub"
          >
            <GithubIcon width="1.5rem" height="1.5rem" />
          </a>
          <a
            v-if="currentSpeaker.socialUrls.x"
            :href="currentSpeaker.socialUrls.x"
            target="_blank"
            aria-label="X (Twitter)"
          >
            <XIcon width="1.5rem" height="1.5rem" />
          </a>
          <a
            v-if="currentSpeaker.socialUrls.bluesky"
            :href="currentSpeaker.socialUrls.bluesky"
            target="_blank"
            aria-label="Bluesky"
          >
            <BlueskyIcon width="1.5rem" height="1.5rem" />
          </a>
        </div>

        <div v-for="program in currentPrograms" :key="program.id" class="speaker-program-mobile">
          <h3 v-if="program.title" class="session-title-mobile">
            {{ program.title }}
          </h3>

          <div v-if="program.overview" class="session-overview-mobile">
            <template v-for="(paragraph, idx) in splitLines(program.overview)" :key="idx">
              <template v-if="paragraph">
                <p
                  :style="paragraph.startsWith('・') ? 'text-indent: -1em; padding-left: 1em;' : ''"
                >
                  {{ paragraph }}
                </p>
              </template>
              <template v-else>
                <span class="session-overview-spacer"></span>
              </template>
            </template>
          </div>
        </div>
      </div>

      <div class="back-to-speakers">
        <VFButton outlined @click="goBack">
          {{ t("back") }}
        </VFButton>
      </div>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-speaker-detail {
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

  .back-to-speakers {
    display: grid;
    place-items: center;
    margin-top: 2rem;

    @media (--mobile) {
      margin-top: 1.5rem;
    }
  }
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
  margin-bottom: 32px;
  padding: 0 16px;
  font-family: JetBrainsMono-Medium;
  font-size: 14px;
  border: 1px solid var(--base-color);
  border-radius: 100px;
  background-color: #fff;
  color: var(--base-color);
  @media (--mobile) {
    height: 25px;
    margin-bottom: 24px;
    font-size: 12px;
  }
}

.speaker-program-schedule + .speaker-program-schedule,
.speaker-program + .speaker-program {
  margin-top: 2rem;
}

.speaker-information {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 2rem;

  @media (--mobile) {
    grid-template-columns: auto 1fr;
    column-gap: 1.5rem;
  }

  .speaker-avatar {
    width: 11.25rem;
    height: 11.25rem;

    @media (--mobile) {
      width: 9.75rem;
      height: 9.75rem;
    }

    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 0.625rem;
      object-fit: cover;
      border: 0.0625rem solid var(--color-divider-light);
    }
  }

  .speaker-details {
    @media (--mobile) {
      display: none;
    }

    h3.session-title {
      font-size: 1.125rem;
      line-height: 1.5;
      margin: 0 0 2rem 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: normal;
      line-break: strict;
    }

    .session-overview {
      margin-bottom: 2.5rem;
      white-space: pre-wrap;
    }

    .speaker-meta {
      display: grid;
      row-gap: 0.125rem;

      .speaker-title,
      .speaker-affiliation {
        font-size: 0.6875rem;
        line-height: 1.0313rem;
        margin: 0;
      }
    }

    h2.speaker-name {
      margin: 0 0 0.25rem;
      font-size: 1.125rem;
      line-height: 1.6875rem;
    }

    .speaker-social {
      display: flex;
      gap: 0.25rem;
      margin-top: 1.5rem;
      a {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
      }
    }

    .speaker-bio {
      margin-top: 2.5rem;

      .speaker-bio-body {
        display: grid;
        row-gap: 1rem;

        p {
          margin: 0;
          line-height: 1.7;
        }
      }
    }
  }

  .speaker-meta-mobile {
    display: none;

    @media (--mobile) {
      display: grid;
      align-content: start;
      padding-top: 0.25rem;
    }

    .speaker-title,
    .speaker-affiliation {
      font-size: 0.625rem;
      line-height: 0.9375rem;
      margin: 0;
    }

    .speaker-name {
      margin: 0 0 0.25rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  .session-title-mobile {
    display: none;
    font-size: 1rem;
    line-height: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: normal;
    line-break: strict;

    @media (--mobile) {
      display: block;
      grid-column: 1 / -1;
    }
  }

  .speaker-program-mobile {
    display: none;

    @media (--mobile) {
      display: block;
      grid-column: 1 / -1;
    }
  }

  .speaker-bio-mobile {
    display: none;

    @media (--mobile) {
      display: block;
      grid-column: 1 / -1;
      margin-top: 1.5rem;
    }

    .speaker-bio-body {
      display: grid;
      row-gap: 1rem;

      p {
        margin: 0;
        line-height: 1.7;
      }
    }
  }

  .speaker-social-mobile {
    display: none;

    @media (--mobile) {
      display: flex;
      grid-column: 1 / -1;
      gap: 0.25rem;
      margin-top: 1rem;
    }

    a {
      width: 1.5rem;
      height: 1.5rem;
      display: inline-flex;
    }
  }

  .session-overview-mobile {
    display: none;
    margin-bottom: 1rem;
    white-space: pre-wrap;

    @media (--mobile) {
      display: block;
      grid-column: 1 / -1;
      margin-bottom: 0;
    }
  }

  .session-overview-spacer {
    display: block;
    height: 1.25em;
  }

  .speaker-bio-spacer {
    display: block;
    height: 0.25rem;
  }
}
</style>
