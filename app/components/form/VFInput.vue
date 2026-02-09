<script setup lang="ts">
import { useId } from "vue";

import { useI18n } from "#imports";

defineProps<{
  modelValue?: string;
  errorMessage?: string;
  invalid?: boolean;
  description?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [];
}>();

const id = useId();
const descriptionId = useId();
const { locale: lang } = useI18n();
</script>

<template>
  <div>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="$attrs.label" :for="id" :lang>{{ $attrs.label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      :aria-describedby="descriptionId"
      :value="modelValue"
      :class="{ invalid }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <p v-if="description" class="description text-caption">
      {{ description }}
    </p>
    <p
      v-if="invalid"
      :id="descriptionId"
      class="error-message text-caption"
      :aria-hidden="!invalid"
    >
      <span v-if="invalid">
        {{ errorMessage }}
      </span>
    </p>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-divider);
  border-radius: 0.5rem;
  @media (--mobile) {
    font-size: 0.875rem;
  }

  &::placeholder {
    color: var(--color-place-holder);
  }

  &:enabled:focus {
    border-color: var(--color-primary);
    &.invalid {
      border-color: var(--color-alert);
    }
  }

  &:focus-visible {
    outline: transparent;
  }

  @media (any-hover: hover) {
    &:enabled:hover {
      border-color: var(--color-primary);
      &.invalid {
        border-color: var(--color-alert);
      }
    }
  }

  &.invalid {
    border-color: var(--color-alert);
    &::placeholder {
      color: var(--color-place-holder);
    }
  }
}

label {
  display: block;
  color: var(--color-text-default);
  margin-bottom: 0.25rem;

  &[lang="ja"],
  &[lang="ja-JP"] {
    font-family: IBMPlexSansJP-SemiBold;
  }

  &[lang="en"],
  &[lang="en-US"] {
    font-family: JetBrainsMono-Bold;
  }
}

.description {
  margin-top: 0.5rem;
  margin-bottom: 0rem;
}

.error-message {
  color: var(--color-alert);
  margin: 0.5rem 0;

  /* align to text-caption line-height */
  min-height: 19px;
  @media (--mobile) {
    line-height: 17px;
  }
}
</style>
