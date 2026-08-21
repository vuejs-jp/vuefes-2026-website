import * as THREE from "three";

import { clamp } from "./math";

/**
 * Traces a rounded rectangle onto an existing THREE path, centred on
 * `(centerX, centerY)`.
 *
 * Both `THREE.Shape` (an outline) and `THREE.Path` (a hole) extend
 * `THREE.Path`, so the same routine builds the card outline and the strap slot
 * that is punched out of it.
 *
 * The corner radius is clamped to half of the shorter side, which lets callers
 * pass an arbitrarily large radius to mean "fully rounded" without producing
 * self-intersecting curves.
 *
 * @returns The same `path` instance, to allow chaining.
 */
export function drawRoundedRect<TPath extends THREE.Path>(
  path: TPath,
  width: number,
  height: number,
  radius: number,
  centerX = 0,
  centerY = 0,
) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  const r = clamp(radius, 0, Math.min(halfWidth, halfHeight));

  path.moveTo(centerX - halfWidth + r, centerY - halfHeight);
  path.lineTo(centerX + halfWidth - r, centerY - halfHeight);
  path.quadraticCurveTo(
    centerX + halfWidth,
    centerY - halfHeight,
    centerX + halfWidth,
    centerY - halfHeight + r,
  );
  path.lineTo(centerX + halfWidth, centerY + halfHeight - r);
  path.quadraticCurveTo(
    centerX + halfWidth,
    centerY + halfHeight,
    centerX + halfWidth - r,
    centerY + halfHeight,
  );
  path.lineTo(centerX - halfWidth + r, centerY + halfHeight);
  path.quadraticCurveTo(
    centerX - halfWidth,
    centerY + halfHeight,
    centerX - halfWidth,
    centerY + halfHeight - r,
  );
  path.lineTo(centerX - halfWidth, centerY - halfHeight + r);
  path.quadraticCurveTo(
    centerX - halfWidth,
    centerY - halfHeight,
    centerX - halfWidth + r,
    centerY - halfHeight,
  );
  path.closePath();

  return path;
}

/** Builds a rounded rectangle outline centred on the origin. */
export function createRoundedRectShape(width: number, height: number, radius: number) {
  return drawRoundedRect(new THREE.Shape(), width, height, radius);
}

/**
 * Builds a rounded rectangle path suitable for use as a hole in a
 * {@link createRoundedRectShape} outline.
 */
export function createRoundedRectPath(
  width: number,
  height: number,
  radius: number,
  centerX: number,
  centerY: number,
) {
  return drawRoundedRect(new THREE.Path(), width, height, radius, centerX, centerY);
}
