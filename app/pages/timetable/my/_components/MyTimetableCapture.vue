<script setup lang="ts">
import TimetableCard from "../../_components/TimetableCard.vue";
import type { MyTimetableSelectableProps } from "~/composables/useMyTimetableItemSelection";
import type { MyTimetableGroup, MyTimetableSelectionId } from "~/utils/myTimetable";
import { ref, useI18n, useLocalePath, useWithBase } from "#imports";

defineProps<
  {
    timetableGroups: readonly MyTimetableGroup[];
  } & MyTimetableSelectableProps
>();

const emit = defineEmits<{
  toggleMyTimetableSelection: [ids: MyTimetableSelectionId[]];
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const withBase = useWithBase();
const captureTarget = ref<HTMLElement>();

defineExpose({
  getCaptureTarget: () => captureTarget.value,
});
</script>

<template>
  <div ref="captureTarget" class="my-timetable-capture">
    <header class="my-timetable-image-header">
      <div class="my-timetable-image-header-card">
        <img
          class="my-timetable-image-logo"
          :src="withBase('/images/logo/logo.svg')"
          :alt="t('logo.shortAlt')"
          width="387"
          height="72"
        />
        <div class="my-timetable-image-meta">
          <time datetime="2026-10-24" class="my-timetable-image-date">
            {{ t("myTimetable.imageHeaderDate") }}
          </time>
          <div class="my-timetable-image-title">
            {{ t("myTimetable.title") }}
          </div>
        </div>
      </div>
    </header>

    <section v-if="timetableGroups.length" class="my-timetable-list">
      <template v-for="group in timetableGroups" :key="group.id">
        <div class="row-time">
          {{ group.time }}
        </div>
        <div class="my-timetable-card-group">
          <TimetableCard
            v-for="card in group.cards"
            :key="card.id"
            v-bind="card"
            :selectable="selectable"
            :selected-my-timetable-id-set="selectedMyTimetableIdSet"
            class="my-timetable-card"
            @toggle-my-timetable-selection="emit('toggleMyTimetableSelection', $event)"
          />
        </div>
      </template>
    </section>

    <section v-else class="my-timetable-empty">
      <p>{{ t("myTimetable.empty") }}</p>
    </section>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.my-timetable-list {
  display: grid;
  gap: 8px 0;
}

.my-timetable-image-header {
  display: none;
}

.my-timetable-capture.is-capturing {
  box-sizing: border-box;
  width: 1200px;
  padding: 32px;
  background-color: var(--color-white);

  .my-timetable-image-header {
    position: relative;
    display: grid;
    height: 220px;
    margin-bottom: 24px;
    padding: 24px;
    overflow: hidden;
    border-radius: 20px;
    background-color: #fae8e4;
    box-sizing: border-box;
    isolation: isolate;

    &::after {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: radial-gradient(rgba(0, 127, 98, 0.12) 0.8px, transparent 0.8px);
      background-size: 6px 6px;
      content: "";
      opacity: 0.5;
    }
  }

  .my-timetable-image-header-card {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 387px minmax(0, 1fr);
    align-items: center;
    align-self: start;
    gap: 40px;
    min-height: 136px;
    padding: 26px 32px;
    border-radius: 30px;
    background-color: var(--color-white);
    box-sizing: border-box;
  }

  .my-timetable-image-logo {
    width: 387px;
    height: 72px;
  }

  .my-timetable-image-meta {
    display: grid;
    justify-items: end;
    gap: 12px;
    min-width: 0;
    color: var(--color-primary-base);
  }

  .my-timetable-image-title {
    color: var(--color-primary-base);
    font-family: ClashDisplay-Medium, IBMPlexSansJP-SemiBold;
    font-size: 42px;
    line-height: 1;
    white-space: nowrap;
  }

  .my-timetable-image-date {
    display: inline-grid;
    place-items: center;
    min-height: 32px;
    padding: 0 16px;
    border: 1px solid var(--color-primary-base);
    border-radius: 999px;
    background-color: var(--color-white);
    font-family: JetBrainsMono-Medium;
    font-size: 15px;
    line-height: 1;
    white-space: nowrap;
  }

  .my-timetable-card-group {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  :deep(.my-timetable-checkbox) {
    display: none;
  }
}

.row-time {
  display: grid;
  place-items: center;
  height: 56px;
  border: solid 1px var(--color-primary-base);
  border-radius: 8px;
  background-color: var(--color-white);
  font-family: JetBrainsMono-Medium;
  font-size: 16px;
}

.my-timetable-card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 8px;

  @media (--mobile-wide) {
    grid-template-columns: 1fr;
  }
}

.my-timetable-empty {
  display: grid;
  justify-items: start;
  gap: 16px;
  padding: 16px 0 0;

  p {
    margin: 0;
    font-family: IBMPlexSansJP-Bold;
  }

  a {
    display: inline-grid;
    place-items: center;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--color-base);
    border-radius: 100px;
    background-color: transparent;
    color: var(--color-base);
    font-family: IBMPlexSansJP-Bold;
    text-decoration: none;
    cursor: pointer;

    @media (any-hover: hover) {
      &:hover {
        border-color: var(--color-accent-hover);
        background-color: var(--color-accent-hover);
        color: var(--color-white);
      }
    }
  }
}
</style>
