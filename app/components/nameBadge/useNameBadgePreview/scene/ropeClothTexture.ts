import * as THREE from "three";

import { NAME_BADGE_ROPE_VISUAL_TUNING } from "../constant";
import { clamp } from "../shared/math";

/** Color and alpha settings for one pass of the weave pattern. */
type WeaveColors = {
  dark: string;
  light: string;
  darkAlpha: number;
  lightAlpha: number;
};

export type RopeClothTextures = {
  /** Color map, or `null` on the server or if a 2D context is unavailable. */
  colorTexture: THREE.CanvasTexture | null;
  /** Bump map with the same weave, giving the fabric its relief. */
  bumpTexture: THREE.CanvasTexture | null;
};

/**
 * Generates the woven fabric textures for the lanyard.
 *
 * The lanyard is polyester webbing: at the size it is rendered you cannot read
 * individual threads, but you do read the diagonal twill and the slight
 * irregularity of the weave. Both are drawn procedurally rather than shipped as
 * image assets — the pattern is a few dozen strokes, and generating it keeps the
 * page weight down while letting the colors track the tuning constants.
 *
 * The textures tile along the rope's length, so the same short strip covers a
 * lanyard of any length.
 *
 * Three layers build up each map:
 *
 * 1. a vertical gradient that rounds the flat ribbon off at its edges,
 * 2. longitudinal fibres plus diagonal twill cells for the weave itself, and
 * 3. a per-pixel grain that breaks up the regularity of the strokes.
 */
