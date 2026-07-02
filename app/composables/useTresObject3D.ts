import * as THREE from "three";

export function useTresObject3D() {
  function disposeObject3D(object: THREE.Object3D | null | undefined) {
    if (!object) return;

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          for (const material of child.material) {
            material.dispose();
          }
        } else {
          child.material?.dispose();
        }
      }

      if (child instanceof THREE.Line) {
        child.geometry?.dispose();
        child.material?.dispose();
      }
    });

    if (object.parent) {
      object.parent.remove(object);
    }
  }

  return { disposeObject3D };
}
