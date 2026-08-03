<script setup lang="ts">
import { computed } from "vue";
import { useI18n, useLocalePath } from "#imports";
import type { TimetableCell } from "~~/server/static-data/types/timetable";
import TimetableSelectCheckbox from "./TimetableSelectCheckbox.vue";
import SliderIcon from "~icons/icons/timetable-slider";
import {
  useMyTimetableItemSelection,
  type MyTimetableSelectableProps,
} from "~/composables/useMyTimetableItemSelection";
import type { MyTimetableSelectionId } from "~/utils/myTimetable";
import { getTimetableCellLinkUrl } from "../_utils/links";

const {
  type,
  heading,
  headingUrl,
  startTime,
  endTime,
  color: selectedColor,
  programs,
  track,
  selectable = false,
  selectedMyTimetableIdSet,
} = defineProps<TimetableCell & MyTimetableSelectableProps>();

const emit = defineEmits<{
  toggleMyTimetableSelection: [ids: MyTimetableSelectionId[]];
}>();

const { t } = useI18n();
const localePath = useLocalePath();

const accentColorName = computed(() => {
  return selectedColor ?? "primary";
});

const backgroundColor = computed(() => `var(--color-${accentColorName.value}-sub)`);
const color = computed(() => `var(--color-${accentColorName.value}-base)`);
const hoverColor = computed(() => `var(--color-${accentColorName.value}-accent-hover)`);
const cellLinkUrl = computed(() => getTimetableCellLinkUrl({ headingUrl, programs }));
const displayHeading = computed(
  () =>
    heading ||
    (programs.length === 1 ? programs[0]?.title : undefined) ||
    (headingUrl || cellLinkUrl.value ? t("myTimetable.untitledProgram") : ""),
);
const cellLinkLabel = computed(
  () => programs[0]?.title || displayHeading.value || t("myTimetable.untitledProgram"),
);
const {
  programIds,
  canSelect,
  hasProgramChoices,
  areAllProgramsSelected,
  areSomeProgramsSelected,
  timeSlotAccessibleLabel,
  isProgramSelected,
  shouldShowProgramRow,
  getProgramDisplayTitle,
  getProgramAccessibleLabel,
} = useMyTimetableItemSelection({
  programs: () => programs,
  selectable: () => selectable,
  selectedIdSet: () => selectedMyTimetableIdSet,
  heading: () => displayHeading.value,
  startTime: () => startTime,
  endTime: () => endTime,
  track: () => track,
});
</script>

<template>
  <div class="cell">
    <NuxtLink
      v-if="cellLinkUrl"
      :to="localePath(cellLinkUrl)"
      class="cell-link"
      :aria-label="cellLinkLabel"
    />
    <div class="cell-inner">
      <template v-if="track">
        <div class="track">
          {{ t(`timetable.track.${track}`) }}
        </div>
      </template>
      <div v-if="startTime" class="time-row">
        <div class="time">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ startTime }} - {{ endTime }}
        </div>
        <TimetableSelectCheckbox
          v-if="canSelect"
          :checked="areAllProgramsSelected"
          :indeterminate="areSomeProgramsSelected"
          :label="t('myTimetable.add')"
          :accessible-label="timeSlotAccessibleLabel"
          class="cell-interactive"
          @toggle="emit('toggleMyTimetableSelection', programIds)"
        />
      </div>
      <template v-if="type === 'schedule' && programs.length === 0">
        <div class="schedule-title">
          {{ displayHeading }}
        </div>
      </template>

      <template v-else>
        <div v-if="headingUrl && headingUrl !== cellLinkUrl" class="title">
          <NuxtLink :to="localePath(headingUrl)" class="cell-interactive">
            {{ displayHeading }}
          </NuxtLink>
        </div>
        <div v-else class="title">
          {{ displayHeading }}
        </div>
        <div
          v-if="programs.length"
          class="speakers"
          :style="{
            '--speaker-gap': type === 'lightningTalk' ? '24px' : undefined,
          }"
        >
          <template v-for="program in programs" :key="program.id">
            <div :class="{ 'event-speaker': type === 'event' }">
              <div v-if="shouldShowProgramRow(program)" class="program-title-row">
                <NuxtLink
                  v-if="program.url && program.url !== cellLinkUrl"
                  :to="localePath(program.url)"
                  class="title cell-interactive"
                >
                  {{ getProgramDisplayTitle(program) }}
                </NuxtLink>
                <div v-else class="title">
                  {{ getProgramDisplayTitle(program) }}
                </div>
                <TimetableSelectCheckbox
                  v-if="canSelect && hasProgramChoices"
                  :checked="isProgramSelected(program.id)"
                  :label="t('myTimetable.add')"
                  :accessible-label="getProgramAccessibleLabel(program)"
                  class="cell-interactive"
                  @toggle="emit('toggleMyTimetableSelection', [program.id])"
                />
              </div>

              <div v-for="speaker in program.speakers" :key="speaker.id" class="speaker-item">
                <div v-if="speaker.avatarUrl" class="avatar">
                  <img :src="speaker.avatarUrl" :alt="speaker.name" />
                </div>
                <div class="speaker-info">
                  <p v-if="speaker.affiliation" class="affiliation">
                    {{ speaker.affiliation }}
                  </p>
                  <p v-if="speaker.title" class="job-title">
                    {{ speaker.title }}
                  </p>
                  <p class="name">{{ speaker.name }}</p>
                </div>
              </div>
              <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
              <a
                v-if="program.slideUrl"
                :href="program.slideUrl"
                class="slide cell-interactive"
                target="_blank"
              >
                <SliderIcon :aria-label="t('timetable.slider')" role="img" />
              </a>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cell {
  --color-grey-sub: rgba(239, 239, 239, 1);
  position: relative;
  isolation: isolate;
  padding: 16px;
  border-radius: 8px;
  vertical-align: top;
  color: v-bind(color);
  background-color: v-bind(backgroundColor);

  a {
    /* color: inherit; */
    &:hover {
      color: v-bind(hoverColor);
    }
    &:has(.name) {
      color: var(--color-text-default);
    }
  }
}

