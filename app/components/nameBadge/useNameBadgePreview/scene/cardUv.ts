import * as THREE from "three";

import { clamp } from "../shared/math";

/**
 * Rewrites a geometry's UVs so the badge texture is mapped onto the card's
 * bounding rectangle.
 *
 * `THREE.ExtrudeGeometry` and `THREE.ShapeGeometry` derive UVs from the shape's
 * own coordinate system, which means the rounded corners and the punched strap
 * slot would distort and offset the artwork. Projecting each vertex's XY
 * position onto the card rectangle instead makes the texture line up exactly,
 * regardless of the outline's shape.
 *
 * Vertices on the extruded side walls fall outside the rectangle, hence the
 * clamp; they are covered by the plain side material anyway.
 *
 * The geometry must be centred on the origin. Does nothing if the geometry has
 * no position or UV attribute.
 */
export function remapCardUvToRect(
  geometry: THREE.BufferGeometry,
  cardWidthWorld: number,
  cardHeightWorld: number,
) {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  if (!position || !uv) return;

  const halfWidth = cardWidthWorld * 0.5;
  const halfHeight = cardHeightWorld * 0.5;

  for (let i = 0; i < uv.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const u = clamp((x + halfWidth) / cardWidthWorld, 0, 1);
    const v = clamp((y + halfHeight) / cardHeightWorld, 0, 1);
    uv.setXY(i, u, v);
  }

  uv.needsUpdate = true;
}
