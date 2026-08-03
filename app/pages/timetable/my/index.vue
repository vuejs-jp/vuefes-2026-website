<script setup lang="ts">
import MyTimetableCapture from "./_components/MyTimetableCapture.vue";
import VFToast, { useToast } from "~/components/toast/VFToast.vue";
import { useMyTimetable } from "~/composables/useMyTimetable";
import { captureElementAsPng } from "~/utils/captureElementAsPng";
import XIcon from "~icons/icons/ic_x";
import {
  addMyTimetableSelection,
  createMyTimetableGroups,
  createMyTimetableItems,
  createMyTimetableShareUrl,
  createMyTimetableSelectionIndex,
  createSelectableMyTimetableProgramIdSet,
  createSelectableMyTimetableSelectionIdSet,
  decodeMyTimetableQuerySelection,
  encodeMyTimetableQuerySelection,
  haveSameMyTimetableSelection,
  MY_TIMETABLE_QUERY_KEY,
  MY_TIMETABLE_SHARED_QUERY_KEY,
  sortMyTimetableItemsForDisplay,
  toggleMyTimetableSelection,
  type MyTimetableSelectionId,
} from "~/utils/myTimetable";
import type { TimetableItem } from "~~/server/static-data/types/timetable";
import { VFConfirmDialog, VFSection } from "#components";
import {
  computed,
  defineOgImage,
  defineRouteRules,
  navigateTo,
  onMounted,
  ref,
  useFetch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useI18n,
  useLocalePath,
  useRoute,
  useRuntimeConfig,
  useSeoMeta,
  watch,
} from "#imports";

defineRouteRules({ prerender: false });

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const localePath = useLocalePath();
const localizedMyTimetablePath = computed(() => localePath("/timetable/my"));
const { t, locale } = useI18n();
const toast = useToast();
const timetableCapture = ref<{
  getCaptureTarget: () => HTMLElement | undefined;
}>();
const imageAction = ref<"copy" | "save">();
const isClearDialogOpen = ref(false);
const actionCapabilities = ref<{
  copyText: boolean;
  copyImage: boolean;
  saveImage: boolean;
}>();

const hasInitialSelectionQuery = route.query[MY_TIMETABLE_QUERY_KEY] !== undefined;
const isSharedTimetable = computed(() => route.query[MY_TIMETABLE_SHARED_QUERY_KEY] !== undefined);
const pageTitle = computed(() =>
  t(isSharedTimetable.value ? "myTimetable.sharedTitle" : "myTimetable.title"),
);
const shareSectionTitle = computed(() =>
  t(isSharedTimetable.value ? "myTimetable.shareSharedSection" : "myTimetable.shareSection"),
);

const { data: timetable } = await useFetch("/api/timetable", {
  query: { locale },
});
const timetableItems = computed(() => timetable.value?.items ?? []);
const selectionIndex = computed(() => createMyTimetableSelectionIndex(timetableItems.value));
const selectableProgramIdSet = computed(() =>
  createSelectableMyTimetableProgramIdSet(timetableItems.value),
);

const parsedInitialSelectionIds = hasInitialSelectionQuery ? parseSelectionQuery() : undefined;
const ogSelection = parsedInitialSelectionIds
  ? encodeMyTimetableQuerySelection(selectionIndex.value, parsedInitialSelectionIds)
  : "";
const { selectedIds, isStorageLoaded, setSelectionIds, clearSelection } = useMyTimetable();

