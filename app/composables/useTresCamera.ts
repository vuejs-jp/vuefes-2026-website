import type { TresContext, TresContextWithClock } from "@tresjs/core";
import * as THREE from "three";

type TresCameraContext = TresContext | TresContextWithClock;

export type TresPerspectiveCameraTuning = {
  position: readonly [number, number, number];
  lookAt: readonly [number, number, number];
  rangeOfMotion?: readonly [number, number, number];
  rangeMotionSmoothing?: number;
  fov: number;
  near: number;
  far: number;
};

export function useTresCamera(tuning: TresPerspectiveCameraTuning) {
  const rangeTarget = new THREE.Vector3();
  const rangeCurrent = new THREE.Vector3();

  const rangeOfMotion = tuning.rangeOfMotion ?? [0, 0, 0];
  const rangeMotionSmoothing = tuning.rangeMotionSmoothing ?? 7;

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  function setRangeMotionFromNormalized(x: number, y: number, z = 0) {
    rangeTarget.set(
      clamp(x, -1, 1) * rangeOfMotion[0],
      clamp(y, -1, 1) * rangeOfMotion[1],
      clamp(z, -1, 1) * rangeOfMotion[2],
    );
  }

  function resetRangeMotion() {
    rangeTarget.set(0, 0, 0);
  }

  function applyActiveCameraSettings(context: TresCameraContext) {
    const activeCamera = context.camera.activeCamera.value;
    if (!activeCamera) return;

    const deltaSeconds = "delta" in context ? context.delta : 1 / 60;
    const factor = 1 - Math.exp(-rangeMotionSmoothing * Math.max(deltaSeconds, 1 / 120));
    rangeCurrent.lerp(rangeTarget, factor);

    activeCamera.position.set(
      tuning.position[0] + rangeCurrent.x,
      tuning.position[1] + rangeCurrent.y,
      tuning.position[2] + rangeCurrent.z,
    );
    activeCamera.near = tuning.near;
    activeCamera.far = tuning.far;
    activeCamera.lookAt(tuning.lookAt[0], tuning.lookAt[1], tuning.lookAt[2]);

    // Avoid instanceof checks: app/Tres can hold different THREE instances.
    if ((activeCamera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const perspectiveCamera = activeCamera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = tuning.fov;
      perspectiveCamera.updateProjectionMatrix();
    } else {
      activeCamera.updateProjectionMatrix();
    }
  }

  return { applyActiveCameraSettings, setRangeMotionFromNormalized, resetRangeMotion };
}
