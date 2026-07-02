<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { useNameBadgePreview, type NameBadgePreviewProps } from "~/composables/useNameBadgePreview";
import * as THREE from "three";

const props = defineProps<NameBadgePreviewProps>();

const {
  stageRef,
  stageStyle,
  fallbackImageUrl,
  handleStagePointerMove,
  handleStagePointerDown,
  handleStagePointerUp,
  handleStagePointerLeave,
  handleCanvasReady,
  handleCanvasLoop,
} = useNameBadgePreview(props);
</script>
<template>
  <div class="name-badge-preview-outer">
    <ClientOnly>
      <div
        ref="stageRef"
        class="name-badge-preview-stage"
        :style="stageStyle"
        @pointerdown="handleStagePointerDown"
        @pointermove="handleStagePointerMove"
        @pointerup="handleStagePointerUp"
        @pointercancel="handleStagePointerUp"
        @pointerleave="handleStagePointerLeave"
      >
        <TresCanvas
          class="name-badge-preview-canvas"
          :alpha="true"
          @ready="handleCanvasReady"
          @loop="handleCanvasLoop"
          :tone-mapping="THREE.NoToneMapping"
          :output-color-space="THREE.SRGBColorSpace"
        />
      </div>

      <template #fallback>
        <div class="name-badge-preview-fallback" :style="stageStyle">
          <img :src="fallbackImageUrl" alt="Name Badge Preview" class="fallback-image" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.name-badge-preview-outer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.name-badge-preview-stage {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.name-badge-preview-canvas {
  width: 100%;
  height: 100%;
}

.name-badge-preview-fallback {
  overflow: hidden;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-image {
  width: min(100%, 360px);
  height: auto;
  object-fit: contain;
}
</style>
