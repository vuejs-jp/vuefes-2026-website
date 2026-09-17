<script setup lang="ts">
import {
  computed,
  definePageMeta,
  useI18n,
  useRuntimeConfig,
  // NOTE: import useHead to avoid `useHead is not defined` error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  usePageSeoMeta,
  useFetch,
} from "#imports";
import { VFSection, JaJobBoard, EnJobBoard } from "#components";

definePageMeta({ prerender: true });

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();

const { data: jobBoardsData } = await useFetch("/api/job-board", {
  query: { locale },
});

const jobBoards = computed(() => jobBoardsData.value ?? []);

usePageSeoMeta({
  title: t("jobBoard.title"),
  // TODO: 現在はトップのカバー画像の流用 (1368x770)。専用の OG 画像 (1200x630) ができたら差し替える
  image: `${runtimeConfig.public.siteUrl}images/og/job-board.png`,
});
</script>

<template>
  <div id="pages-job-board">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Job Board</h1>

    <VFSection id="job-board" :title="t('jobBoard.title')">
      <component :is="locale === 'ja' ? JaJobBoard : EnJobBoard" />

      <ul class="job-board-list">
        <li v-for="jobBoard in jobBoards" :key="jobBoard.sponsorId" class="job-board-item">
          <NuxtLink :to="jobBoard.linkUrl" external target="_blank" class="job-board-link">
            <img :src="jobBoard.imageUrl" :alt="jobBoard.imageAlt" loading="lazy" />
          </NuxtLink>
        </li>
      </ul>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-job-board {
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

.job-board-list {
  display: grid;
  margin-top: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin: 32px auto 0;
  padding: 0;
  list-style: none;
}

.job-board-link {
  display: block;
  width: 100%;
  border: 1px solid var(--color-divider-light);
  border-radius: 10px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
