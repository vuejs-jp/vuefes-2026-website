<script setup lang="ts">
import { useLocaleRoute } from "@typed-router";
import SpeakerCard from "./_components/SpeakerCard.vue";
import {
  VFSection,
  VFButton,
  JaSpeaker,
  EnSpeaker,
  JaPanelDiscussion,
  EnPanelDiscussion,
} from "#components";
import {
  computed,
  defineRouteRules,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useSeoMeta,
  useI18n,
  useRuntimeConfig,
  defineOgImage,
  useQueryHashSync,
  useRoute,
  useRouter,
  useFetch,
} from "#imports";

// To differentiate OGP based on query params
defineRouteRules({ prerender: false });

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();
const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(localeRoute({ name: "index" }));
  }
};

const { data: speakersData } = await useFetch("/api/speakers", {
  query: { locale },
});

const sessionSpeakers = computed(() => speakersData.value?.sessionSpeakers ?? []);
const ltSpeakers = computed(() => speakersData.value?.ltSpeakers ?? []);
const panelSpeakers = computed(() => speakersData.value?.panelDiscussionSpeakers ?? []);
const allSpeakers = computed(() => {
  return [...sessionSpeakers.value, ...ltSpeakers.value, ...panelSpeakers.value]
    .filter((speaker, index, speakers) => index === speakers.findIndex((s) => s.id === speaker.id))
    .sort(
      (a, b) =>
        (a.attendedIndex ?? Number.MAX_SAFE_INTEGER) - (b.attendedIndex ?? Number.MAX_SAFE_INTEGER),
    );
});

const SectionId = {
  Sessions: "sessions",
  LightningTalks: "lightning-talks",
  PanelDiscussion: "panel-discussion",
} as const;

const isSeparateSpeakingType = import.meta.vfFeatures.separateSpeakingType;

const route = useRoute();

useQueryHashSync({ queryKey: "section" });

defineOgImage({
  url:
    route.query.section === SectionId.PanelDiscussion
      ? `${runtimeConfig.public.siteUrl}images/og/panel-discussion.png`
      : `${runtimeConfig.public.siteUrl}images/og/speaker.png`,
});
useSeoMeta({
  title: () =>
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkTitle")
      : t("speakers.title"),
  ogTitle: () =>
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkTitle")
      : t("speakers.title"),
  description: () =>
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkDescription")
      : t("speakers.description"),
  ogDescription: () =>
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkDescription")
      : t("speakers.description"),
});
</script>

<template>
  <div id="pages-speakers">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Speaker</h1>

    <template v-if="!isSeparateSpeakingType">
      <VFSection :id="SectionId.Sessions" title="" wide>
        <component :is="locale === 'ja' ? JaSpeaker : EnSpeaker" class="description" />

        <ul class="speakers">
          <SpeakerCard
            v-for="speaker in allSpeakers"
            :key="speaker.id"
            :to="localeRoute({ name: 'speaker-speakerId', params: { speakerId: speaker.id } })"
            class="speaker-card-link"
            :speaker="speaker"
          />
        </ul>

        <div class="back-to-top">
          <VFButton outlined @click="goBack">
            {{ t("back") }}
          </VFButton>
        </div>
      </VFSection>
    </template>
    <template v-else>
      <VFSection :id="SectionId.Sessions" :title="t('speakers.sessions.title')" wide>
        <component :is="locale === 'ja' ? JaSpeaker : EnSpeaker" class="description" />

        <ul class="speakers">
          <SpeakerCard
            v-for="speaker in sessionSpeakers"
            :key="speaker.id"
            :to="localeRoute({ name: 'speaker-speakerId', params: { speakerId: speaker.id } })"
            class="speaker-card-link"
            :speaker="speaker"
          />
        </ul>
      </VFSection>

      <VFSection :id="SectionId.LightningTalks" :title="t('speakers.lightningTalks.title')" wide>
        <!-- <component :is="locale === 'ja' ? JaSpeaker : EnSpeaker" class="description" /> -->
        <ul class="speakers">
          <SpeakerCard
            v-for="speaker in ltSpeakers"
            :key="speaker.id"
            :speaker="speaker"
            :to="localeRoute({ name: 'speaker-speakerId', params: { speakerId: speaker.id } })"
          />
        </ul>
      </VFSection>

      <VFSection :id="SectionId.PanelDiscussion" :title="t('speakers.panel.title')" wide>
        <component
          :is="locale === 'ja' ? JaPanelDiscussion : EnPanelDiscussion"
          class="description"
        />

        <ul class="speakers">
          <SpeakerCard
            v-for="speaker in panelSpeakers"
            :key="speaker.id"
            :speaker="speaker"
            :to="localeRoute({ name: 'speaker-speakerId', params: { speakerId: speaker.id } })"
          />
        </ul>

        <div class="back-to-top">
          <VFButton outlined @click="goBack">
            {{ t("back") }}
          </VFButton>
        </div>
      </VFSection>
    </template>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-speakers {
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

  .back-to-top {
    display: grid;
    place-items: center;
    margin-top: 2rem;

    @media (--mobile) {
      margin-top: 1.5rem;
    }
  }

  .description {
    margin-bottom: 2rem;

    @media (--mobile) {
      margin-bottom: 1.5rem;
    }
  }

  .speakers {
    --size: 180px;
    margin: 0;

    @media (--mobile) {
      --size: 146px;
    }

    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(var(--size), 1fr));
    row-gap: 32px;
    column-gap: 4.4%;

    @media (--mobile) {
      row-gap: 24px;
      column-gap: 24px;
    }
  }
}
</style>
