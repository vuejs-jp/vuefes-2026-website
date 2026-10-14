<script setup lang="ts">
const { names } = defineProps<{
  /** 掲載順にならんだ個人スポンサーの表示名 */
  names: string[];
}>();
</script>

<template>
  <ul class="individual-sponsor-names">
    <li v-for="(name, index) in names" :key="`${index}-${name}`" class="individual-sponsor-name">
      {{ name }}
    </li>
  </ul>
</template>

<style scoped>
.individual-sponsor-names {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0;
}

.individual-sponsor-name {
  overflow-wrap: anywhere;
}
</style>
