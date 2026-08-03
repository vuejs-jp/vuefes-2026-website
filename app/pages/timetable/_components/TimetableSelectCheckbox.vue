<script setup lang="ts">
defineProps<{
  label: string;
  accessibleLabel: string;
  checked: boolean;
  indeterminate?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <label class="my-timetable-checkbox">
    <span class="label-text" aria-hidden="true">
      {{ label }}
    </span>
    <input
      type="checkbox"
      :checked="checked"
      :indeterminate="indeterminate"
      :aria-checked="indeterminate ? 'mixed' : checked"
      :aria-label="accessibleLabel"
      @change="emit('toggle')"
    />
  </label>
</template>

<style scoped>
.my-timetable-checkbox {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  min-width: 0;
  min-height: 32px;
  max-width: 100%;
  padding: 4px 6px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.42);
  cursor: pointer;

  input {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--color-base);
    cursor: inherit;
  }
}

.label-text {
  min-width: 0;
  color: var(--color-text-default);
  font-family: IBMPlexSansJP-Bold;
  font-size: 12px;
  line-height: 1.25;
  white-space: nowrap;
  text-align: right;
}
</style>
