import * as THREE from "three";
import { describe, expect, it } from "vite-plus/test";
import { remapCardUvToRect } from "./cardUv";

const CARD_WIDTH = 2;
const CARD_HEIGHT = 4;

/** Reads the UV pair written for the vertex at `index`. */
function uvAt(geometry: THREE.BufferGeometry, index: number) {
  const uv = geometry.getAttribute("uv");
  return { u: uv.getX(index), v: uv.getY(index) };
}

/** Finds the vertex closest to a position, so tests can name corners. */
function vertexIndexAt(geometry: THREE.BufferGeometry, x: number, y: number) {
  const position = geometry.getAttribute("position");
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < position.count; i += 1) {
    const distance = Math.hypot(position.getX(i) - x, position.getY(i) - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }

  return best;
}

describe("remapCardUvToRect", () => {
  it("maps the card's corners onto the corners of the texture", () => {
    const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
    remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT);

    const bottomLeft = vertexIndexAt(geometry, -CARD_WIDTH / 2, -CARD_HEIGHT / 2);
    const topRight = vertexIndexAt(geometry, CARD_WIDTH / 2, CARD_HEIGHT / 2);

    expect(uvAt(geometry, bottomLeft)).toEqual({ u: 0, v: 0 });
    expect(uvAt(geometry, topRight)).toEqual({ u: 1, v: 1 });
  });

  it("maps the centre of the card to the centre of the texture", () => {
    const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 2, 2);
    remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT);

    const center = vertexIndexAt(geometry, 0, 0);
    expect(uvAt(geometry, center)).toEqual({ u: 0.5, v: 0.5 });
  });

  it("clamps vertices that sit outside the card rectangle", () => {
    // A geometry wider than the card stands in for the extruded side walls.
    const geometry = new THREE.PlaneGeometry(CARD_WIDTH * 4, CARD_HEIGHT * 4);
    remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT);

    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < uv.count; i += 1) {
      expect(uv.getX(i)).toBeGreaterThanOrEqual(0);
      expect(uv.getX(i)).toBeLessThanOrEqual(1);
      expect(uv.getY(i)).toBeGreaterThanOrEqual(0);
      expect(uv.getY(i)).toBeLessThanOrEqual(1);
    }
  });

  it("undoes the distortion a shape geometry would otherwise introduce", () => {
    // `ShapeGeometry` derives UVs from raw vertex positions, so they run well
    // outside [0, 1] for a shape centred on the origin.
    const shape = new THREE.Shape()
      .moveTo(-CARD_WIDTH / 2, -CARD_HEIGHT / 2)
      .lineTo(CARD_WIDTH / 2, -CARD_HEIGHT / 2)
      .lineTo(CARD_WIDTH / 2, CARD_HEIGHT / 2)
      .lineTo(-CARD_WIDTH / 2, CARD_HEIGHT / 2);
    const geometry = new THREE.ShapeGeometry(shape);

    const before = geometry.getAttribute("uv");
    let hadOutOfRange = false;
    for (let i = 0; i < before.count; i += 1) {
      if (before.getX(i) < 0 || before.getY(i) < 0) hadOutOfRange = true;
    }
    expect(hadOutOfRange).toBe(true);

    remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT);

    const bottomLeft = vertexIndexAt(geometry, -CARD_WIDTH / 2, -CARD_HEIGHT / 2);
    expect(uvAt(geometry, bottomLeft)).toEqual({ u: 0, v: 0 });
  });

  it("flags the attribute so the change reaches the GPU", () => {
    const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
    const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
    const versionBefore = uv.version;

    remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT);

    expect(uv.version).toBeGreaterThan(versionBefore);
  });

  it("does nothing for a geometry without UVs", () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 1, 0, 2, 2, 0]), 3),
    );

    expect(() => remapCardUvToRect(geometry, CARD_WIDTH, CARD_HEIGHT)).not.toThrow();
    expect(geometry.getAttribute("uv")).toBeUndefined();
  });
});
