<script setup lang="ts">
import { computed } from "vue";

type SrcSets = {
  avif?: string;
  webp?: string;
  src: string;
};

type MediaSrcSet = {
  pc: SrcSets;
  sp?: SrcSets;
};

export type Props = {
  image: string | SrcSets | MediaSrcSet;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  /** @default "lazy" */
  loading?: "lazy" | "eager";
  /** @default "async" */
  decoding?: "async" | "sync" | "auto";
  /** @default "(max-width: 1036px)" */
  mobileMedia?: string;
};

const {
  image,
  alt,
  width,
  height,
  sizes,
  loading = "lazy",
  decoding = "async",
  mobileMedia = "(max-width: 1036px)",
} = defineProps<Props>();

defineOptions({ inheritAttrs: false });

const resolved = computed(() => {
  let pc: SrcSets;
  let sp: SrcSets | undefined;
  if (typeof image === "string") {
    pc = { src: image };
  } else if ("pc" in image) {
    pc = image.pc;
    sp = image.sp;
  } else {
    pc = image;
  }

  const fallbackSrc = pc.src.split(",")[0]?.trim().split(/\s+/)[0] ?? "";
  return { pc, sp, fallbackSrc };
});
</script>

<template>
  <picture>
    <template v-if="resolved.sp">
      <source
        v-if="resolved.sp.avif"
        :media="mobileMedia"
        type="image/avif"
        :srcset="resolved.sp.avif"
        :sizes="sizes"
      />
      <source
        v-if="resolved.sp.webp"
        :media="mobileMedia"
        type="image/webp"
        :srcset="resolved.sp.webp"
        :sizes="sizes"
      />
      <source :media="mobileMedia" :srcset="resolved.sp.src" :sizes="sizes" />
    </template>

    <source v-if="resolved.pc.avif" type="image/avif" :srcset="resolved.pc.avif" :sizes="sizes" />
    <source v-if="resolved.pc.webp" type="image/webp" :srcset="resolved.pc.webp" :sizes="sizes" />
    <img
      v-bind="$attrs"
      :src="resolved.fallbackSrc"
      :srcset="resolved.pc.src"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
    />
  </picture>
</template>

<style scoped>
picture {
  display: contents;
}
</style>
