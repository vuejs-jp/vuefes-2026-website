<script setup lang="ts" generic="T extends RoutesNamesList, P extends string">
import type { NuxtRoute, RoutesNamesList } from "@typed-router";
import { NuxtLink } from "#components";

defineProps<{
  speaker: {
    name: string;
    avatarUrl: string;
    affiliation?: string;
    title?: string;
  };
  to?: NuxtRoute<T, P>;
}>();
</script>

<template>
  <li class="speaker">
    <component :is="to ? NuxtLink : 'div'" :to="to" class="speaker-card-link">
      <div class="speaker-image-wrapper">
        <img :src="speaker.avatarUrl" :alt="''" class="speaker-image" />
      </div>
      <p class="speaker-affiliation text-caption">
        {{ speaker.affiliation }}<br v-if="speaker.affiliation && speaker.title" />
        {{ speaker.title }}
      </p>
      <h3 class="speaker-name">
        {{ speaker.name }}
      </h3>
    </component>
  </li>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.speaker {
  width: 100%;

  .speaker-card-link {
    text-decoration: none;
    color: inherit;
  }

  .speaker-image-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--color-divider-light);
  }

  .speaker-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .speaker-affiliation {
    margin: 1rem 0 0;
    @media (--mobile) {
      margin: 0.75rem 0 0;
    }
  }

  .speaker-name {
    font-size: 18px;
    line-height: 1.5;
    margin: 0.25rem 0 0;
    transition: color 0.2s;
    @media (--mobile) {
      font-size: 16px;
    }
  }

  @media (any-hover: hover) {
    .speaker-card-link:hover .speaker-image {
      transform: scale(1.05);
    }

    .speaker-card-link:hover .speaker-name {
      color: var(--color-base);
    }
  }
}
</style>
