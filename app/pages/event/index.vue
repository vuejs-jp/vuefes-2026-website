<script setup lang="ts">
import { useRoute } from "@typed-router";

import EventSpeakerCard from "./_components/EventSpeakerCard.vue";

import {
  JaPanelDiscussionEvent,
  EnPanelDiscussionEvent,
  JaVueQuiz,
  EnVueQuiz,
  JaHandsOnEvent,
  EnHandsOnEvent,
  VFSection,
  JaStudentSupportEvent,
  EnStudentSupportEvent,
} from "#components";

import {
  computed,
  defineRouteRules,
  useI18n,
  useRuntimeConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useSeoMeta,
  useQueryHashSync,
  useFetch,
  useWithBase,
} from "#imports";

// To differentiate OGP based on query params
defineRouteRules({ prerender: false });

const withBase = useWithBase();

const SectionId = {
  PanelDiscussion: "panel-discussion",
  VueQuiz: "vue-quiz",
  HandsOn: "hands-on",
  StudentSupportContents: "student-support-contents",
  CreativeWall: "creative-wall",
  SponsorStickerRally: "sponsor-sticker-rally",
  FreeDrinks: "free-drinks",
  Festival: "festival",
  // TattooSpace: "tattoo-space",
} as const;

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();

const { data: speakersData } = await useFetch("/api/speakers", {
  query: { locale },
});

const panelSpeakers = computed(
  () =>
    speakersData.value?.programs.find((program) => program.id === "panel-discussion")?.speakers ??
    [],
);
const studentSupportSpeakers = computed(
  () =>
    speakersData.value?.programs.find((program) => program.id === "student-support-contents")
      ?.speakers ?? [],
);

const getProgramMeta = (programIds: string[]) => {
  const programs =
    speakersData.value?.programs.filter((program) => programIds.includes(program.id)) ?? [];
  const tracks = [...new Set(programs.flatMap((program) => program.tracks))];
  const times = [...new Set(programs.map((program) => `${program.start} - ${program.end}`))];

  return {
    location: tracks.map((track) => t(`timetable.track.${track}`)).join(" / "),
    time: times.join(" / "),
  };
};

const panelDiscussionMeta = computed(() =>
  getProgramMeta(["panel-discussion-1", "panel-discussion-2"]),
);
const handsOnMeta = computed(() => getProgramMeta(["hands-on"]));
const studentSupportMeta = computed(() => getProgramMeta(["student-support-contents"]));

const handsOnImageList = [
  { src: withBase("/images/event/hands-on_1.jpg"), alt: t("event.handsOn.image.alt1") },
  { src: withBase("/images/event/hands-on_2.jpg"), alt: t("event.handsOn.image.alt2") },
  { src: withBase("/images/event/hands-on_3.jpg"), alt: t("event.handsOn.image.alt3") },
  { src: withBase("/images/event/hands-on_4.jpg"), alt: t("event.handsOn.image.alt4") },
];

const route = useRoute();

useQueryHashSync({ queryKey: "section" });

useSeoMeta({
  title:
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkTitle")
      : t("event.title"),
  ogImage: () =>
    route.query.section === SectionId.PanelDiscussion
      ? `${runtimeConfig.public.siteUrl}images/og/panel-discussion.png`
      : `${runtimeConfig.public.siteUrl}images/og/event.png`,
  ogTitle:
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkTitle")
      : t("event.title"),
  description:
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkDescription")
      : undefined,
  ogDescription:
    route.query.section === SectionId.PanelDiscussion
      ? t("event.panel.talkDescription")
      : undefined,
});
</script>

