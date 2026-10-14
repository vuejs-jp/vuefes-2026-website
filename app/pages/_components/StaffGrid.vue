<script setup lang="ts">
import { computed } from "vue";

import StaffGridItem, { type StaffItemProps } from "./StaffGridItem.vue";

const { staffList, gridMode, columns } = defineProps<{
  staffList: StaffItemProps[];
  gridMode: "leader" | "core" | "volunteer";
  columns?: number;
}>();

const gridClass = computed(() => `staff-grid staff-grid-${gridMode}`);

// NOTE: minmax(0, 1fr) keeps every column the same width. A plain `1fr` has an `auto` minimum,
// so a long unbreakable name (e.g. "@happylifetaka") would widen its column and enlarge the avatar.
const gridStyle = computed(() =>
  columns && (gridMode === "leader" || gridMode === "core")
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : {},
);
</script>

<template>
  <div :class="gridClass" :style="gridStyle">
    <StaffGridItem
      v-for="(staff, idx) in staffList"
      :key="idx"
      class="staff-member"
      v-bind="{ ...staff, gridMode }"
    />
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.staff-grid {
  display: grid;
  margin-bottom: 1.5rem;
}

/* row-gap column-gap */
.staff-grid-leader {
  gap: 1.5rem 1rem;

  @media (--mobile) {
    gap: 1rem 0.75rem;
  }
}

.staff-grid-core {
  gap: 1.25rem 0.75rem;

  @media (--mobile) {
    gap: 0.75rem 0.5rem;
  }
}

.staff-grid-volunteer {
  display: flex;
  flex-wrap: wrap;
  align-items: left;
  margin: 1.5rem 0 0 0;
}
</style>