.cell-link {
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: inherit;

  @media (any-hover: hover) {
    &:hover {
      box-shadow: inset 0 0 0 2px v-bind(color);
    }
  }

  &:focus-visible {
    outline: 3px solid var(--color-text-default);
    outline-offset: -5px;
  }
}

.cell-interactive {
  position: relative;
  z-index: 2;

  &:focus-visible {
    border-radius: 4px;
    outline: 3px solid var(--color-text-default);
    outline-offset: 3px;
  }
}

a.cell-interactive {
  display: inline-flex;
  align-items: center;
  min-width: 24px;
  min-height: 24px;
}

.track {
  width: fit-content;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  color: v-bind(backgroundColor);
  background-color: v-bind(color);
  font-size: 12px;
  font-family: IBMPlexSansJP-Bold;
}

.time {
  display: grid;
  place-items: center;
  width: fit-content;
  height: 25px;
  padding: 0 16px;
  font-family: JetBrainsMono-Medium;
  font-size: 12px;
  border: 1px solid v-bind(color);
  border-radius: 100px;
  background-color: #fff;
}

.time-row,
.program-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  min-width: 0;
}

.program-title-row {
  margin-bottom: 0;
}

.title {
  color: v-bind(color);
  font-family: IBMPlexSansJP-Bold;
  font-size: 16px;
  text-align: left;
  white-space: pre-wrap;
  min-width: 0;

  a {
    font-family: IBMPlexSansJP-Bold;
    color: v-bind(color);
    cursor: pointer;

    @media (any-hover: hover) {
      &:hover {
        color: v-bind(hoverColor);
      }
    }
  }
}
.schedule-title {
  font-family: IBMPlexSansJP-Bold;
  font-size: 16px;
  text-align: center;
  color: var(--color-text-default);
  white-space: pre-wrap;
}

.speakers {
  --speaker-gap: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--speaker-gap) 0;
  margin-top: 8px;
}

.speaker-item {
  display: flex;
  align-items: flex-start;
  gap: 0 8px;
  margin-top: 8px;

  .avatar {
    width: 48px;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    background-color: #fff;
  }

  .speaker-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .affiliation {
    font-size: 11px;
    color: var(--color-text-default);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .job-title {
    font-size: 11px;
    color: var(--color-text-default);
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .name {
    font-size: 14px;
    color: var(--color-text-default);
    line-height: 1.2;
  }
}

.slide {
  margin-top: 8px;
  display: inline-grid;
  place-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: v-bind(color);
    transition: transform 0.2s;

    @media (any-hover: hover) {
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.event-speaker {
  &:has(a) {
    margin-top: 8px;
  }
}
</style>