const selectablePersonalSelectedIdSet = computed(() =>
  createSelectableMyTimetableSelectionIdSet(selectableProgramIdSet.value, selectedIds.value),
);
const sharedSelectionIds = computed(() => {
  if (!isSharedTimetable.value) {
    return undefined;
  }

  return parseSelectionQuery() ?? [];
});
const displayedSelectedIdSet = computed(() =>
  createSelectableMyTimetableSelectionIdSet(
    selectableProgramIdSet.value,
    sharedSelectionIds.value ?? selectedIds.value,
  ),
);
const displayedSelectedIds = computed(() => [...displayedSelectedIdSet.value]);
const myTimetableItems = computed(() =>
  sortMyTimetableItemsForDisplay(
    createMyTimetableItems(timetableItems.value, displayedSelectedIdSet.value),
  ),
);
const timetableGroups = computed(() => createMyTimetableGroups(myTimetableItems.value));
const selectedCount = computed(() => displayedSelectedIds.value.length);
const sharedSelectionIdsNotInPersonalTimetable = computed(() =>
  displayedSelectedIds.value.filter((id) => !selectablePersonalSelectedIdSet.value.has(id)),
);
const areAllSharedSelectionsInPersonalTimetable = computed(
  () => selectedCount.value > 0 && sharedSelectionIdsNotInPersonalTimetable.value.length === 0,
);
const shareUrl = computed(() =>
  createMyTimetableShareUrl({
    siteBaseUrl: runtimeConfig.public.siteUrl,
    localizedPath: localizedMyTimetablePath.value,
    selectionIndex: selectionIndex.value,
    selectionIds: displayedSelectedIds.value,
    isShared: true,
  }),
);
const xShareUrl = computed(() => {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", t("myTimetable.shareText", { link: shareUrl.value }));

  return url.toString();
});
const copyText = computed(() => formatItemsAsText(myTimetableItems.value));

onMounted(() => {
  actionCapabilities.value = detectActionCapabilities();
});

watch(
  [
    () => route.query[MY_TIMETABLE_QUERY_KEY],
    () => route.query[MY_TIMETABLE_SHARED_QUERY_KEY],
    isStorageLoaded,
  ],
  async ([selectionQuery]) => {
    if (!import.meta.client || !isStorageLoaded.value) {
      return;
    }

    if (selectionQuery === undefined) {
      if (isSharedTimetable.value) {
        await removeTimetableQuery();
      }
      return;
    }

    const querySelectionIds = parseSelectionQuery();
    if (!querySelectionIds) {
      await removeTimetableQuery();
      return;
    }

    const canonicalSelection = encodeMyTimetableQuerySelection(
      selectionIndex.value,
      querySelectionIds,
    );
    if (isSharedTimetable.value) {
      if (selectionQuery !== canonicalSelection) {
        await markTimetableAsShared(querySelectionIds);
      }
      return;
    }

    if (!haveSameMyTimetableSelection(selectablePersonalSelectedIdSet.value, querySelectionIds)) {
      await markTimetableAsShared(querySelectionIds);
    }
  },
  { immediate: true },
);

useSeoMeta({
  title: () => `Vue Fes Japan 2026 - ${pageTitle.value}`,
  ogImage: `${runtimeConfig.public.siteUrl}images/og/timetable.png`,
  ogTitle: () => `Vue Fes Japan 2026 - ${pageTitle.value}`,
  description: () => t("myTimetable.description"),
  ogDescription: () => t("myTimetable.description"),
});

if (ogSelection) {
  defineOgImage("OgMyTimetable", {
    selection: ogSelection,
    locale: locale.value === "en" ? "en" : "ja",
  });
}

async function copyShareLink() {
  if (!shareUrl.value) {
    return;
  }

  await copyTextWithFeedback(shareUrl.value, t("myTimetable.linkCopied"));
}

async function copyProgramText() {
  await copyTextWithFeedback(copyText.value, t("myTimetable.textCopied"));
}

async function saveTimetableImage() {
  if (!actionCapabilities.value?.saveImage) {
    return;
  }

  imageAction.value = "save";

  try {
    const blob = await createTimetableImage();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "vuefes-2026-my-timetable.png";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    toast.open({ type: "success", message: t("myTimetable.imageSaved") });
  } catch {
    toast.open({ type: "alert", message: t("myTimetable.imageFailed") });
  } finally {
    imageAction.value = undefined;
  }
}

async function copyTimetableImage() {
  if (!actionCapabilities.value?.copyImage) {
    toast.open({ type: "alert", message: t("myTimetable.imageCopyFailed") });
    return;
  }

  imageAction.value = "copy";

  try {
    const blobPromise = createTimetableImage();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);

    toast.open({ type: "success", message: t("myTimetable.imageCopied") });
  } catch {
    toast.open({ type: "alert", message: t("myTimetable.imageCopyFailed") });
  } finally {
    imageAction.value = undefined;
  }
}

async function createTimetableImage(): Promise<Blob> {
  const captureTarget = timetableCapture.value?.getCaptureTarget();
  if (!captureTarget) {
    throw new Error("Timetable capture target is unavailable");
  }

  return captureElementAsPng(captureTarget);
}

