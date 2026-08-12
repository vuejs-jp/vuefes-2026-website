<script setup lang="ts">
import {
  useI18n,
  definePageMeta,
  useRuntimeConfig,

  // NOTE: import useHead to avoid `useHead is not defined` error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  usePageSeoMeta,
  useFetch,
} from "#imports";
import { VFSection } from "#components";

const { data: photoCategories } = await useFetch("/api/photo");

definePageMeta({ prerender: true });
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const CC0_URL = "https://creativecommons.jp/sciencecommons/aboutcc0/";

function getCategoryLabel(id: string): string {
  return t(`photo.categories.${id}`);
}

usePageSeoMeta({
  title: t("photo.title"),
  image: `${runtimeConfig.public.siteUrl}images/og/photo.png`,
  description: t("photo.description"),
});
</script>

<template>
  <div id="pages-photo">
    <h1>{{ $t("photo.title") }}</h1>

    <VFSection>
      <i18n-t keypath="photo.description" tag="p" class="photo-description">
        <template #cc0Link>
          <a :href="CC0_URL" target="_blank" rel="noopener noreferrer" class="cc0-link">{{
            t("photo.cc0LinkText")
          }}</a>
        </template>
      </i18n-t>
      <ul class="photo-list">
        <li v-for="category in photoCategories" :key="category.id" class="photo-list-item">
          <a :href="category.url" target="_blank" rel="noopener noreferrer" class="photo-link">
            {{ getCategoryLabel(category.id) }}
          </a>
        </li>
      </ul>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-photo {
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

.photo-description {
  color: var(--color-text-default);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;

  @media (--mobile) {
    font-size: 14px;
    margin-bottom: 16px;
  }
}

.cc0-link {
  color: var(--color-primary-base);
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
}

.photo-list {
  list-style: disc;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (--mobile) {
    padding-left: 20px;
    gap: 8px;
  }
}

.photo-list-item {
  color: var(--color-text-default);
}

.photo-link {
  color: var(--color-primary-base);
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
  }

  @media (--mobile) {
    font-size: 14px;
  }
}
</style>
