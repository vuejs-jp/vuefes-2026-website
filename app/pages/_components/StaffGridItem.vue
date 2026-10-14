<script lang="ts">
import { computed } from "vue";

export type StaffItemProps = {
  name: string;
  avatarUrl?: string;
  // Declared as a prop so it is not rendered as a fallthrough attribute (ordering is done by the API).
  pinned?: boolean;
  socialUrls?: {
    x?: string;
    github?: string;
  };
};
</script>

<script setup lang="ts">
const { name, avatarUrl, socialUrls, gridMode } = defineProps<
  StaffItemProps & { gridMode: "leader" | "core" | "volunteer" }
>();

const gridItemClass = computed(() => `staff-link-${gridMode}`);

const linkComp = computed(() => (socialUrls?.x ? socialUrls.x : socialUrls?.github));
</script>

<template>
  <NuxtLink
    v-if="linkComp"
    :to="linkComp"
    external
    target="_blank"
    class="staff"
    :class="gridItemClass"
  >
    <img :src="avatarUrl" :alt="name" />
    <p class="font-bold">{{ name }}</p>
  </NuxtLink>

  <div v-else class="staff" :class="gridItemClass">
    <img v-if="avatarUrl" :src="avatarUrl" :alt="name" loading="lazy" />
    <p class="font-bold">
      {{ name }}
    </p>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.staff {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #444;

  /* Name: same size and weight for leaders, cores and volunteers. May wrap onto two lines. */
  p {
    width: 100%;
    text-align: left;
    overflow-wrap: break-word;
    color: var(--color-text-default);
    font-family: IBMPlexSansJP-Bold;
    font-size: 13px;
    line-height: 1.3;

    @media (--mobile) {
      font-size: 12px;
    }
  }

  /* Leader and core: avatar card with the name below (column count differs per grid) */
  &.staff-link-leader,
  &.staff-link-core {
    img {
      width: 100%;
      height: auto;
      border-radius: 8%;
      border: 0.5px solid #ddd;
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }

    p {
      margin-top: 0.5rem;

      @media (--mobile) {
        margin-top: 0.375rem;
      }
    }
  }

  &.staff-link-volunteer {
    p {
      margin: 0.3rem 0.6rem;
      line-height: 1.5; /* names-only list: a bit more room between rows */

      @media (--mobile) {
        margin: 0 0.6rem;
        line-height: 1.8;
      }
    }
  }
}
</style>
