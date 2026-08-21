import { ref, toRef, watch } from "vue";

import { useTresCamera } from "~/composables/useTresCamera";
import { useTresObject3D } from "~/composables/useTresObject3D";
import { useWithBase } from "~/composables/useWithBase";

import { NAME_BADGE_PREVIEW_CAMERA_TUNING } from "./constant";
import { createInteractionModel } from "./interaction/createInteractionModel";
import { createLayoutModel } from "./layout/createLayoutModel";
import { createSceneModel } from "./scene/createSceneModel";
import { createTextureModel } from "./texture/createTextureModel";
import type { NameBadgePreviewProps, NameBadgePreviewPropRefs } from "./types";

/**
 * Drives the interactive name badge preview: a badge on a lanyard that hangs,
 * swings and can be dragged around.
 *
 * The work is split into four models, each in its own directory, wired together
 * here. They form a one-way chain — each reads from the ones before it, and
 * none reads back:
 *
 * 1. `layout/` derives every size and anchor from the props. Pure computeds.
 * 2. `interaction/` turns pointer events into rope physics and camera parallax.
 *    Reads the layout.
 * 3. `texture/` paints the badge face onto canvases and generates the surface
 *    maps. Reads the layout and the props.
 * 4. `scene/` builds the THREE scene and drives it from the simulation each
 *    frame. Reads all three.
 *
 * Splitting it this way keeps the physics and the drawing maths free of both
 * Vue and THREE, which is what makes them testable.
 *
 * @param props The component's props. Converted to refs so the models can track
 * them individually.
 * @returns The bindings the component's template needs.
 */
export function useNameBadgePreview(props: NameBadgePreviewProps) {
  const propRefs: NameBadgePreviewPropRefs = {
    userRole: toRef(props, "userRole"),
    name: toRef(props, "name"),
    avatarImageUrl: toRef(props, "avatarImageUrl"),
    lang: toRef(props, "lang"),
    width: toRef(props, "width"),
    height: toRef(props, "height"),
    aspectRatio: toRef(props, "aspectRatio"),
  };

  /** The element the canvas is mounted into; also the pointer event target. */
  const stageRef = ref<HTMLElement | null>(null);

  const { applyActiveCameraSettings, setRangeMotionFromNormalized, resetRangeMotion } =
    useTresCamera(NAME_BADGE_PREVIEW_CAMERA_TUNING);
  const { disposeObject3D } = useTresObject3D();

  const layout = createLayoutModel({
    props: propRefs,
    stageRef,
    withBase: useWithBase(),
  });
  const interaction = createInteractionModel({ stageRef, layout });
  const texture = createTextureModel({ layout, props: propRefs });
  const scene = createSceneModel({
    layout,
    interaction,
    texture,
    applyActiveCameraSettings,
    setRangeMotionFromNormalized,
    resetRangeMotion,
    disposeObject3D,
  });

  watchCardSize();
  watchBadgeFaceInputs();

  return {
    stageRef,
    stageStyle: layout.stageStyle,
    fallbackImageUrl: texture.fallbackImageUrl,
    handleStagePointerMove: interaction.handleStagePointerMove,
    handleStagePointerDown: interaction.handleStagePointerDown,
    handleStagePointerUp: interaction.handleStagePointerUp,
    handleStagePointerLeave: interaction.handleStagePointerLeave,
    handleCanvasReady: scene.handleCanvasReady,
    handleCanvasLoop: scene.handleCanvasLoop,
  };

  /**
   * Rebuilds the card whenever its dimensions change.
   *
   * The slot and corner radius are absolute sizes, so the mesh cannot simply be
   * scaled. The simulation is reset to `rest` at the same time, so a resize
   * settles the badge rather than flinging it, and the texture is redrawn
   * because its resolution follows the aspect ratio.
   */
  function watchCardSize() {
    watch(
      [layout.resolvedCardWidth, layout.resolvedCardHeight, layout.resolvedAspect],
      () => {
        if (!scene.isThreeReady.value) return;

        scene.rebuildCardMesh();
        interaction.resetSimulation("rest");
        void texture.redrawFrontTexture();
      },
      { flush: "post" },
    );
  }

  /** Repaints the badge face whenever anything printed on it changes. */
  function watchBadgeFaceInputs() {
    watch(
      () => [
        layout.variants.value.baseImageUrl,
        layout.variants.value.avatarPlaceholderImageUrl,
        propRefs.avatarImageUrl.value,
        propRefs.name.value,
        propRefs.lang.value,
        propRefs.userRole.value,
      ],
      () => {
        if (!scene.isThreeReady.value) return;
        void texture.redrawFrontTexture();
      },
      { deep: true, flush: "post" },
    );
  }
}