async function copyTextWithFeedback(text: string, successMessage: string) {
  try {
    await writeClipboardText(text);
    toast.open({ type: "success", message: successMessage });
  } catch {
    toast.open({ type: "alert", message: t("myTimetable.copyFailed") });
  }
}

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Clipboard write timed out")), 1000);
        }),
      ]);
      return;
    } catch {
      // Fall back to the legacy copy path below.
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Clipboard write failed");
    }
  } finally {
    textarea.remove();
  }
}

async function removeTimetableQuery() {
  if (
    route.query[MY_TIMETABLE_QUERY_KEY] === undefined &&
    route.query[MY_TIMETABLE_SHARED_QUERY_KEY] === undefined
  ) {
    return;
  }

  const query = { ...route.query };
  delete query[MY_TIMETABLE_QUERY_KEY];
  delete query[MY_TIMETABLE_SHARED_QUERY_KEY];

  await navigateTo({ path: route.path, query, hash: route.hash }, { replace: true });
}

async function markTimetableAsShared(selectionIds: readonly MyTimetableSelectionId[]) {
  const sharedUrl = createMyTimetableShareUrl({
    siteBaseUrl: runtimeConfig.public.siteUrl,
    localizedPath: localizedMyTimetablePath.value,
    selectionIndex: selectionIndex.value,
    selectionIds,
    isShared: true,
  });
  if (!sharedUrl) {
    await removeTimetableQuery();
    return;
  }

  const encodedSearch = new URL(sharedUrl).search;
  await navigateTo(`${localizedMyTimetablePath.value}${encodedSearch}${route.hash}`, {
    external: true,
    replace: true,
  });
}

function parseSelectionQuery() {
  return decodeMyTimetableQuerySelection(selectionIndex.value, route.query[MY_TIMETABLE_QUERY_KEY]);
}

async function clearMyTimetableSelection() {
  clearSelection();
  await removeTimetableQuery();
}

function addAllSharedSelectionsToPersonalTimetable() {
  const selectionIdsToAdd = sharedSelectionIdsNotInPersonalTimetable.value;
  if (!selectionIdsToAdd.length) {
    return;
  }

  setSelectionIds(
    addMyTimetableSelection(selectablePersonalSelectedIdSet.value, selectionIdsToAdd),
  );
  toast.open({
    type: "success",
    message: t("myTimetable.sharedSelectionsAdded", { count: selectionIdsToAdd.length }),
  });
}

function toggleSelection(ids: MyTimetableSelectionId[]) {
  setSelectionIds(toggleMyTimetableSelection(selectablePersonalSelectedIdSet.value, ids));
}

function detectActionCapabilities() {
  const canvas = document.createElement("canvas");
  const downloadLink = document.createElement("a");
  const canGenerateImage = typeof canvas.toBlob === "function" && "fonts" in document;
  const canCopyPng =
    typeof ClipboardItem === "function" &&
    (typeof ClipboardItem.supports !== "function" || ClipboardItem.supports("image/png"));

  return {
    copyText:
      typeof navigator.clipboard?.writeText === "function" ||
      typeof document.execCommand === "function",
    copyImage:
      canGenerateImage &&
      window.isSecureContext &&
      typeof navigator.clipboard?.write === "function" &&
      canCopyPng,
    saveImage:
      canGenerateImage &&
      "download" in downloadLink &&
      typeof URL.createObjectURL === "function" &&
      typeof URL.revokeObjectURL === "function",
  };
}

function getTrackLabel(item: TimetableItem): string {
  return item.tracks.map((track) => t(`timetable.track.${track}`)).join(" / ");
}

function formatItemsAsText(items: readonly TimetableItem[]): string {
  if (!items.length) {
    return t("myTimetable.empty");
  }

  const programSections = items.flatMap((item) =>
    item.programs.map((program) => {
      const title = program.title || item.heading || t("myTimetable.untitledProgram");
      const lines = [
        `## ${title}`,
        "",
        `- ${t("myTimetable.copyTextTime")}: ${item.start} - ${item.end}`,
        `- ${t("myTimetable.copyTextTrack")}: ${getTrackLabel(item)}`,
      ];

      if (item.heading && item.heading !== title) {
        lines.push(`- ${item.heading}`);
      }

      const speakerNames = program.speakers.map((speaker) => speaker.name).join(", ");
      if (speakerNames) {
        lines.push(`- ${t("myTimetable.copyTextSpeakers")}: ${speakerNames}`);
      }

      return lines.join("\n");
    }),
  );

  return [`# ${t("myTimetable.copyTextTitle")}`, ...programSections].join("\n\n");
}
</script>

