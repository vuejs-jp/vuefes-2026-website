import * as THREE from "three";
import { computed, ref, type ComputedRef } from "vue";

import { NAME_BADGE_PREVIEW_TEXTURE_TUNING } from "../constant";
import type { NameBadgePreviewLayout } from "../layout/createLayoutModel";
import type { NameBadgePreviewPropRefs } from "../types";
import type { Rect } from "./badgeFaceLayout";
import { writeCardSurfaceMaps } from "./cardSurfaceMaps";
import { drawBadgeFace } from "./drawBadgeFace";
import { createImageLoader } from "./imageLoader";

/** Anisotropic filtering level; the card is often viewed at a steep angle. */
const TEXTURE_ANISOTROPY = 8;

/**
 * The three canvas-backed textures that make up the printed face of the card.
 *
 * They are generated at runtime rather than authored, because the face depends
 * on the attendee's name and avatar.
 */
export type NameBadgePreviewTexture = {
  /**
   * Artwork for the non-WebGL fallback `<img>`, kept in sync with whichever
   * badge artwork the texture actually managed to load.
   */
  fallbackImageUrl: ComputedRef<string>;
  /** Creates or resizes the canvases and textures. Safe to call repeatedly. */
  ensureTextureResources: () => void;
  /** Repaints the badge face and the surface maps derived from it. */
  redrawFrontTexture: () => Promise<void>;
  getFrontTexture: () => THREE.CanvasTexture | null;
  getFrontRoughnessTexture: () => THREE.CanvasTexture | null;
  getFrontBumpTexture: () => THREE.CanvasTexture | null;
  disposeTextureResources: () => void;
};

export type NameBadgePreviewTextureDeps = {
  layout: NameBadgePreviewLayout;
  props: NameBadgePreviewPropRefs;
};

/** A canvas paired with the THREE texture that streams it to the GPU. */
type TextureSlot = {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture | null;
};

function createEmptySlot(): TextureSlot {
  return { canvas: null, context: null, texture: null };
}

/**
 * Owns the canvas textures painted onto the front of the card.
 *
 * All work here is client only: on the server the slots stay empty and
 * {@link NameBadgePreviewTexture.redrawFrontTexture} resolves without painting,
 * so the component renders its static fallback image instead.
 */
export function createTextureModel(deps: NameBadgePreviewTextureDeps): NameBadgePreviewTexture {
  const { layout, props } = deps;

  const loadImage = createImageLoader();

  /** Color map: badge artwork, avatar and text. */
  const front = createEmptySlot();
  /** Roughness map: which parts of the laminate are glossy. */
  const roughness = createEmptySlot();
  /** Bump map: the paper grain. */
  const bump = createEmptySlot();

  /** Whether the role's own artwork failed and the default one was used. */
  const isBaseImageFallback = ref(false);

  /**
   * Incremented on every redraw; a draw holding an older token has been
   * superseded and must not paint.
   */
  let drawToken = 0;

  const fallbackImageUrl = computed(() =>
    isBaseImageFallback.value ? layout.defaultBaseImageUrl : layout.variants.value.baseImageUrl,
  );

  return {
    fallbackImageUrl,
    ensureTextureResources,
    redrawFrontTexture,
    getFrontTexture: () => front.texture,
    getFrontRoughnessTexture: () => roughness.texture,
    getFrontBumpTexture: () => bump.texture,
    disposeTextureResources,
  };

  function ensureTextureResources() {
    if (!import.meta.client) return;

    // Texture height is fixed and the width follows the card's aspect ratio, so
    // the printed face keeps a constant pixel density however the card is sized.
    const height = NAME_BADGE_PREVIEW_TEXTURE_TUNING.textureHeight;
    const width = Math.max(
      NAME_BADGE_PREVIEW_TEXTURE_TUNING.textureMinWidth,
      Math.round(height * layout.resolvedAspect.value),
    );

    // The face keeps its alpha so transparent regions of the artwork stay
    // transparent; the surface maps are opaque grayscale.
    ensureSlot(front, width, height, { alpha: true, colorSpace: THREE.SRGBColorSpace });
    ensureSlot(roughness, width, height, { alpha: false });
    ensureSlot(bump, width, height, { alpha: false });
  }

  function ensureSlot(
    slot: TextureSlot,
    width: number,
    height: number,
    options: { alpha: boolean; colorSpace?: THREE.ColorSpace },
  ) {
    slot.canvas ??= document.createElement("canvas");

    if (slot.canvas.width !== width || slot.canvas.height !== height) {
      slot.canvas.width = width;
      slot.canvas.height = height;
    }

    slot.context = slot.canvas.getContext("2d", { alpha: options.alpha });

    if (!slot.texture) {
      slot.texture = new THREE.CanvasTexture(slot.canvas);
      if (options.colorSpace) {
        slot.texture.colorSpace = options.colorSpace;
      }
      slot.texture.anisotropy = TEXTURE_ANISOTROPY;
    }
  }

  async function redrawFrontTexture() {
    ensureTextureResources();

    const canvas = front.canvas;
    const context = front.context;
    const texture = front.texture;
    if (!canvas || !context || !texture) return;

    const token = ++drawToken;
    const width = canvas.width;
    const height = canvas.height;

    const variant = layout.variants.value;
    const result = await drawBadgeFace(
      context,
      { width, height },
      {
        userRole: props.userRole.value,
        name: props.name.value,
        lang: props.lang.value,
        color: variant.color,
        nameScaleX: layout.nameScaleX.value,
        baseImageUrls: [variant.baseImageUrl, layout.defaultBaseImageUrl],
        avatarImageUrls: [props.avatarImageUrl.value, variant.avatarPlaceholderImageUrl].filter(
          (url): url is string => !!url,
        ),
      },
      {
        loadImage,
        isStale: () => token !== drawToken,
        onBaseImageFallback: (value) => {
          isBaseImageFallback.value = value;
        },
      },
    );

    // Superseded by a newer draw; the newer one owns the canvas now.
    if (!result) return;

    texture.needsUpdate = true;
    redrawSurfaceMaps(width, height, result.avatar);
  }

  /**
   * Regenerates the roughness and bump maps.
   *
   * They depend on the badge face only through the avatar position, so they are
   * rebuilt alongside it rather than on their own schedule.
   */
  function redrawSurfaceMaps(width: number, height: number, avatar: Rect) {
    const roughnessContext = roughness.context;
    const bumpContext = bump.context;
    if (!roughnessContext || !bumpContext) return;

    const roughnessImageData = roughnessContext.createImageData(width, height);
    const bumpImageData = bumpContext.createImageData(width, height);

    writeCardSurfaceMaps({
      roughnessData: roughnessImageData.data,
      bumpData: bumpImageData.data,
      width,
      height,
      avatar,
    });

    roughnessContext.putImageData(roughnessImageData, 0, 0);
    bumpContext.putImageData(bumpImageData, 0, 0);

    if (roughness.texture) roughness.texture.needsUpdate = true;
    if (bump.texture) bump.texture.needsUpdate = true;
  }

  function disposeTextureResources() {
    for (const slot of [front, roughness, bump]) {
      slot.texture?.dispose();
      slot.texture = null;
      slot.canvas = null;
      slot.context = null;
    }
  }
}
