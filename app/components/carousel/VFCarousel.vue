<script setup lang="ts" generic="T">
import emblaCarouselVue from "embla-carousel-vue";
import { computed, ref, useId, watchEffect } from "vue";

type VFCarouselProps<T> = {
  items: T[];
  loop?: boolean;
  align?: "start" | "center" | "end";
  label?: string;
  /** スライドサイズ（%）。SSR時のレイアウトシフト防止に使用 */
  slideSize?: number;
  /** スライドの aria-label を返す関数 */
  slideLabel?: (index: number, total: number) => string;
  prevLabel?: string;
  nextLabel?: string;
};

type VFCarouselSlots<T> = {
  slide: (props: { data: T; index: number; isActive: boolean; isInView: boolean }) => unknown;
  prevButton?: (props: { onClick: () => void; disabled: boolean; ariaControls: string }) => unknown;
  nextButton?: (props: { onClick: () => void; disabled: boolean; ariaControls: string }) => unknown;
};

const {
  items,
  loop = true,
  align = "center",
  label = "カルーセル",
  slideSize = 33.333,
  slideLabel = (index, total) => `${total}件中${index}件目`,
  prevLabel = "前へ",
  nextLabel = "次へ",
} = defineProps<VFCarouselProps<T>>();

const carouselId = `vf-carousel-${useId()}`;

defineSlots<VFCarouselSlots<T>>();

const [emblaRef, emblaApi, emblaServerApi] = emblaCarouselVue({
  loop: loop,
  align: align,
  ssr: items.map(() => slideSize),
});

const renderSsrStyles = computed(() => !emblaApi.value);
const ssrStyles = computed(
  () => `<style>${emblaServerApi.ssrStyles(`#${carouselId}`, ".slide")}</style>`,
);

const selectedIndex = ref(0);
const slidesInView = ref<number[]>([]);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);

/**
 * スライドが操作・読み上げ対象かを返す。
 * ビュー内に見えているスライド（中央＋左右に見切れているもの）を対象とする。
 * embla 初期化前（slidesInView が空）はすべて対象として扱い、
 * ハイドレーション前にすべてが inert になるのを防ぐ。
 */
const isSlideActive = (index: number) =>
  slidesInView.value.length === 0 || slidesInView.value.includes(index);

const scrollPrev = () => {
  emblaApi.value?.goToPrev();
};

const scrollNext = () => {
  emblaApi.value?.goToNext();
};

const updateState = () => {
  if (!emblaApi.value) return;
  selectedIndex.value = emblaApi.value.selectedSnap();
  slidesInView.value = emblaApi.value.slidesInView();
  canScrollPrev.value = emblaApi.value.canGoToPrev();
  canScrollNext.value = emblaApi.value.canGoToNext();
};

watchEffect((onCleanup) => {
  const api = emblaApi.value;
  if (!api) return;

  updateState();

  api.on("select", updateState);
  api.on("slidesinview", updateState);
  api.on("reinit", updateState);

  onCleanup(() => {
    api.off("select", updateState);
    api.off("slidesinview", updateState);
    api.off("reinit", updateState);
  });
});
</script>

<template>
  <div v-if="renderSsrStyles" v-html="ssrStyles" />

  <div
    class="vf-carousel"
    role="region"
    :aria-roledescription="label"
    :aria-label="label"
    :style="{ '--slide-size': `${slideSize}%` }"
  >
    <div ref="emblaRef" class="viewport">
      <ul :id="carouselId" class="container" aria-live="polite" aria-atomic="true">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="slideLabel(index + 1, items.length)"
          :aria-hidden="isSlideActive(index) ? undefined : 'true'"
          :inert="isSlideActive(index) ? undefined : true"
        >
          <slot
            name="slide"
            :data="item"
            :index="index"
            :is-active="index === selectedIndex"
            :is-in-view="slidesInView.includes(index)"
          />
        </li>
      </ul>
    </div>

    <div class="navigation">
      <slot
        name="prevButton"
        :on-click="scrollPrev"
        :disabled="!canScrollPrev && !loop"
        :aria-controls="carouselId"
      >
        <button
          type="button"
          class="button prev"
          :aria-label="prevLabel"
          :aria-controls="carouselId"
          :disabled="!canScrollPrev && !loop"
          @click="scrollPrev"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="p-icon"
            aria-hidden="true"
          >
            <path
              d="M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </slot>

      <slot
        name="nextButton"
        :on-click="scrollNext"
        :disabled="!canScrollNext && !loop"
        :aria-controls="carouselId"
      >
        <button
          type="button"
          class="button next"
          :aria-label="nextLabel"
          :aria-controls="carouselId"
          :disabled="!canScrollNext && !loop"
          @click="scrollNext"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="p-icon p-button-icon"
            aria-hidden="true"
          >
            <path
              d="M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.vf-carousel {
  position: relative;

  .viewport {
    overflow: hidden;
  }

  .container {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .slide {
    flex: 0 0 var(--slide-size, 33.333%);
    min-width: 0;
  }

  .navigation {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: var(--vf-carousel-navigation-gap, 16px);
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--vf-carousel-navigation-button-size, 48px);
    height: var(--vf-carousel-navigation-button-size, 48px);
    border-radius: 50%;
    border: 1px solid var(--color-base);
    background-color: transparent;
    color: var(--color-base);
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (any-hover: hover) {
      &:not(:disabled):hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
