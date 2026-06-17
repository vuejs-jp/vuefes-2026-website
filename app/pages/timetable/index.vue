<script setup lang="ts">
import TimetableHead from "./_components/TimetableHead.vue";
import TimetableCell from "./_components/TimetableCell.vue";
import TimetableCard from "./_components/TimetableCard.vue";
import { createDesktopTimetable, createMobileTimetable } from "./_utils/builders/";
import { useScrollPosition } from "~/composables/useScrollPosition";
import { VFSection } from "#components";
import {
  defineOgImage,
  defineRouteRules,
  useBreakpoint,
  useFetch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useI18n,
  useRuntimeConfig,
  useSeoMeta,
  useWithBase,
  computed,
} from "#imports";

defineRouteRules({ prerender: true });
const withBase = useWithBase();

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();
const bp = useBreakpoint();

const { data: timetableItems } = await useFetch("/api/timetable", {
  query: { locale: locale.value },
});

const isPc = computed(() => bp.value === "pc");
const desktopRows = computed(() => createDesktopTimetable(timetableItems.value ?? []));
const mobileGroups = computed(() => createMobileTimetable(timetableItems.value ?? []));

useScrollPosition("timetableScrollPosition");

defineOgImage({
  url: `${runtimeConfig.public.siteUrl}images/og/timetable.png`,
});

useSeoMeta({
  title: () => `Vue Fes Japan 2026 - ${t("timetable.title")}`,
  ogTitle: () => `Vue Fes Japan 2026 - ${t("timetable.title")}`,
  description: () => t("timetable.description"),
  ogDescription: () => t("timetable.description"),
});
</script>

<template>
  <div id="pages-timetable">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Timetable</h1>
    <VFSection :title="t('timetable.title')">
      <template v-if="timetableItems">
        <table v-if="isPc" class="timetable-content">
          <thead>
            <tr>
              <TimetableHead color="primary" :title="t('timetable.track.track1')" />
              <TimetableHead color="purple" :title="t('timetable.track.track2')" />
              <TimetableHead color="orange" :title="t('timetable.track.track3')" />
              <TimetableHead color="navy" :title="t('timetable.track.track4')" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in desktopRows" :key="row.id">
              <TimetableCell
                v-for="cell in row.cells"
                :key="cell.id"
                v-bind="cell"
                :class="`cell-${cell.type}`"
              />
            </tr>
          </tbody>
        </table>

        <div v-else class="timetable-mobile">
          <template v-for="group in mobileGroups" :key="group.id">
            <div class="row-time">
              {{ group.time }}
            </div>
            <TimetableCard v-for="card in group.cards" :key="card.id" v-bind="card" />
          </template>
        </div>
      </template>
    </VFSection>

    <VFSection :title="t('venueMap.title')" class="venue-map-section">
      <a
        :href="
          locale === 'ja'
            ? withBase('/images/venue-map/map_jp@2x.png')
            : withBase('/images/venue-map/map_en@2x.png')
        "
        target="_blank"
      >
        <span class="visually-hidden">{{ t("venueMap.openInNewTab") }}</span>
        <img
          :src="
            locale === 'ja'
              ? withBase('/images/venue-map/map_jp.png')
              : withBase('/images/venue-map/map_en.png')
          "
          :alt="t('venueMap.alt')"
          loading="lazy"
        />
      </a>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-timetable {
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

.timetable-content {
  width: 100%;
  border-spacing: 8px;
  table-layout: fixed;

  thead {
    position: sticky;
    top: 108px;
  }
}

.timetable-mobile {
  display: grid;
  gap: 8px 0;
}

.row-time {
  display: grid;
  place-items: center;
  height: 56px;
  border: solid 1px var(--color-divider);
  border-radius: 8px;
  background-color: #fff;
  font-size: 16px;
  font-family: JetBrainsMono-Medium;
}

.venue-map-section {
  img {
    width: 100%;
  }
  .visually-hidden {
    clip: rect(0 0 0 0);
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
  }
}
</style>
