<script setup lang="ts">
import { computed, useRuntimeConfig } from "#imports";
import { resolveOgImageUrl } from "./utils";
import {
  createMyTimetableSelectionIndex,
  decodeMyTimetableQuerySelection,
} from "~/utils/myTimetable";
import { useTranslation } from "~~/server/i18n/useTranslation";
import { createTimetable } from "~~/server/utils/createTimetable";
import type {
  TimetableItem,
  TimetableProgram,
  TimetableTrack,
} from "~~/server/static-data/types/timetable";

const props = defineProps<{
  selection: string;
  locale: "ja" | "en";
}>();

const GRID_WIDTH = 1136;
const GRID_HEIGHT = 482;
const TRACK_COLORS: Record<TimetableTrack, { base: string; sub: string }> = {
  track1: { base: "#007f62", sub: "#fae8e4" },
  track2: { base: "#8314d3", sub: "#d0edf2" },
  track3: { base: "#f66c21", sub: "#def7d1" },
  track4: { base: "#385fcc", sub: "#ffdaff" },
};

const runtimeConfig = useRuntimeConfig();
const t = useTranslation(props.locale);
const logoImageUrl = computed(() =>
  resolveOgImageUrl(runtimeConfig.siteUrl, "images/logo/logo.svg"),
);
const noiseImageUrl = computed(() =>
  resolveOgImageUrl(runtimeConfig.siteUrl, "images/og/noise.png"),
);
const timetable = computed(() => createTimetable(props.locale));
const selectionIdSet = computed(() => {
  const selectionIndex = createMyTimetableSelectionIndex(timetable.value.items);
  const selectionIds = decodeMyTimetableQuerySelection(selectionIndex, props.selection) ?? [];

  return new Set(selectionIds);
});
const entries = computed(() =>
  timetable.value.items.flatMap((item) =>
    item.programs
      .filter((program) => selectionIdSet.value.has(program.id))
      .map((program) => createEntry(item, program)),
  ),
);
const layout = computed(() => {
  const columnCount = Math.min(5, Math.max(2, Math.ceil(entries.value.length / 7)));
  const rowCount = Math.max(1, Math.ceil(entries.value.length / columnCount));
  const gap = entries.value.length <= 10 ? 8 : entries.value.length <= 24 ? 6 : 4;
  const cardWidth = Math.floor((GRID_WIDTH - gap * Math.max(0, columnCount - 1)) / columnCount);
  const cardHeight = Math.min(
    82,
    Math.floor((GRID_HEIGHT - gap * Math.max(0, rowCount - 1)) / rowCount),
  );

  return {
    gap,
    cardWidth,
    cardHeight,
    isCompact: cardHeight < 70,
    isDense: cardHeight < 58,
  };
});
const title = computed(() => (props.locale === "ja" ? "マイタイムテーブル" : "Personal Schedule"));
const countLabel = computed(() =>
  props.locale === "ja"
    ? `${entries.value.length}件のセッション`
    : `${entries.value.length} ${entries.value.length === 1 ? "session" : "sessions"}`,
);

function createEntry(item: TimetableItem, program: TimetableProgram) {
  const trackLabel = item.tracks.map((itemTrack) => t(`timetable.track.${itemTrack}`)).join(" / ");
  const title = program.title || item.heading || (props.locale === "ja" ? "タイトル未定" : "TBD");
  const speakerNames = [...(program.speakers ?? []), ...(program.facilitators ?? [])]
    .map((speaker) => speaker.name)
    .join(" / ");

  return {
    id: program.id,
    start: item.start,
    end: item.end,
    trackLabel,
    title,
    speakerNames,
    colors: TRACK_COLORS[item.tracks[0] ?? "track1"],
  };
}

function formatTitle(value: string): string {
  const maxLength = layout.value.isDense
    ? props.locale === "ja"
      ? 32
      : 52
    : layout.value.isCompact
      ? props.locale === "ja"
        ? 32
        : 48
      : props.locale === "ja"
        ? 40
        : 64;

  return truncate(value, maxLength);
}

