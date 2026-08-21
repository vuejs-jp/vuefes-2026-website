import { NAME_BADGE_CARD_TILT_TUNING } from "../constant";
import { clamp } from "../shared/math";

export type CardTiltInput = {
  /** Rope tip position, in stage pixels. */
  tipX: number;
  tipY: number;
  /** Rope tip velocity, in stage pixels per second. */
  velX: number;
  velY: number;
  anchorX: number;
  anchorY: number;
  ropeRestLength: number;
};

/** Card orientation in degrees, in the order the scene applies them. */
export type CardTiltDegrees = {
  /** Rotation about the depth axis: the card leaning left or right. */
  roll: number;
  /** Rotation about the vertical axis: the card turning to face away. */
  yaw: number;
  /** Rotation about the horizontal axis: the card tipping towards the viewer. */
  pitch: number;
};

/**
 * Derives the card's 3D orientation from the 2D rope simulation.
 *
 * The rope physics only produces a position and a velocity for the point the
 * card hangs from, so the card's own tilt is faked from those two signals:
 *
 * - **offset** from the rest pose gives the steady-state lean, so a badge held
 *   out to one side stays tilted rather than snapping upright;
 * - **velocity** adds lead, so the card banks into a swing the way a real one
 *   does under its own inertia.
 *
 * Every axis is clamped, because the "physics" here is a linear approximation
 * that stops looking plausible at large angles. Pitch carries a constant bias so
 * the card tips slightly towards the viewer even at rest, which stops it from
 * reading as a flat sticker.
 *
 * @returns Degrees; the caller converts and eases towards them.
 */
export function computeCardTiltDegrees(input: CardTiltInput): CardTiltDegrees {
  const tuning = NAME_BADGE_CARD_TILT_TUNING;

  const horizontalOffset = input.tipX - input.anchorX;
  const verticalOffset = input.tipY - (input.anchorY + input.ropeRestLength);

  const roll = clamp(
    horizontalOffset * tuning.rollPerTipOffsetDeg + input.velX * tuning.rollPerTipVelocityDeg,
    -tuning.rollLimitDeg,
    tuning.rollLimitDeg,
  );

  const yaw = clamp(
    horizontalOffset * tuning.yawPerTipOffsetDeg + input.velX * tuning.yawPerTipVelocityDeg,
    -tuning.yawLimitDeg,
    tuning.yawLimitDeg,
  );

  const pitch = clamp(
    tuning.pitchBaseDeg +
      verticalOffset * tuning.pitchPerTipOffsetDeg +
      input.velY * tuning.pitchPerTipVelocityDeg,
    tuning.pitchMinDeg,
    tuning.pitchMaxDeg,
  );

  return { roll, yaw, pitch };
}
