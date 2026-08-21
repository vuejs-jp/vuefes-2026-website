import * as THREE from "three";

import { NAME_BADGE_PREVIEW_SCENE_TUNING } from "../constant";
import type { CameraMotionSnapshot } from "../interaction/cameraMotionTracker";

export type HighlightLightController = {
  /** Repositions `light` for the current pointer position. Call once per frame. */
  update: (
    light: THREE.PointLight,
    cardPivot: THREE.Object3D,
    camera: THREE.Camera,
    cameraMotion: CameraMotionSnapshot,
  ) => void;
};

/**
 * Moves a point light so its specular highlight tracks the pointer across the
 * card.
 *
 * A fixed light would put the highlight in the same place forever, which makes
 * the laminate read as printed-on shading rather than as a reflection. Instead
 * the pointer is projected onto the card's plane and the light is placed on the
 * segment between the camera and that point — close enough to the surface for
 * the falloff to give a tight highlight, far enough that it does not burn out into a hard spot.
 *
 * The card's plane is recomputed each frame from its current transform, so the
 * highlight stays anchored to the surface as the badge swings.
 *
 * All scratch objects are allocated once and reused: this runs every frame, and
 * allocating vectors here would be a steady source of GC pressure.
 */
export function createHighlightLightController(): HighlightLightController {
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const plane = new THREE.Plane();
  const planeNormal = new THREE.Vector3();
  const planePoint = new THREE.Vector3();
  const planeQuaternion = new THREE.Quaternion();
  const intersection = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();

  return {
    update(light, cardPivot, camera, cameraMotion) {
      // The parallax offset is already normalized to [-1, 1], which is exactly
      // the normalized device coordinate space the raycaster expects.
      pointerNdc.set(cameraMotion.normalizedX, cameraMotion.normalizedY);
      raycaster.setFromCamera(pointerNdc, camera);

      cardPivot.updateWorldMatrix(true, false);
      cardPivot.getWorldPosition(planePoint);
      cardPivot.getWorldQuaternion(planeQuaternion);
      planeNormal.set(0, 0, 1).applyQuaternion(planeQuaternion).normalize();
      plane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);

      // Misses when the card is edge-on to the camera; leaving the light where
      // it was is the right call, since there is no visible face to light.
      if (!raycaster.ray.intersectPlane(plane, intersection)) return;

      camera.getWorldPosition(cameraPosition);
      light.position
        .copy(cameraPosition)
        .lerp(intersection, NAME_BADGE_PREVIEW_SCENE_TUNING.highlightLightRayDepthRatio);
    },
  };
}
