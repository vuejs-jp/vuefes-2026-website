import * as THREE from "three";
import { describe, expect, it } from "vite-plus/test";
import { createRoundedRectPath, createRoundedRectShape, drawRoundedRect } from "./roundedRect";

/** Bounding box of a traced path, sampled densely enough to catch the curves. */
function boundsOf(path: THREE.Path) {
  const points = path.getPoints(64);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

describe("drawRoundedRect", () => {
  it("returns the path it was given, so calls can be chained", () => {
    const path = new THREE.Path();
    expect(drawRoundedRect(path, 4, 2, 0.5)).toBe(path);
  });

  it("traces a closed outline", () => {
    const points = drawRoundedRect(new THREE.Path(), 4, 2, 0.5).getPoints(16);
    const first = points[0]!;
    const last = points.at(-1)!;

    expect(last.x).toBeCloseTo(first.x, 10);
    expect(last.y).toBeCloseTo(first.y, 10);
  });
});

describe("createRoundedRectShape", () => {
  it("fits exactly inside the requested size, centred on the origin", () => {
    const bounds = boundsOf(createRoundedRectShape(4, 2, 0.4));

    expect(bounds.minX).toBeCloseTo(-2, 10);
    expect(bounds.maxX).toBeCloseTo(2, 10);
    expect(bounds.minY).toBeCloseTo(-1, 10);
    expect(bounds.maxY).toBeCloseTo(1, 10);
  });

  it("still fits when the corner radius is larger than the shape", () => {
    const bounds = boundsOf(createRoundedRectShape(4, 2, 999));

    expect(bounds.minX).toBeCloseTo(-2, 10);
    expect(bounds.maxX).toBeCloseTo(2, 10);
    expect(bounds.minY).toBeCloseTo(-1, 10);
    expect(bounds.maxY).toBeCloseTo(1, 10);
  });

  it("rounds the corners: a corner point is pulled inside the bounding box", () => {
    const square = createRoundedRectShape(2, 2, 0);
    const rounded = createRoundedRectShape(2, 2, 0.5);

    // Sampled at the same parameter, the rounded outline never reaches as far
    // into the corner as the square one.
    const squareCorner = Math.max(...square.getPoints(64).map((p) => Math.hypot(p.x, p.y)));
    const roundedCorner = Math.max(...rounded.getPoints(64).map((p) => Math.hypot(p.x, p.y)));

    expect(roundedCorner).toBeLessThan(squareCorner);
  });

  it("produces a THREE.Shape, so it can carry holes", () => {
    const shape = createRoundedRectShape(4, 2, 0.4);
    expect(shape).toBeInstanceOf(THREE.Shape);
    expect(shape.holes).toEqual([]);
  });
});

describe("createRoundedRectPath", () => {
  it("centres the outline on the requested point", () => {
    const bounds = boundsOf(createRoundedRectPath(4, 2, 0.4, 10, -5));

    expect(bounds.minX).toBeCloseTo(8, 10);
    expect(bounds.maxX).toBeCloseTo(12, 10);
    expect(bounds.minY).toBeCloseTo(-6, 10);
    expect(bounds.maxY).toBeCloseTo(-4, 10);
  });

  it("is usable as a hole in a shape", () => {
    const shape = createRoundedRectShape(4, 2, 0.4);
    shape.holes.push(createRoundedRectPath(1, 0.2, 0.1, 0, 0.6));

    expect(shape.holes).toHaveLength(1);
    expect(shape.holes[0]).toBeInstanceOf(THREE.Path);
  });
});