<template>
  <div id="pages-my-timetable">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>My Timetable</h1>

    <VFSection :title="pageTitle">
      <div class="my-timetable-content">
        <div class="my-timetable-toolbar">
          <div class="my-timetable-overview">
            <div class="my-timetable-status">
              <div class="my-timetable-summary">
                {{
                  t(isSharedTimetable ? "myTimetable.sharedCount" : "myTimetable.selectedCount", {
                    count: selectedCount,
                  })
                }}
              </div>
            </div>

            <div class="my-timetable-navigation">
              <NuxtLink :to="localePath('/timetable')" class="back-to-timetable-link">
                {{ t("myTimetable.backToTimetable") }}
              </NuxtLink>
              <template v-if="isSharedTimetable">
                <button
                  type="button"
                  class="add-all-shared-selections-button"
                  :disabled="areAllSharedSelectionsInPersonalTimetable"
                  @click="addAllSharedSelectionsToPersonalTimetable"
                >
                  {{
                    t(
                      areAllSharedSelectionsInPersonalTimetable
                        ? "myTimetable.allSharedSelectionsAdded"
                        : "myTimetable.addAllSharedSelections",
                    )
                  }}
                </button>
                <NuxtLink :to="localizedMyTimetablePath">
                  {{ t("myTimetable.viewPersonalTimetable") }}
                </NuxtLink>
              </template>
              <button
                v-else
                type="button"
                :disabled="!selectedCount"
                @click="isClearDialogOpen = true"
              >
                {{ t("myTimetable.clear") }}
              </button>
            </div>
          </div>

          <section class="my-timetable-share" :aria-label="shareSectionTitle">
            <div class="my-timetable-share-inner">
              <div class="share-title">
                {{ shareSectionTitle }}
              </div>
              <div v-if="actionCapabilities" class="my-timetable-actions">
                <div class="my-timetable-action-row">
                  <button
                    v-if="actionCapabilities.copyText"
                    type="button"
                    :disabled="!selectedCount"
                    @click="copyShareLink"
                  >
                    {{ t("myTimetable.link") }}
                  </button>
                  <a
                    v-if="selectedCount"
                    :href="xShareUrl"
                    target="_blank"
                    rel="noopener"
                    :aria-label="t('myTimetable.shareOnX')"
                    class="share-x-button"
                  >
                    <span class="share-x-icon" aria-hidden="true">
                      <XIcon />
                    </span>
                  </a>
                  <button
                    v-else
                    type="button"
                    disabled
                    :aria-label="t('myTimetable.shareOnX')"
                    class="share-x-button"
                  >
                    <span class="share-x-icon" aria-hidden="true">
                      <XIcon />
                    </span>
                  </button>
                </div>
                <div
                  v-if="
                    actionCapabilities.copyText ||
                    actionCapabilities.copyImage ||
                    actionCapabilities.saveImage
                  "
                  class="my-timetable-action-row my-timetable-action-row-secondary"
                >
                  <button
                    v-if="actionCapabilities.copyText"
                    type="button"
                    class="action-secondary"
                    :disabled="!selectedCount"
                    @click="copyProgramText"
                  >
                    {{ t("myTimetable.text") }}
                  </button>
                  <button
                    v-if="actionCapabilities.copyImage"
                    type="button"
                    class="action-secondary"
                    :disabled="!selectedCount || imageAction !== undefined"
                    @click="copyTimetableImage"
                  >
                    {{
                      imageAction === "copy"
                        ? t("myTimetable.generatingImage")
                        : t("myTimetable.copyImage")
                    }}
                  </button>
                  <button
                    v-if="actionCapabilities.saveImage"
                    type="button"
                    class="action-secondary"
                    :disabled="!selectedCount || imageAction !== undefined"
                    @click="saveTimetableImage"
                  >
                    {{
                      imageAction === "save"
                        ? t("myTimetable.generatingImage")
                        : t("myTimetable.saveImage")
                    }}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <MyTimetableCapture
          ref="timetableCapture"
          :timetable-groups="timetableGroups"
          :selectable="isSharedTimetable"
          :selected-my-timetable-id-set="selectablePersonalSelectedIdSet"
          @toggle-my-timetable-selection="toggleSelection"
        />
      </div>
    </VFSection>

    <VFToast :state="toast.state.value" />
    <VFConfirmDialog
      v-model:open="isClearDialogOpen"
      :title="t('myTimetable.clearConfirmTitle')"
      :description="t('myTimetable.clearConfirmDescription')"
      :confirm-label="t('myTimetable.clear')"
      :cancel-label="t('myTimetable.clearCancel')"
      @confirm="clearMyTimetableSelection"
    />
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-my-timetable {
  display: grid;
  row-gap: 1.5rem;

  h1 {
    font-family: "ClashDisplay-Semibold";
    font-size: 3rem;
    padding: 7.5rem 0 2.5rem;
    margin: 0;

    @media (--mobile) {
      padding: 2.5rem 0.75rem 1rem;
    }
  }
}

