import { describe, expect, it } from "vite-plus/test";
import { NAME_BADGE_CARD_SURFACE_TUNING } from "../constant";
import type { Rect } from "./badgeFaceLayout";
import {
  applySmoothMask,
  blendChannel,
  pointInPolygon,
  pseudoNoise01,
  writeCardSurfaceMaps,
} from "./cardSurfaceMaps";

const SIZE = 32;
/** Keeps the glossy avatar circle out of the way of the region under test. */
const NO_AVATAR: Rect = { x: 0, y: 0, width: 0, height: 0 };

function createBuffer(size: number, value: number) {
  const data = new Uint8ClampedArray(size * size * 4);
  data.fill(value);
  return data;
}

const channelAt = (data: Uint8ClampedArray, width: number, x: number, y: number) =>
  data[(y * width + x) * 4]!;

describe("pseudoNoise01", () => {
  it("stays within the unit range", () => {
    for (let x = 0; x < 40; x += 1) {
      for (let y = 0; y < 40; y += 1) {
        const value = pseudoNoise01(x, y, 1337);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it("is deterministic, so the grain does not shimmer between rebuilds", () => {
    expect(pseudoNoise01(12, 34, 1337)).toBe(pseudoNoise01(12, 34, 1337));
  });

  it("differs between neighboring pixels", () => {
    const samples = new Set([
      pseudoNoise01(0, 0, 1337),
      pseudoNoise01(1, 0, 1337),
      pseudoNoise01(0, 1, 1337),
      pseudoNoise01(1, 1, 1337),
    ]);

    expect(samples.size).toBeGreaterThan(1);
  });

  it("differs between seeds, so the two octaves do not line up", () => {
    expect(pseudoNoise01(12, 34, 1337)).not.toBe(pseudoNoise01(12, 34, 7331));
  });

  it("spreads across the range rather than clustering", () => {
    const values: number[] = [];
    for (let i = 0; i < 400; i += 1) {
      values.push(pseudoNoise01(i % 20, Math.floor(i / 20), 1337));
    }

    expect(Math.min(...values)).toBeLessThan(0.2);
    expect(Math.max(...values)).toBeGreaterThan(0.8);
  });
});

describe("blendChannel", () => {
  it("keeps the original value at zero opacity", () => {
    expect(blendChannel(200, 0, 0)).toBe(200);
  });

  it("reaches the target at full opacity", () => {
    expect(blendChannel(200, 0, 1)).toBe(0);
  });

  it("interpolates in between", () => {
    expect(blendChannel(200, 100, 0.5)).toBe(150);
  });
});

describe("pointInPolygon", () => {
  const square = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];

  // An L, so the "inside" test cannot be reduced to a bounding box.
  const lShape = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 10 },
    { x: 0, y: 10 },
  ];

  it("accepts a point inside a convex polygon", () => {
    expect(pointInPolygon(5, 5, square)).toBe(true);
  });

  it.each([
    [15, 5],
    [-5, 5],
    [5, 15],
    [5, -5],
  ])("rejects the point (%i, %i) outside a convex polygon", (x, y) => {
    expect(pointInPolygon(x, y, square)).toBe(false);
  });

  it("respects a concave notch", () => {
    expect(pointInPolygon(2, 8, lShape)).toBe(true);
    expect(pointInPolygon(8, 2, lShape)).toBe(true);
    expect(pointInPolygon(8, 8, lShape)).toBe(false);
  });

  it("rejects everything for a degenerate polygon", () => {
    expect(pointInPolygon(0, 0, [])).toBe(false);
    expect(pointInPolygon(0, 0, [{ x: 0, y: 0 }])).toBe(false);
  });
});

describe("applySmoothMask", () => {
  function maskedBuffer(avatar: Rect = NO_AVATAR) {
    const data = createBuffer(SIZE, 200);
    applySmoothMask({ data, width: SIZE, height: SIZE, smoothValue: 0, opacity: 1, avatar });
    return data;
  }

  it("smooths the glossy strip along the bottom of the badge", () => {
    const data = maskedBuffer();
    const stripY = Math.ceil(
      NAME_BADGE_CARD_SURFACE_TUNING.smoothSponsorPolygonRatios[0]![1] * SIZE + 1,
    );

    expect(channelAt(data, SIZE, SIZE / 2, stripY)).toBe(0);
  });

  it("leaves the matte paper untouched", () => {
    const data = maskedBuffer();

    expect(channelAt(data, SIZE, SIZE / 2, 2)).toBe(200);
  });

  it("smooths the glossy logo region", () => {
    const data = maskedBuffer();
    // Inside the wide upper bar of the Vue logo outline.
    const logoX = Math.round(0.15 * SIZE);
    const logoY = Math.round(0.62 * SIZE);

    expect(channelAt(data, SIZE, logoX, logoY)).toBeLessThan(200);
  });

  it("writes the same value to all three color channels", () => {
    const data = maskedBuffer();
    const index = (Math.round(SIZE * 0.97) * SIZE + SIZE / 2) * 4;

    expect(data[index]).toBe(data[index + 1]);
    expect(data[index]).toBe(data[index + 2]);
  });

  it("leaves the alpha channel alone", () => {
    const data = maskedBuffer();

    for (let i = 3; i < data.length; i += 4) {
      expect(data[i]).toBe(200);
    }
  });

  it("smooths the centre of the avatar circle", () => {
    const avatar: Rect = { x: 8, y: 8, width: 16, height: 16 };
    const data = maskedBuffer(avatar);

    expect(channelAt(data, SIZE, 16, 16)).toBe(0);
  });

  it("feathers the edge of the avatar circle instead of cutting it hard", () => {
    const avatar: Rect = { x: 8, y: 8, width: 16, height: 16 };
    const data = maskedBuffer(avatar);
    const radius = 16 * NAME_BADGE_CARD_SURFACE_TUNING.smoothORadiusScale;
    const edgeX = Math.round(16 + radius - 0.5);

    const edge = channelAt(data, SIZE, edgeX, 16);
    expect(edge).toBeGreaterThan(0);
    expect(edge).toBeLessThan(200);
  });

  it("does not smooth outside the avatar circle", () => {
    const avatar: Rect = { x: 8, y: 8, width: 16, height: 16 };
    const data = maskedBuffer(avatar);

    expect(channelAt(data, SIZE, 1, 1)).toBe(200);
  });

  it("scales the mask with the buffer size", () => {
    const small = createBuffer(16, 200);
    applySmoothMask({
      data: small,
      width: 16,
      height: 16,
      smoothValue: 0,
      opacity: 1,
      avatar: NO_AVATAR,
    });

    // The bottom strip is defined by a ratio, so it lands in the last row here too.
    expect(channelAt(small, 16, 8, 15)).toBe(0);
    expect(channelAt(small, 16, 8, 1)).toBe(200);
  });
});

describe("writeCardSurfaceMaps", () => {
  function writeMaps(avatar: Rect = NO_AVATAR) {
    const roughnessData = new Uint8ClampedArray(SIZE * SIZE * 4);
    const bumpData = new Uint8ClampedArray(SIZE * SIZE * 4);

    writeCardSurfaceMaps({ roughnessData, bumpData, width: SIZE, height: SIZE, avatar });

    return { roughnessData, bumpData };
  }

  it("writes opaque pixels", () => {
    const { roughnessData, bumpData } = writeMaps();

    for (let i = 3; i < roughnessData.length; i += 4) {
      expect(roughnessData[i]).toBe(255);
      expect(bumpData[i]).toBe(255);
    }
  });

  it("writes grayscale pixels", () => {
    const { roughnessData, bumpData } = writeMaps();

    for (let i = 0; i < roughnessData.length; i += 4) {
      expect(roughnessData[i]).toBe(roughnessData[i + 1]);
      expect(roughnessData[i]).toBe(roughnessData[i + 2]);
      expect(bumpData[i]).toBe(bumpData[i + 1]);
      expect(bumpData[i]).toBe(bumpData[i + 2]);
    }
  });

  it("produces the same maps every time", () => {
    expect(writeMaps().roughnessData).toEqual(writeMaps().roughnessData);
    expect(writeMaps().bumpData).toEqual(writeMaps().bumpData);
  });

  it("varies the grain across the surface", () => {
    const { roughnessData } = writeMaps();
    const samples = new Set<number>();

    for (let x = 0; x < SIZE; x += 1) {
      samples.add(channelAt(roughnessData, SIZE, x, 1));
    }

    expect(samples.size).toBeGreaterThan(1);
  });

  it("centres the bump map on its neutral value", () => {
    const { bumpData } = writeMaps();
    let total = 0;
    let count = 0;

    for (let x = 0; x < SIZE; x += 1) {
      total += channelAt(bumpData, SIZE, x, 1);
      count += 1;
    }

    expect(total / count).toBeCloseTo(127, -1);
  });

  it("makes the glossy strip smoother than the matte paper", () => {
    const { roughnessData } = writeMaps();
    // The grain is high amplitude, so compare row averages rather than pixels.
    const rowAverage = (y: number) => {
      let total = 0;
      for (let x = 0; x < SIZE; x += 1) total += channelAt(roughnessData, SIZE, x, y);
      return total / SIZE;
    };

    expect(rowAverage(SIZE - 1)).toBeLessThan(rowAverage(1));
  });

  it("flattens the bump map over the glossy strip", () => {
    const { bumpData } = writeMaps();
    const glossy = channelAt(bumpData, SIZE, SIZE / 2, SIZE - 1);

    expect(Math.abs(glossy - 127)).toBeLessThan(3);
  });

  it("smooths the avatar circle when one is given", () => {
    const avatar: Rect = { x: 8, y: 8, width: 16, height: 16 };
    const withAvatar = writeMaps(avatar).roughnessData;
    const withoutAvatar = writeMaps().roughnessData;

    expect(channelAt(withAvatar, SIZE, 16, 16)).toBeLessThan(
      channelAt(withoutAvatar, SIZE, 16, 16),
    );
  });
});
