import * as THREE from "three";

import { NAME_BADGE_ROPE_VISUAL_TUNING } from "../constant";
import { createRopeClothTextures } from "./ropeClothTexture";

export type RopeMeshBundle = {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  /** Centre line of the rope, `(segments + 1) * 3` floats. */
  curvePositions: Float32Array;
  /** Ribbon vertices, `(segments + 1) * 6` floats. Backs `positionAttribute`. */
  ribbonPositions: Float32Array;
  /** Flagged dirty each frame after the ribbon is rewritten. */
  positionAttribute: THREE.BufferAttribute;
  clothTexture: THREE.CanvasTexture | null;
  clothBumpTexture: THREE.CanvasTexture | null;
};

/**
 * Builds the lanyard mesh: a two-vertex-wide triangle strip whose positions are
 * rewritten every frame from the rope simulation.
 *
 * Only the position attribute changes; the UVs and indices are constant, so they
 * are written once here. The position buffer is marked as dynamic to tell the
 * driver to expect per-frame uploads.
 *
 * Frustum culling is disabled: the bounding volume would have to be recomputed
 * every frame to stay correct, and the rope is nearly always on screen anyway.
 */
export function createRopeMesh(): RopeMeshBundle {
  const segments = NAME_BADGE_ROPE_VISUAL_TUNING.ropeSegments;

  const curvePositions = new Float32Array((segments + 1) * 3);
  const ribbonPositions = new Float32Array((segments + 1) * 6);

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(ribbonPositions, 3);
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);

  // `u` runs along the rope so the fabric texture tiles down its length; `v`
  // spans its width.
  const uvs = new Float32Array((segments + 1) * 4);
  for (let i = 0; i <= segments; i += 1) {
    const u = i / segments;
    const uvOffset = i * 4;
    uvs[uvOffset + 0] = u;
    uvs[uvOffset + 1] = 0;
    uvs[uvOffset + 2] = u;
    uvs[uvOffset + 3] = 1;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

  // Two triangles per segment, stitching each pair of vertices to the next.
  const indices = new Uint16Array(segments * 6);
  for (let i = 0; i < segments; i += 1) {
    const base = i * 6;
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;

    indices[base + 0] = a;
    indices[base + 1] = b;
    indices[base + 2] = c;
    indices[base + 3] = b;
    indices[base + 4] = d;
    indices[base + 5] = c;
  }
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const { colorTexture, bumpTexture } = createRopeClothTextures();

  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    map: colorTexture ?? undefined,
    bumpMap: bumpTexture ?? undefined,
    bumpScale: NAME_BADGE_ROPE_VISUAL_TUNING.ropeBumpScale,
    transparent: true,
    opacity: NAME_BADGE_ROPE_VISUAL_TUNING.ropeOpacity,
    roughness: NAME_BADGE_ROPE_VISUAL_TUNING.ropeRoughness,
    metalness: NAME_BADGE_ROPE_VISUAL_TUNING.ropeMetalness,
    // The ribbon has no thickness, so it must be lit from both sides as it twists.
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  return {
    mesh,
    curvePositions,
    ribbonPositions,
    positionAttribute,
    clothTexture: colorTexture,
    clothBumpTexture: bumpTexture,
  };
}
