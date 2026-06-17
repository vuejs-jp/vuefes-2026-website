<script setup lang="ts">
import { computed } from "vue";
import { useI18n, useLocalePath } from "#imports";
import type { TimetableCell } from "~~/server/static-data/types/timetable";
import SliderIcon from "~icons/icons/timetable-slider";

const {
  type,
  heading,
  headingUrl,
  startTime,
  endTime,
  color: selectedColor,
  programs,
  track,
} = defineProps<TimetableCell>();
const { t } = useI18n();
const localePath = useLocalePath();

const accentColorName = computed(() => {
  return selectedColor ?? "primary";
});

const backgroundColor = computed(() => `var(--color-${accentColorName.value}-sub)`);
const color = computed(() => `var(--color-${accentColorName.value}-base)`);
const hoverColor = computed(() => `var(--color-${accentColorName.value}-accent-hover)`);
</script>

<template>
  <div class="cell">
    <div class="cell-inner">
      <template v-if="track">
        <div class="track">
          {{ t(`timetable.track.${track}`) }}
        </div>
      </template>
      <div v-if="startTime" class="time">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        {{ startTime }} - {{ endTime }}
      </div>
      <template v-if="type === 'schedule'">
        <div class="schedule-title">
          {{ heading }}
        </div>
      </template>

      <template v-else>
        <div v-if="headingUrl" class="title">
          <NuxtLink :to="localePath(headingUrl)">
            {{ heading }}
          </NuxtLink>
        </div>
        <div v-else class="title">
          {{ heading }}
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
              <div v-if="program.title && program.title !== heading" class="title">
                <NuxtLink v-if="program.url" :to="localePath(program.url)">
                  {{ program.title }}
                </NuxtLink>
                <template v-else>{{ program.title }}</template>
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
              <a v-if="program.slideUrl" :href="program.slideUrl" class="slide" target="_blank">
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
  margin-bottom: 8px;
  padding: 0 16px;
  font-family: JetBrainsMono-Medium;
  font-size: 12px;
  border: 1px solid v-bind(color);
  border-radius: 100px;
  background-color: #fff;
}

.title {
  color: v-bind(color);
  font-family: IBMPlexSansJP-Bold;
  font-size: 16px;
  text-align: left;
  white-space: pre-wrap;

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
