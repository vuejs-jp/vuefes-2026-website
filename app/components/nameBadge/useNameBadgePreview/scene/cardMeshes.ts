import * as THREE from "three";

import {
  NAME_BADGE_CARD_SURFACE_TUNING,
  NAME_BADGE_PREVIEW_WORLD_TUNING,
  NAME_BADGE_ROPE_VISUAL_TUNING,
  NAME_BADGE_SLOT_TUNING,
} from "../constant";
import { createRoundedRectPath, createRoundedRectShape } from "../shared/roundedRect";
import { remapCardUvToRect } from "./cardUv";
import type { WorldProjection } from "./worldProjection";

/** Color of the card's extruded edge: the pale core of laminated stock. */
const CARD_EDGE_COLOR = "#aeb2bb";

/**
 * The four meshes that make up the badge, all parented to the card pivot.
 *
 * They are separate meshes rather than one because each needs a different
 * material and draw order.
 */
export type CardMeshes = {
  /** The card itself: an extruded rounded rectangle with the slot punched out. */
  card: THREE.Mesh<THREE.ExtrudeGeometry, THREE.Material[]>;
  /** Transparent laminate layer floating just in front of the printed face. */
  surface: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshPhysicalMaterial>;
  /** Dark ring around the slot, standing in for the punched edge. */
  slotRim: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
  /** Short strap stub behind the slot, so the lanyard reads as threaded through. */
  strapThrough: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | null;
};

export type CardMeshesParams = {
  /** Card width divided by card height. */
  aspect: number;
  /** Distance from the card's top edge to the strap slot, in stage pixels. */
  attachOffsetPx: number;
  /** Rope rest length in stage pixels, used to scale the strap stub's UVs. */
  ropeRestLengthPx: number;
  projection: WorldProjection;
  /** Printed face of the badge. */
  frontTexture: THREE.CanvasTexture;
  frontRoughnessTexture: THREE.CanvasTexture | null;
  frontBumpTexture: THREE.CanvasTexture | null;
  /**
   * Material of the rendered rope. Cloned for the strap stub so it shares the
   * fabric texture; `null` before the rope mesh exists, in which case no stub
   * is created.
   */
  ropeMaterial: THREE.MeshStandardMaterial | null;
};

/**
 * Builds the badge geometry for the current card size.
 *
 * The card is rebuilt rather than rescaled whenever its dimensions change,
 * because the slot and the corner radius are absolute sizes: scaling a single
 * mesh would stretch them along with the card.
 *
 * The result is not parented; the caller adds the meshes to the card pivot.
 */
