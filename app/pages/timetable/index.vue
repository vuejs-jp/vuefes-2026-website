<script setup lang="ts">
import TimetableHead from "./_components/TimetableHead.vue";
import TimetableCell from "./_components/TimetableCell.vue";
import TimetableCard from "./_components/TimetableCard.vue";
import { createDesktopTimetable, createMobileTimetable } from "./_utils/builders/";
import { useScrollPosition } from "~/composables/useScrollPosition";
import { useMyTimetable } from "~/composables/useMyTimetable";
import {
  createSelectableMyTimetableProgramIdSet,
  createSelectableMyTimetableSelectionIdSet,
  toggleMyTimetableSelection,
  type MyTimetableSelectionId,
} from "~/utils/myTimetable";
import { VFConfirmDialog, VFSection } from "#components";
import {
  ref,
  defineRouteRules,
  useBreakpoint,
  useFetch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useI18n,
  useRuntimeConfig,
  usePageSeoMeta,
  useWithBase,
  computed,
  useLocalePath,
} from "#imports";

defineRouteRules({ prerender: true });
const withBase = useWithBase();

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();
const bp = useBreakpoint();
const localePath = useLocalePath();
const showVenueMap = import.meta.vfFeatures.timetableVenueMap;

const { data: timetable } = await useFetch("/api/timetable", {
  query: { locale },
});
const {
  isEnabled: isMyTimetableEnabled,
  selectedIds,
  setEnabled: setMyTimetableEnabled,
  setSelectionIds,
  clearSelection,
} = useMyTimetable();

const timetableItems = computed(() => timetable.value?.items ?? []);
const isPc = computed(() => bp.value === "pc");
const desktopRows = computed(() => createDesktopTimetable(timetableItems.value));
const mobileGroups = computed(() => createMobileTimetable(timetableItems.value));
const selectableProgramIdSet = computed(() =>
  createSelectableMyTimetableProgramIdSet(timetableItems.value),
);
const selectableSelectedIdSet = computed(() =>
  createSelectableMyTimetableSelectionIdSet(selectableProgramIdSet.value, selectedIds.value),
);
const selectedCount = computed(() => selectableSelectedIdSet.value.size);
const isClearDialogOpen = ref(false);

function toggleSelection(ids: MyTimetableSelectionId[]) {
  setSelectionIds(toggleMyTimetableSelection(selectableSelectedIdSet.value, ids));
}

useScrollPosition("timetableScrollPosition");

usePageSeoMeta({
  title: () => `Vue Fes Japan 2026 - ${t("timetable.title")}`,
  image: `${runtimeConfig.public.siteUrl}images/og/timetable.png`,
  description: () => t("timetable.description"),
});
</script>

