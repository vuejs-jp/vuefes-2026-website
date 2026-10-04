<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ overview?: string }>();

const paragraphs = computed(() =>
  (props.overview ?? "")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => {
      const parts: { text: string; href?: string }[] = [];
      const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|https?:\/\/[^\s]+/g;
      let cursor = 0;

      for (const match of paragraph.matchAll(linkPattern)) {
        const index = match.index ?? 0;
        if (index > cursor) parts.push({ text: paragraph.slice(cursor, index) });
        parts.push({ text: match[1] ?? match[0], href: match[2] ?? match[0] });
        cursor = index + match[0].length;
      }
      if (cursor < paragraph.length) parts.push({ text: paragraph.slice(cursor) });
      return parts;
    }),
);
</script>

<template>
  <div class="program-overview">
    <p v-for="(paragraph, paragraphIndex) in paragraphs" :key="paragraphIndex">
      <template v-for="(part, partIndex) in paragraph" :key="partIndex">
        <a v-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer">
          {{ part.text }}
        </a>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>
  </div>
</template>

<style scoped>
.program-overview p {
  white-space: pre-line;
}
</style>