export function createCardMeshes(params: CardMeshesParams): CardMeshes {
  const { projection } = params;

  const cardHeightWorld = NAME_BADGE_PREVIEW_WORLD_TUNING.cardHeightWorld;
  const cardWidthWorld = cardHeightWorld * params.aspect;
  const cardDepthWorld = NAME_BADGE_PREVIEW_WORLD_TUNING.cardDepthWorld;
  const cardCornerRadiusWorld = Math.min(
    NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerRadiusWorld,
    cardWidthWorld * 0.5,
    cardHeightWorld * 0.5,
  );

  // The slot is sized from the rope so the lanyard always fits through it.
  const ropeWidthPx = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWidthPx;
  const slotWidthWorld = projection.toWorldSize(
    ropeWidthPx * NAME_BADGE_SLOT_TUNING.widthToRopeRatio,
  );
  const slotHeightWorld = projection.toWorldSize(
    ropeWidthPx * NAME_BADGE_SLOT_TUNING.heightToRopeRatio,
  );
  const slotCenterY = cardHeightWorld * 0.5 - projection.toWorldSize(params.attachOffsetPx);

  const shape = createRoundedRectShape(cardWidthWorld, cardHeightWorld, cardCornerRadiusWorld);
  shape.holes.push(
    createRoundedRectPath(slotWidthWorld, slotHeightWorld, slotHeightWorld * 0.5, 0, slotCenterY),
  );

  const card = createCardMesh();
  const surface = createSurfaceMesh();
  const slotRim = createSlotRimMesh();
  const strapThrough = createStrapThroughMesh();

  return { card, surface, slotRim, strapThrough };

  function createCardMesh() {
    // `ExtrudeGeometry` assigns material index 0 to the caps and 1 to the sides,
    // so the printed face and the paper edge can be textured separately.
    const capMaterial = new THREE.MeshBasicMaterial({
      map: params.frontTexture,
      transparent: true,
    });
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: CARD_EDGE_COLOR,
      roughness: 0.86,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: cardDepthWorld,
      bevelEnabled: false,
      steps: 1,
      curveSegments: NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerSegments,
    });
    remapCardUvToRect(geometry, cardWidthWorld, cardHeightWorld);
    // Extrusion grows along +z from the shape's plane; recenter it on the pivot.
    geometry.translate(0, 0, -cardDepthWorld * 0.5);

    const mesh = new THREE.Mesh(geometry, [capMaterial, sideMaterial]);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    return mesh;
  }

  /**
   * The laminate: a black additive layer whose visibility comes entirely from
   * the bump and roughness maps, so it contributes sheen without tinting the
   * artwork underneath.
   */
  function createSurfaceMesh() {
    const geometry = new THREE.ShapeGeometry(
      shape,
      NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerSegments,
    );
    remapCardUvToRect(geometry, cardWidthWorld, cardHeightWorld);
    geometry.translate(
      0,
      0,
      cardDepthWorld * 0.5 + NAME_BADGE_CARD_SURFACE_TUNING.surfaceLayerOffsetWorld,
    );

    const material = new THREE.MeshPhysicalMaterial({
      color: "#000000",
      transparent: true,
      opacity: NAME_BADGE_CARD_SURFACE_TUNING.surfaceLayerOpacity,
      alphaMap: params.frontBumpTexture ?? params.frontRoughnessTexture ?? undefined,
      roughness: NAME_BADGE_CARD_SURFACE_TUNING.baseRoughness,
      roughnessMap: params.frontRoughnessTexture ?? undefined,
      bumpMap: params.frontBumpTexture ?? undefined,
      bumpScale: NAME_BADGE_CARD_SURFACE_TUNING.bumpScale,
      metalness: 0.02,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      // Transparent overlay: it must not occlude the face it sits on.
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 1;
    return mesh;
  }

  function createSlotRimMesh() {
    const rimWidthWorld = projection.toWorldSize(
      ropeWidthPx * NAME_BADGE_SLOT_TUNING.rimWidthToRopeRatio,
    );
    // A slot-shaped ring: an outset outline with the slot itself as a hole.
    const rimShape = createRoundedRectShape(
      slotWidthWorld + rimWidthWorld * 2,
      slotHeightWorld + rimWidthWorld * 2,
      slotHeightWorld * 0.5 + rimWidthWorld,
    );
    rimShape.holes.push(
      createRoundedRectPath(slotWidthWorld, slotHeightWorld, slotHeightWorld * 0.5, 0, 0),
    );

    const geometry = new THREE.ShapeGeometry(
      rimShape,
      NAME_BADGE_PREVIEW_WORLD_TUNING.cardCornerSegments,
    );
    const material = new THREE.MeshBasicMaterial({
      color: NAME_BADGE_SLOT_TUNING.rimColor,
      transparent: true,
      opacity: NAME_BADGE_SLOT_TUNING.rimOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Twice the laminate offset, so the rim sits in front of it.
    mesh.position.set(
      0,
      slotCenterY,
      cardDepthWorld * 0.5 + NAME_BADGE_CARD_SURFACE_TUNING.surfaceLayerOffsetWorld * 2,
    );
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 2;
    return mesh;
  }

  /**
   * A small quad behind the slot carrying the same fabric texture as the rope.
   *
   * The simulated rope stops at the slot, so without this the lanyard would
   * appear to be glued to the front of the card rather than threaded through it.
   */
  function createStrapThroughMesh() {
    if (!params.ropeMaterial) return null;

    const passThroughLengthPx = ropeWidthPx * NAME_BADGE_SLOT_TUNING.passThroughLengthToRopeRatio;
    const geometry = new THREE.PlaneGeometry(
      projection.toWorldSize(ropeWidthPx),
      projection.toWorldSize(passThroughLengthPx),
    );

    // The rope's texture runs `u` along its length and `v` across it, while a
    // plane's UVs are the other way round. Swapping them, and mapping `u` to the
    // very end of the rope, continues the weave seamlessly into the slot.
    const uvs = geometry.getAttribute("uv");
    for (let i = 0; i < uvs.count; i += 1) {
      const acrossRope = uvs.getX(i);
      const alongRope = uvs.getY(i);
      uvs.setXY(
        i,
        1 + (alongRope - 0.5) * (passThroughLengthPx / params.ropeRestLengthPx),
        acrossRope,
      );
    }
    uvs.needsUpdate = true;

    const material = params.ropeMaterial.clone();
    material.side = THREE.DoubleSide;

    const mesh = new THREE.Mesh(geometry, material);
    // Slightly behind the card, so the card hides everything but the slot.
    mesh.position.set(0, slotCenterY, -cardDepthWorld * 0.2);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    return mesh;
  }
}

/**
 * Removes the card meshes from `parent` and releases their GPU resources.
 *
 * Geometries and materials are not reference counted by THREE, so every rebuild
 * has to dispose the previous set or the buffers leak for the page's lifetime.
 */
export function disposeCardMeshes(parent: THREE.Object3D, meshes: CardMeshes | null) {
  if (!meshes) return;

  for (const mesh of [meshes.card, meshes.surface, meshes.slotRim, meshes.strapThrough]) {
    if (!mesh) continue;

    parent.remove(mesh);
    mesh.geometry.dispose();

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      material.dispose();
    }
  }
}