.my-timetable-content {
  display: grid;
  gap: 16px 0;
}

.my-timetable-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--color-divider-light);
  border-radius: 8px;
  background-color: var(--color-sub);

  @media (--mobile-wide) {
    display: grid;
    align-items: start;
  }

  @media (--mobile) {
    padding: 12px;
  }
}

.my-timetable-overview {
  display: grid;
  align-self: stretch;
  align-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.my-timetable-status {
  display: grid;
  gap: 4px;
}

.my-timetable-summary {
  font-family: IBMPlexSansJP-Bold;
  color: var(--color-base);
  font-size: 1.3rem;
  padding: 0.5rem;
}

.my-timetable-shared-description {
  max-width: 40rem;
  margin: 0;
  line-height: 1.6;
}

.my-timetable-share {
  display: grid;
  justify-items: end;
  margin-left: auto;
  min-width: min(100%, 360px);

  @media (--mobile-wide) {
    justify-items: start;
    margin-left: 0;
    min-width: 0;
  }
}

.my-timetable-share-inner {
  display: grid;
  justify-items: start;
  gap: 1rem;
  width: fit-content;
  max-width: 100%;
}

.share-title {
  font-family: IBMPlexSansJP-Bold;
  color: var(--color-text-default);
  font-size: 13px;
  line-height: 1.4;
}

.my-timetable-navigation,
.my-timetable-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.my-timetable-actions button,
.my-timetable-actions a,
.my-timetable-navigation button,
.my-timetable-navigation a {
  display: inline-grid;
  place-items: center;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-base);
  border-radius: 100px;
  background-color: var(--color-base);
  color: var(--color-white);
  font-family: IBMPlexSansJP-Bold;
  text-decoration: none;
  cursor: pointer;

  @media (any-hover: hover) {
    &:not(:disabled):hover {
      background-color: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
    }
  }
}

.my-timetable-actions {
  display: grid;
  justify-items: start;
  gap: 8px;

  .action-secondary:not(:disabled) {
    background-color: transparent;
    color: var(--color-base);

    @media (any-hover: hover) {
      &:hover {
        border-color: var(--color-accent-hover);
        background-color: var(--color-accent-hover);
        color: var(--color-white);
      }
    }
  }
}

.my-timetable-action-row {
  justify-content: flex-start;
}

.my-timetable-action-row-secondary {
  @media (--mobile-small) {
    flex-wrap: nowrap;
    gap: 6px;

    .action-secondary {
      padding: 0 8px;
      font-size: 13px;
    }
  }
}

.share-x-button {
  min-width: 1.5rem;
  padding: 0;
  overflow: hidden;
}

.share-x-icon {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 100%;
  overflow: hidden;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(path) {
    fill: currentColor;
  }
}

.my-timetable-navigation button,
.my-timetable-navigation a {
  background-color: transparent;
  color: var(--color-base);

  @media (any-hover: hover) {
    &:not(:disabled):hover {
      color: var(--color-white);
    }
  }
}

.my-timetable-navigation .add-all-shared-selections-button:not(:disabled),
.my-timetable-navigation .back-to-timetable-link {
  background-color: var(--color-base);
  color: var(--color-white);
}

button:disabled {
  border-color: var(--color-place-holder);
  background-color: var(--color-place-holder);
  color: var(--color-white);
  cursor: not-allowed;
}
</style>
