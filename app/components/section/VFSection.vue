<script setup lang="ts">
import { VFHeading } from "#components";
import VFImage, { type Props as VFImageProps } from "../image/VFImage.vue";

const {
  title,
  heading = 2,
  coverImage,
  id,
} = defineProps<{
  title?: string;

  /** @default 2 */
  heading?: 1 | 2 | 3 | 4 | 5 | 6;

  coverImage?: VFImageProps;

  id?: string;
}>();

defineSlots<{
  default: () => void;
}>();
</script>

<template>
  <section class="vf-section">
    <div v-if="coverImage" class="section-cover-wrapper">
      <VFImage
        :image="coverImage.image"
        :alt="coverImage.alt"
        :width="coverImage.width ?? 684"
        :height="coverImage.height ?? 385"
        :sizes="coverImage.sizes"
        :loading="coverImage.loading ?? 'lazy'"
      />
    </div>
    <div class="section-content">
      <div v-if="title">
        <VFHeading :id="id" :level="heading">
          {{ title }}
        </VFHeading>
      </div>
      <div class="section-content-inner">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.vf-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-m);
  background-color: var(--color-white);
  border: 1px solid var(--color-divider-light);
  width: 100%;

  .section-cover-wrapper {
    width: 100%;

    :deep(img) {
      display: block;
      border-radius: var(--radius-m) var(--radius-m) 0 0;
      width: 100%;
      height: auto;
    }
  }

  .section-content {
    padding: 2.5rem 3.5rem 3rem;
    width: 100%;

    @media (--mobile) {
      padding: 2rem 1.5rem 3rem;
    }

    :deep(h3) {
      color: var(--color-text-default);
    }
  }

  /* タイトルがある場合のみ、タイトルと中身の間に余白を付ける */
  .section-content-inner:not(:first-child) {
    margin-top: 2rem;

    @media (--mobile) {
      margin-top: 1.5rem;
    }
  }
}
</style>
