<script setup lang="ts">
defineProps({
  plan: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <span :class="`sponsor-tag sponsor-tag--${plan.toLowerCase()}`">
    {{
      $t(
        `sponsors.${plan.toLowerCase().replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())}Sponsor`,
      )
    }}
  </span>
</template>

<style scoped>
.sponsor-tag {
  display: inline flex;
  align-items: center;
  padding: 0 8px;
  height: 36px;
  border-radius: 8px;
  background: #fae8e4;
}

.sponsor-tag--platinum {
  background: linear-gradient(
    270deg,
    #eeeeee 0%,
    #c6c6c6 25%,
    #eeeeee 50%,
    #eeeeee 75%,
    #c6c6c6 100%
  );
}

.sponsor-tag--gold {
  background: #dbd69a;
}

.sponsor-tag--silver {
  background: #e2e4ec;
}

.sponsor-tag--bronze {
  background: #dda25b;
}

.sponsor-tag--creative {
  background: #fae8e4;
}
</style>