<template>
  <div id="pages-timetable">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Timetable</h1>
    <VFSection :title="t('timetable.title')">
      <template v-if="timetableItems">
        <div class="my-timetable-toolbar">
          <label class="my-timetable-toggle">
            <input
              type="checkbox"
              role="switch"
              class="my-timetable-toggle-input"
              :checked="isMyTimetableEnabled"
              @change="setMyTimetableEnabled(!isMyTimetableEnabled)"
            />
            <span class="my-timetable-toggle-track" aria-hidden="true" />
            <span class="my-timetable-toggle-label">
              {{ t("myTimetable.enable") }}
            </span>
          </label>

          <div v-if="isMyTimetableEnabled" class="my-timetable-summary">
            <div class="my-timetable-status">
              {{ t("myTimetable.selectedCount", { count: selectedCount }) }}
            </div>
            <div class="my-timetable-actions">
              <button
                type="button"
                class="my-timetable-clear-button"
                :disabled="!selectedCount"
                @click="isClearDialogOpen = true"
              >
                {{ t("myTimetable.clear") }}
              </button>
              <NuxtLink :to="localePath('/timetable/my')" class="my-timetable-link">
                {{ t("myTimetable.open") }}
              </NuxtLink>
            </div>
          </div>
        </div>

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
                :selectable="isMyTimetableEnabled"
                :selected-my-timetable-id-set="selectableSelectedIdSet"
                :class="`cell-${cell.type}`"
                @toggle-my-timetable-selection="toggleSelection"
              />
            </tr>
          </tbody>
        </table>

        <div v-else class="timetable-mobile">
          <template v-for="group in mobileGroups" :key="group.id">
            <div class="row-time">
              {{ group.time }}
            </div>
            <TimetableCard
              v-for="card in group.cards"
              :key="card.id"
              v-bind="card"
              :selectable="isMyTimetableEnabled"
              :selected-my-timetable-id-set="selectableSelectedIdSet"
              @toggle-my-timetable-selection="toggleSelection"
            />
          </template>
        </div>
      </template>
    </VFSection>

    <VFSection v-if="showVenueMap" :title="t('venueMap.title')" class="venue-map-section">
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

    <VFConfirmDialog
      v-model:open="isClearDialogOpen"
      :title="t('myTimetable.clearConfirmTitle')"
      :description="t('myTimetable.clearConfirmDescription')"
      :confirm-label="t('myTimetable.clear')"
      :cancel-label="t('myTimetable.clearCancel')"
      @confirm="clearSelection"
    />
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-timetable {
  --timetable-sticky-header-top: 108px;
  --timetable-track-head-height: 80px;
  --timetable-sticky-gap: 0.5rem;

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
    top: var(--timetable-sticky-header-top);
    z-index: 2;

    th {
      position: relative;
      z-index: 2;
    }
  }
}

.my-timetable-toolbar {
  position: sticky;
  top: calc(
    var(--timetable-sticky-header-top) + var(--timetable-track-head-height) +
      var(--timetable-sticky-gap)
  );
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  margin: 0.5rem 0;
  padding: 12px 16px;
  border: 1px solid var(--color-divider-light);
  border-radius: 8px;
  background-color: var(--color-white-transparent);
  backdrop-filter: blur(8px);

  @media (--mobile-wide) {
    position: static;
    gap: 8px;
  }
}

.my-timetable-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  min-height: 32px;
  cursor: pointer;
}

.my-timetable-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + .my-timetable-toggle-track {
    border-color: var(--color-base);
    background-color: var(--color-base);

    &::after {
      transform: translateX(20px);
    }
  }

  &:focus-visible + .my-timetable-toggle-track {
    outline: 2px solid var(--color-base);
    outline-offset: 2px;
  }
}

.my-timetable-toggle-track {
  position: relative;
  flex: 0 0 auto;
  width: 48px;
  height: 28px;
  border: 1px solid var(--color-divider);
  border-radius: 100px;
  background-color: var(--color-place-holder);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--color-white);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }
}

.my-timetable-toggle-label,
.my-timetable-status {
  font-family: IBMPlexSansJP-Bold;
  color: var(--color-text-default);
}

.my-timetable-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider-light);

  @media (--mobile) {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }
}

.my-timetable-status {
  flex: 1 1 auto;
}

.my-timetable-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;

  @media (--mobile) {
    justify-content: stretch;

    > * {
      flex: 1;
    }
  }

  @media (--mobile-small) {
    flex-direction: column;

    > * {
      flex: none;
      width: 100%;
    }
  }
}

.my-timetable-clear-button,
.my-timetable-link {
  display: inline-grid;
  place-items: center;
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid var(--color-base);
  border-radius: 100px;
  font-family: IBMPlexSansJP-Bold;
  text-decoration: none;
}

.my-timetable-clear-button {
  color: var(--color-base);
  background-color: transparent;
  cursor: pointer;

  &:disabled {
    border-color: var(--color-place-holder);
    color: var(--color-place-holder);
    cursor: not-allowed;
  }

  @media (any-hover: hover) {
    &:not(:disabled):hover {
      border-color: var(--color-accent-hover);
      color: var(--color-accent-hover);
    }
  }
}

.my-timetable-link {
  color: var(--color-white);
  background-color: var(--color-base);

  @media (any-hover: hover) {
    &:hover {
      border-color: var(--color-accent-hover);
      background-color: var(--color-accent-hover);
    }
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