function formatSpeakerNames(value: string): string {
  const maxLength = layout.value.isDense
    ? props.locale === "ja"
      ? 18
      : 26
    : props.locale === "ja"
      ? 30
      : 42;

  return truncate(value, maxLength);
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
</script>

<template>
  <div
    :style="{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '28px 32px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: '#007f62',
      backgroundColor: '#fae8e4',
      fontFamily: 'OgIBMPlexSansJP-Regular, OgJetBrainsMono-Regular',
    }"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
        marginBottom: '12px',
      }"
    >
      <div :style="{ display: 'flex', flexDirection: 'column' }">
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2px',
            fontSize: '20px',
            fontFamily: 'OgIBMPlexSansJP-SemiBold, OgJetBrainsMono-Regular',
            lineHeight: 1,
          }"
        >
          {{ title }}
        </div>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            fontSize: '44px',
            fontFamily: 'OgClashDisplay-Medium, OgIBMPlexSansJP-SemiBold',
            lineHeight: 1,
          }"
        >
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          My Timetable
        </div>
      </div>

      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '390px',
          height: '78px',
          flexShrink: 0,
        }"
      >
        <img :src="logoImageUrl" alt="" width="232" height="43" />
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            width: '100%',
          }"
        >
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              height: '25px',
              padding: '0 11px',
              flexShrink: 0,
              border: '1px solid #007f62',
              borderRadius: '999px',
              backgroundColor: '#fff',
              fontSize: '12px',
              fontFamily: 'OgJetBrainsMono-Regular, OgIBMPlexSansJP-Regular',
              whiteSpace: 'nowrap',
            }"
          >
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            2026.10.24 SAT
          </div>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              height: '25px',
              padding: '0 11px',
              flexShrink: 0,
              borderRadius: '999px',
              color: '#fae8e4',
              backgroundColor: '#007f62',
              fontSize: '12px',
              fontFamily: 'OgIBMPlexSansJP-SemiBold, OgJetBrainsMono-Regular',
              whiteSpace: 'nowrap',
            }"
          >
            {{ countLabel }}
          </div>
        </div>
      </div>
    </div>

    <div
      :style="{
        display: 'flex',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: `${layout.gap}px`,
        width: `${GRID_WIDTH}px`,
        height: `${GRID_HEIGHT}px`,
      }"
    >
      <div
        v-for="entry in entries"
        :key="entry.id"
        :style="{
          display: 'flex',
          width: `${layout.cardWidth}px`,
          height: `${layout.cardHeight}px`,
          flexShrink: 0,
          overflow: 'hidden',
          border: `1px solid ${entry.colors.base}`,
          borderRadius: layout.isDense ? '6px' : '9px',
          color: entry.colors.base,
          backgroundColor: entry.colors.sub,
          boxSizing: 'border-box',
        }"
      >
        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: layout.isDense ? 'flex-start' : 'center',
            minWidth: 0,
            flex: 1,
            padding: layout.isDense ? '3px 6px 4px' : layout.isCompact ? '5px 8px' : '8px 12px 9px',
            boxSizing: 'border-box',
          }"
        >
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '5px',
              width: '100%',
              marginBottom: layout.isDense ? '2px' : '3px',
              fontSize: layout.isDense ? '8px' : layout.isCompact ? '10px' : '12px',
              fontFamily: 'OgJetBrainsMono-Regular, OgIBMPlexSansJP-Regular',
              lineHeight: 1,
            }"
          >
            <div :style="{ display: 'flex', flexShrink: 0 }">
              {{ entry.start }} - {{ entry.end }}
            </div>
            <div :style="{ display: 'flex', flexShrink: 0 }">
              {{ entry.trackLabel }}
            </div>
          </div>
          <div
            :style="{
              display: 'flex',
              width: '100%',
              overflow: 'hidden',
              fontSize: layout.isDense ? '11px' : layout.isCompact ? '14px' : '18px',
              fontFamily: 'OgIBMPlexSansJP-SemiBold, OgJetBrainsMono-Regular',
              lineHeight: 1.05,
              maxHeight: layout.isDense ? '24px' : undefined,
              whiteSpace: layout.isDense ? 'normal' : 'nowrap',
            }"
          >
            {{ formatTitle(entry.title) }}
          </div>
          <div
            v-if="entry.speakerNames"
            :style="{
              display: 'flex',
              width: '100%',
              marginTop: '2px',
              overflow: 'hidden',
              color: '#3c576f',
              fontSize: layout.isDense ? '8px' : layout.isCompact ? '10px' : '12px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }"
          >
            {{ formatSpeakerNames(entry.speakerNames) }}
          </div>
        </div>
      </div>
    </div>

    <img
      :src="noiseImageUrl"
      alt=""
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.075,
        pointerEvents: 'none',
      }"
    />
  </div>
</template>
