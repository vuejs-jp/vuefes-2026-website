<script setup lang="ts">
import { onUnmounted, useId, useTemplateRef, watchPostEffect } from "vue";
import { VFButton, VFHeading } from "#components";
import { useI18n } from "#imports";

const props = defineProps<{
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
  confirm: [];
  cancel: [];
}>();

const { locale: lang } = useI18n();
const dialogRef = useTemplateRef<HTMLDialogElement>("dialog");
const dialogId = useId();
const titleId = `vf-confirm-dialog-title-${dialogId}`;
const descriptionId = `vf-confirm-dialog-description-${dialogId}`;

watchPostEffect(() => {
  const dialog = dialogRef.value;
  if (!dialog) {
    return;
  }

  if (props.open && !dialog.open) {
    dialog.showModal();
  } else if (!props.open && dialog.open) {
    dialog.close();
  }
});

onUnmounted(() => {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
});

function handleDialogCancel() {
  emit("cancel");
  emit("update:open", false);
}

function close() {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
  emit("update:open", false);
}

function cancel() {
  emit("cancel");
  close();
}

function confirm() {
  emit("confirm");
  close();
}
</script>

<template>
  <dialog
    ref="dialog"
    class="vf-confirm-dialog"
    role="alertdialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    :lang
    @cancel="handleDialogCancel"
  >
    <div class="vf-confirm-dialog-content">
      <div :id="titleId">
        <VFHeading>
          {{ title }}
        </VFHeading>
      </div>

      <p :id="descriptionId" class="vf-confirm-dialog-description">
        {{ description }}
      </p>

      <div class="vf-confirm-dialog-actions">
        <VFButton class="vf-confirm-dialog-action" outlined autofocus @click="cancel">
          {{ cancelLabel }}
        </VFButton>
        <VFButton class="vf-confirm-dialog-action" @click="confirm">
          {{ confirmLabel }}
        </VFButton>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.vf-confirm-dialog {
  width: min(calc(100% - 2rem), 34rem);
  max-width: none;
  padding: 0;
  border: 1px solid var(--color-divider-light);
  border-radius: var(--radius-m);
  background-color: var(--color-white);
  color: var(--color-text-default);
  overflow: hidden;

  &::backdrop {
    background-color: rgba(51, 51, 51, 0.48);
    backdrop-filter: blur(4px);
  }
}

.vf-confirm-dialog-content {
  padding: 2.5rem 3.5rem 3rem;

  @media (--mobile) {
    padding: 2rem 1.5rem;
  }
}

.vf-confirm-dialog-description {
  margin-top: 1.5rem;
  line-height: 1.7;
}

.vf-confirm-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  @media (--mobile-small) {
    flex-direction: column;

    :deep(.vf-confirm-dialog-action) {
      width: 100%;
    }
  }
}

:deep(.vf-confirm-dialog-action:focus-visible) {
  outline: 2px solid var(--color-base);
  outline-offset: 3px;
}
</style>