<template>
  <div id="pages-event">
    <h1>{{ $t("event.title") }}</h1>
    <!-- TODO: パネルディスカッションの内容が確定したら、末尾のセクションをここへ移動する -->

    <VFSection :id="SectionId.HandsOn" :title="t('event.handsOn.title')" class="vf-section">
      <component :is="locale === 'ja' ? JaHandsOnEvent : EnHandsOnEvent">
        <template #images>
          <div class="image-list">
            <img
              v-for="(item, index) in handsOnImageList"
              :key="index"
              :src="item.src"
              :alt="item.alt"
              loading="lazy"
            />
          </div>
        </template>
      </component>
      <div class="meta">
        <span class="location">{{ handsOnMeta.location }}</span>
        <span class="time">{{ handsOnMeta.time }}</span>
      </div>
    </VFSection>

    <VFSection
      :id="SectionId.StudentSupportContents"
      :title="t('event.studentSupport.title')"
      class="vf-section student-support-event"
    >
      <component :is="locale === 'ja' ? JaStudentSupportEvent : EnStudentSupportEvent">
        <template #speaker>
          <ul class="speaker-list">
            <EventSpeakerCard
              v-for="speaker in studentSupportSpeakers"
              :key="speaker.name"
              :speaker="speaker"
            />
          </ul>
        </template>
      </component>
      <div class="meta">
        <span class="location">{{ studentSupportMeta.location }}</span>
        <span class="time">{{ studentSupportMeta.time }}</span>
      </div>
    </VFSection>

    <VFSection
      :id="SectionId.SponsorStickerRally"
      :title="t('event.sponsorBooth.title')"
      class="vf-section"
    >
      <div class="meta">
        <span class="location"> {{ t("event.sponsorBooth.location") }}</span>
      </div>
      <div class="media-block">
        <img
          src="/images/event/sponsor-booth.jpg"
          :alt="t('event.sponsorBooth.alt')"
          loading="lazy"
        />
        <p>{{ t("event.sponsorBooth.description") }}</p>
      </div>
    </VFSection>

    <VFSection :id="SectionId.FreeDrinks" :title="t('event.freeDrink.title')" class="vf-section">
      <div class="meta">
        <span class="location"> {{ t("event.freeDrink.location") }}</span>
      </div>
      <div class="media-block">
        <img src="/images/event/free-drink.jpg" :alt="t('event.freeDrink.alt')" loading="lazy" />
        <p>{{ t("event.freeDrink.description") }}</p>
      </div>
    </VFSection>

    <VFSection
      :id="SectionId.PanelDiscussion"
      :title="t('event.panel.title')"
      class="vf-section discussion-event"
    >
      <component :is="locale === 'ja' ? JaPanelDiscussionEvent : EnPanelDiscussionEvent">
        <template #speaker>
          <ul class="speaker-list">
            <EventSpeakerCard
              v-for="speaker in panelSpeakers"
              :key="speaker.name"
              :speaker="speaker"
            />
          </ul>
        </template>
      </component>
      <div class="meta">
        <span class="location">{{ panelDiscussionMeta.location }}</span>
        <span class="time">{{ panelDiscussionMeta.time }}</span>
      </div>
    </VFSection>

    <!--
      <VFSection :id="SectionId.TattooSpace" :title="t('event.tattoo.title')" class="vf-section">
        <div class="meta">
          <span class="location"> {{ t("event.tattoo.location") }}</span>
        </div>
        <div class="media-block">
          <img src="/images/event/tattoo-space.jpg" :alt="t('event.tattoo.alt')" loading="lazy" />
          <p>{{ t("event.tattoo.description") }}</p>
        </div>
      </VFSection>
    -->
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-event {
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

  :deep([data-vf-mdc] ul:not([class])),
  :deep([data-vf-mdc] ol:not([class])) {
    padding-inline-start: 1.5rem;
  }

  :deep([data-vf-mdc] ul:not([class])) {
    list-style-type: disc;
  }

  :deep([data-vf-mdc] ol:not([class])) {
    list-style-type: decimal;
  }

  .meta {
    position: absolute;
    top: 2.5rem;
    right: 3.5rem;
    display: flex;
    column-gap: 1rem;
    align-items: center;

    @media (--mobile) {
      position: static;
      order: -1;
      row-gap: 0.5rem;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-divider);
      margin-bottom: 1.5rem;
    }
  }

  .location {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: var(--color-sub);
    background-color: var(--color-base);
    font-size: 1rem;
    font-weight: bold;

    @media (--mobile) {
      font-size: 0.875rem;
    }
  }

  .time {
    padding: 0.125rem 1rem;
    border-radius: 100vmax;
    color: var(--color-base);
    border: 1px solid var(--color-base);
    font-size: 0.875rem;
    font-family: JetBrainsMono-Regular;

    @media (--mobile) {
      font-size: 0.75rem;
    }
  }

  .speaker-list {
    --size: 180px;
    margin: 0;
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(var(--size), 1fr));
    row-gap: 32px;
    column-gap: 4.4%;

    @media (--mobile) {
      --size: 146px;
      row-gap: 16px;
      column-gap: 16px;
    }
  }

  .image-list {
    --size: 180px;
    margin-top: 32px;
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(var(--size), 1fr));
    row-gap: 10px;
    column-gap: 10px;

    @media (--mobile) {
      --size: 150px;
      margin-top: 24px;
    }
  }

  :deep(.divider),
  :deep(hr) {
    border: 0;
    border-top: 1px solid var(--color-divider);
    margin: 2rem 0;

    @media (--mobile) {
      margin: 1.5rem 0;
    }
  }

  .media-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;

    img {
      width: 100%;
      border-radius: 10px;
    }

    @media (--mobile) {
      grid-template-columns: 1fr;
      row-gap: 1.5rem;
    }
  }
}

.vf-section {
  position: relative;

  @media (--mobile) {
    &:has(.meta) :deep(.section-content > div:first-child > hr) {
      display: none;
    }

    :deep(.section-content-inner) {
      display: flex;
      flex-direction: column;
    }
  }
}

.discussion-event,
.student-support-event {
  :deep(h3) {
    font-size: 1.125rem;
    line-height: 1.5;
    margin-bottom: 1rem;

    @media (--mobile) {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      margin-top: 1.5rem;
    }
  }

  :deep(h4) {
    font-size: 1rem;
    font-family: JetBrainsMono-Bold;
    line-height: 1.5;
    margin-bottom: 0.5rem;

    @media (--mobile) {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
