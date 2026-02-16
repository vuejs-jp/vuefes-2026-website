<script setup lang="ts">
import { onBeforeUnmount, shallowRef, useId, useTemplateRef, watch } from "vue";

export interface VFFile {
  displayName: string;
  name: string;
  objectURL: string;
  type: string;
}

const props = defineProps<{
  modelValue?: VFFile;
  errorMessage?: string;
  invalid?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: VFFile];
}>();

const id = useId();
const descriptionId = useId();

const file = shallowRef<VFFile | null>(null);
const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef");

function revokeObjectURL(target: VFFile | null | undefined) {
  if (!target?.objectURL) return;
  URL.revokeObjectURL(target.objectURL);
}

function handleFileSelect(ev: Event) {
  const input = ev.target;
  if (!(input instanceof HTMLInputElement)) return;
  const selected = input.files?.[0];
  if (!selected) return;

  revokeObjectURL(file.value);

  const vfFile: VFFile = {
    displayName: selected.name,
    name: selected.name,
    objectURL: URL.createObjectURL(selected),
    type: selected.type,
  };

  file.value = vfFile;
  emit("update:modelValue", vfFile);
}

function openFilePicker() {
  fileInputRef.value?.click();
}

watch(
  () => props.modelValue,
  (v) => {
    if (file.value?.objectURL !== v?.objectURL) {
      revokeObjectURL(file.value);
    }
    file.value = v ?? null;
  },
  { immediate: true, deep: true },
);

onBeforeUnmount(() => {
  revokeObjectURL(file.value);
});
</script>

<template>
  <div class="vf-file-input">
    <label v-if="label" :for="id">{{ label }}</label>

    <div class="file-upload-wrapper">
      <div class="image-preview">
        <img v-if="file" :src="file.objectURL" alt="Image" />
        <div v-else class="image-placeholder">
          <img src="/images/image-preview-placeholder.svg" alt="" />
        </div>
      </div>

      <input
        :id="id"
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="file-input-hidden"
        :aria-describedby="descriptionId"
        @change="handleFileSelect"
      />
      <button type="button" class="input-box" @click="openFilePicker">
        <span v-if="file?.displayName">{{ file.displayName }}</span>
        <span v-else>{{ placeholder }}</span>
      </button>
    </div>
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

.vf-file-input {
  label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .file-upload-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;

    .image-preview {
      width: 64px;
      height: 64px;
      border-radius: 0.5rem;
      border: 1px solid var(--color-divider);
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 13.3px 8.67px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .file-input-hidden {
      display: none;
    }

    img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .input-box {
      appearance: none;
      font: inherit;
      color: inherit;
      width: 352px;
      padding: 1rem 0.5rem;
      border: 1px solid var(--color-divider);
      border-radius: 0.5rem;
      cursor: pointer;
      background-color: var(--color-background-secondary);
      text-align: start;

      @media (--mobile) {
        width: 130px;
      }

      &:focus {
        border-color: var(--color-primary);
      }

      @media (any-hover: hover) {
        &:hover {
          border-color: var(--color-primary);
        }
      }
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
}
</style>