export function createRopeClothTextures(): RopeClothTextures {
  const empty: RopeClothTextures = { colorTexture: null, bumpTexture: null };

  if (!import.meta.client) return empty;

  const width = NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureWidth;
  const height = NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureHeight;
  const weaveSpacing = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveSpacingPx;
  const weaveThickness = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveThicknessPx;
  const weaveOffset = NAME_BADGE_ROPE_VISUAL_TUNING.ropeWeaveOffsetPx;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const colorContext = colorCanvas.getContext("2d");
  if (!colorContext) return empty;

  // Darker at the top and bottom edges, so the flat ribbon reads as a rounded
  // strap catching the light along its centre.
  const bodyGradient = colorContext.createLinearGradient(0, 0, 0, height);
  bodyGradient.addColorStop(0, NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor);
  bodyGradient.addColorStop(0.12, NAME_BADGE_ROPE_VISUAL_TUNING.ropeColor);
  bodyGradient.addColorStop(0.5, NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadMidColor);
  bodyGradient.addColorStop(0.88, NAME_BADGE_ROPE_VISUAL_TUNING.ropeColor);
  bodyGradient.addColorStop(1, NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor);
  colorContext.fillStyle = bodyGradient;
  colorContext.fillRect(0, 0, width, height);

  drawLongitudinalFibers(colorContext, {
    dark: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor,
    light: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadHighlightColor,
    darkAlpha: 0.42,
    lightAlpha: 0.36,
  });
  drawTwillCells(colorContext, {
    dark: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadShadowColor,
    light: NAME_BADGE_ROPE_VISUAL_TUNING.ropeThreadHighlightColor,
    darkAlpha: 0.46,
    lightAlpha: 0.4,
  });

  // A second, harder shade right at the edges, deepening the roll-off.
  const edgeShade = colorContext.createLinearGradient(0, 0, 0, height);
  edgeShade.addColorStop(0, "rgba(0, 0, 0, 0.62)");
  edgeShade.addColorStop(0.08, "rgba(0, 0, 0, 0.08)");
  edgeShade.addColorStop(0.92, "rgba(0, 0, 0, 0.08)");
  edgeShade.addColorStop(1, "rgba(0, 0, 0, 0.62)");
  colorContext.fillStyle = edgeShade;
  colorContext.fillRect(0, 0, width, height);

  applyGrain(colorContext, width, height, (x, y) => (((x * 13 + y * 17) % 17) - 8) * 0.42);

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpContext = bumpCanvas.getContext("2d");
  if (!bumpContext) return empty;

  // Mid grey is "no displacement"; the weave is drawn as deviations from it.
  bumpContext.fillStyle = "#7f7f7f";
  bumpContext.fillRect(0, 0, width, height);
  drawLongitudinalFibers(bumpContext, {
    dark: "#676767",
    light: "#959595",
    darkAlpha: 0.42,
    lightAlpha: 0.42,
  });
  drawTwillCells(bumpContext, {
    dark: "#5e5e5e",
    light: "#a5a5a5",
    darkAlpha: 0.42,
    lightAlpha: 0.48,
  });

  applyGrain(bumpContext, width, height, (x, y) => (((x * 7 + y * 11) % 9) - 4) * 1.4);

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  configureRopeTexture(colorTexture);

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  configureRopeTexture(bumpTexture);

  return { colorTexture, bumpTexture };

  /** Threads running along the strap, alternating light and dark. */
  function drawLongitudinalFibers(context: CanvasRenderingContext2D, colors: WeaveColors) {
    context.save();
    context.lineCap = "round";

    for (let y = weaveSpacing * 0.25; y < height; y += weaveSpacing * 0.5) {
      const fiberIndex = Math.round(y / (weaveSpacing * 0.5));
      const isLight = fiberIndex % 2 === 0;

      context.strokeStyle = isLight ? colors.light : colors.dark;
      context.globalAlpha = isLight ? colors.lightAlpha : colors.darkAlpha;
      // Every third fibre is thicker, so the weave does not look machine-perfect.
      context.lineWidth = fiberIndex % 3 === 0 ? weaveThickness * 1.15 : weaveThickness * 0.72;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y + (isLight ? 0.35 : -0.35));
      context.stroke();
    }

    context.restore();
  }

  /**
   * Short diagonal strokes on a half-offset grid, producing the twill pattern
   * typical of woven webbing.
   */
  function drawTwillCells(context: CanvasRenderingContext2D, colors: WeaveColors) {
    context.save();
    context.lineCap = "round";
    context.lineWidth = weaveThickness;

    let row = 0;
    for (let y = -weaveSpacing; y < height + weaveSpacing; y += weaveSpacing) {
      const rowShift = (row % 2) * weaveOffset;
      let column = 0;

      for (let x = -weaveSpacing + rowShift; x < width + weaveSpacing; x += weaveSpacing) {
        const isHighlight = (row + column) % 2 === 0;
        context.strokeStyle = isHighlight ? colors.light : colors.dark;
        context.globalAlpha = isHighlight ? colors.lightAlpha : colors.darkAlpha;
        context.beginPath();
        context.moveTo(x, y + weaveSpacing * 0.72);
        context.lineTo(x + weaveSpacing * 0.72, y);
        context.stroke();
        column += 1;
      }

      row += 1;
    }

    context.restore();
  }
}

/**
 * Adds a deterministic per-pixel offset to every channel.
 *
 * The hash is a cheap integer pattern rather than real noise; at this texture
 * size it is indistinguishable from grain and costs nothing.
 */
function applyGrain(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  grainAt: (x: number, y: number) => number,
) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const grain = grainAt(x, y);
      data[index + 0] = clamp(data[index + 0]! + grain, 0, 255);
      data[index + 1] = clamp(data[index + 1]! + grain, 0, 255);
      data[index + 2] = clamp(data[index + 2]! + grain, 0, 255);
    }
  }

  context.putImageData(imageData, 0, 0);
}

/** Tiles the texture along the rope and sharpens it at grazing angles. */
function configureRopeTexture(texture: THREE.CanvasTexture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(
    NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatX,
    NAME_BADGE_ROPE_VISUAL_TUNING.ropeTextureRepeatY,
  );
  texture.anisotropy = 8;
}
