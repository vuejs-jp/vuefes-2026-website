<script setup lang="ts">
import { HOME_HEADING_ID } from "~/constant";
import { useI18n, useFetch, useBreakpoint, computed, onMounted } from "#imports";
import { VFSection } from "#components";

import StaffGrid from "./StaffGrid.vue";
import type { Staff } from "~~/server/static-data/types/staff";
import type { StaffsResponse } from "~/utils/apiResponses";

const { t } = useI18n();
const bp = useBreakpoint();

const { data: staffList } = await useFetch<StaffsResponse>("/api/staffs", { deep: true });

// Leaders: 4 columns (3 on mobile-wide, 2 on mobile). Cores: smaller cards, 5 columns.
const leaderColumns = computed(() => {
  return bp.value === "pc" ? 4 : bp.value === "mobile-wide" ? 3 : 2;
});

const coreColumns = computed(() => {
  return bp.value === "pc" ? 5 : 3;
});

onMounted(() => {
  if (!staffList.value) return;
  staffList.value.leaders = shuffleNonPinned(staffList.value.leaders);
  staffList.value.cores = shuffleNonPinned(staffList.value.cores);
});
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function shuffleNonPinned(staffArray: Staff[]): Staff[] {
  const pinned = staffArray.filter((staff) => staff.pinned);
  const nonPinned = staffArray.filter((staff) => !staff.pinned);
  const shuffledNonPinned = shuffleArray(nonPinned);
  return [...pinned, ...shuffledNonPinned];
}
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.staff" :title="t('staff.title')">
    <p class="staff-description">
      {{ t("staff.description") }}
    </p>
    <template v-if="staffList">
      <StaffGrid :staff-list="staffList.leaders" grid-mode="leader" :columns="leaderColumns" />
      <StaffGrid :staff-list="staffList.cores" grid-mode="core" :columns="coreColumns" />

      <div class="volunteer-heading">
        <VFHeading id="volunteer-staff">
          {{ t("staff.volunteer") }}
        </VFHeading>
      </div>

      <StaffGrid :staff-list="staffList.volunteers" grid-mode="volunteer" />
    </template>
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.staff-description {
  margin: 2rem 0;
  word-break: break-all;
}

/* Extra breathing room between the core-staff grid and the volunteer heading */
.volunteer-heading {
  margin-top: 2.5rem;

  @media (--mobile) {
    margin-top: 2rem;
  }
}
</style>
