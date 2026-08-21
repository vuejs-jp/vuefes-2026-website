import { NAME_BADGE_ROPE_TUNING, NAME_BADGE_SPRING_TUNING } from "../constant";
import { clamp, smoothingFactor } from "../shared/math";

/**
 * How a simulation reset positions the badge.
 *
 * - `rest`: hanging straight down and completely still. Used when the stage is
 *   resized, so the card does not appear to be flung around by a layout change.
 * - `entry`: folded up near the top of the stage, so releasing it plays the
 *   "badge drops in" animation once the canvas is ready.
 */
export type RopeResetMode = "rest" | "entry";

/**
 * A read-only view of the simulated rope, handed to the renderer once per frame.
 *
 * `ropeX` / `ropeY` are the live internal buffers rather than copies: the render
 * loop reads them immediately and never retains them, and copying ~25 particles
 * every frame would be wasted work.
 */
export type RopeSimulationSnapshot = {
  /** Stage-space position of the rope's free end (where the card hangs). */
  tipX: number;
  tipY: number;
  /** Tip velocity in stage pixels per second; drives the card's tilt. */
  velX: number;
  velY: number;
  ropeX: Float32Array;
  ropeY: Float32Array;
};

/**
 * The stage measurements the simulation depends on.
 *
 * Declared as plain readonly numbers so tests can pass an object literal, while
 * the composable passes an object whose getters read Vue computed refs.
 */
export type RopeSimulationBounds = {
  /** Stage-space point the rope hangs from. */
  readonly anchorX: number;
  readonly anchorY: number;
  /** Rope length at rest, in stage pixels. */
  readonly ropeRestLength: number;
  readonly cardWidth: number;
  readonly stageWidth: number;
  readonly stageHeight: number;
};

export type RopeSimulation = {
  /** Current stage-space position of the rope tip. */
  readonly tipX: number;
  readonly tipY: number;
  /**
   * Pins the tip so it follows the drag target instead of gravity, and cancels
   * any in-flight entry animation.
   *
   * @param targetX Initial drag target, in stage pixels.
   */
  beginDrag: (targetX: number, targetY: number) => void;
  /** Releases the tip back to the physics simulation. */
  endDrag: () => void;
  /** Moves the stage-space point the pinned tip eases towards. */
  setDragTarget: (x: number, y: number) => void;
  /** Advances the simulation by `deltaSeconds` of wall-clock time. */
  step: (deltaSeconds: number) => void;
  reset: (mode?: RopeResetMode) => void;
  getSnapshot: () => RopeSimulationSnapshot;
};

/**
 * A Verlet-integrated rope with a heavy particle at the free end standing in
 * for the badge.
 *
 * The rope is a chain of equal-length segments solved with a small number of
 * distance-constraint passes (position based dynamics). Compared with a spring
 * model this stays stable at large time steps and never visibly stretches,
 * which matters because the rope is far longer than the visible stage.
 *
 * The simulation runs on a fixed time step with an accumulator so the motion is
 * identical regardless of display refresh rate.
 *
 * Everything is in stage pixels; the y axis points *down*, matching pointer
 * coordinates, so gravity is positive.
 */
export function createRopeSimulation(bounds: RopeSimulationBounds): RopeSimulation {
  const particleCount = NAME_BADGE_SPRING_TUNING.ropePhysicsSegments + 1;
  /** Index of the free end. Index `0` is pinned to the anchor. */
  const lastIndex = particleCount - 1;

  const ropeX = new Float32Array(particleCount);
  const ropeY = new Float32Array(particleCount);
  const ropePreviousX = new Float32Array(particleCount);
  const ropePreviousY = new Float32Array(particleCount);

  const motion = {
    tipX: 0,
    tipY: 0,
    velX: 0,
    velY: 0,
    dragTargetX: 0,
    dragTargetY: 0,
  };

  let isPinned = false;
  /**
   * True while the badge is still falling into place after an `entry` reset.
   * During this phase the tip may sit above the stage, and the usual "stay
   * below the anchor" clamp is relaxed.
   */
  let isEntryPhase = false;
  let physicsAccumulatorSeconds = 0;

  initializeStraightRope();

  return {
    get tipX() {
      return motion.tipX;
    },
    get tipY() {
      return motion.tipY;
    },
    beginDrag(targetX: number, targetY: number) {
      isPinned = true;
      // Grabbing the badge interrupts the drop-in animation.
      isEntryPhase = false;
      motion.dragTargetX = targetX;
      motion.dragTargetY = targetY;
    },
    endDrag() {
      isPinned = false;
    },
    setDragTarget(x: number, y: number) {
      motion.dragTargetX = x;
      motion.dragTargetY = y;
    },
    step,
    reset,
    getSnapshot,
  };

  function step(deltaSeconds: number) {
    const fixedStepSeconds = NAME_BADGE_SPRING_TUNING.fixedStepSeconds;
    // Clamping both the frame delta and the accumulator prevents a spiral of
    // death after the tab has been left in the background.
    physicsAccumulatorSeconds = Math.min(
      physicsAccumulatorSeconds +
        clamp(deltaSeconds, 0, NAME_BADGE_SPRING_TUNING.maxFrameDeltaSeconds),
      fixedStepSeconds * NAME_BADGE_SPRING_TUNING.maxSubsteps,
    );

    let completedSteps = 0;
    while (
      physicsAccumulatorSeconds >= fixedStepSeconds &&
      completedSteps < NAME_BADGE_SPRING_TUNING.maxSubsteps
    ) {
      const ropeIsTaut = stepRopePhysics(fixedStepSeconds);
      physicsAccumulatorSeconds -= fixedStepSeconds;
      completedSteps += 1;

      // The entry animation ends the moment the rope first pulls tight.
      if (isEntryPhase && ropeIsTaut) {
        isEntryPhase = false;
      }
    }

    // Once the badge has come to rest, snap it onto the exact rest pose. This
    // stops the last few pixels of drift and lets the render loop settle.
    const restY = bounds.anchorY + bounds.ropeRestLength;
    const isSettled =
      Math.hypot(motion.tipX - bounds.anchorX, motion.tipY - restY) <
        NAME_BADGE_SPRING_TUNING.settleDistance &&
      Math.hypot(motion.velX, motion.velY) < NAME_BADGE_SPRING_TUNING.settleVelocity;

    if (isSettled && !isPinned) {
      initializeStraightRope();
    }
  }

  function reset(mode: RopeResetMode = "rest") {
    const rest = projectTipWithinBounds(bounds.anchorX, bounds.anchorY + bounds.ropeRestLength);
    const entry = projectTipWithinBounds(
      bounds.stageWidth * clamp(NAME_BADGE_ROPE_TUNING.initialTipXRatio, 0, 1),
      NAME_BADGE_ROPE_TUNING.initialTipY,
      true,
    );
    const start = mode === "entry" ? entry : rest;

    physicsAccumulatorSeconds = 0;
    motion.dragTargetX = start.x;
    motion.dragTargetY = start.y;
    isEntryPhase = mode === "entry";

    if (mode === "entry") {
      initializeFoldedRope(start.x, start.y);
      // Seed the previous position so Verlet integration starts with the
      // configured launch velocity.
      const fixedStepSeconds = NAME_BADGE_SPRING_TUNING.fixedStepSeconds;
      ropePreviousX[lastIndex] =
        ropeX[lastIndex]! - NAME_BADGE_ROPE_TUNING.initialTipVelX * fixedStepSeconds;
      ropePreviousY[lastIndex] =
        ropeY[lastIndex]! - NAME_BADGE_ROPE_TUNING.initialTipVelY * fixedStepSeconds;
      syncMotionFromRope(fixedStepSeconds);
      return;
    }

    initializeStraightRope();
  }

  function getSnapshot(): RopeSimulationSnapshot {
    return {
      tipX: motion.tipX,
      tipY: motion.tipY,
      velX: motion.velX,
      velY: motion.velY,
      ropeX,
      ropeY,
    };
  }

  /**
   * Runs one fixed-size physics step.
   *
   * @returns Whether the rope is taut, i.e. the tip is (almost) a full rope
   * length away from the anchor.
   */
  function stepRopePhysics(stepSeconds: number) {
    const tipPinned = isPinned;
    integrateRopeParticles(stepSeconds, tipPinned);

    if (tipPinned) {
      // Ease the tip towards the pointer rather than snapping it there, so a fast
      // drag still produces rope motion instead of a rigid follow.
      const target = projectTipWithinBounds(motion.dragTargetX, motion.dragTargetY);
      const follow = smoothingFactor(NAME_BADGE_SPRING_TUNING.dragFollowSpeed, stepSeconds);
      const currentX = ropeX[lastIndex]!;
      const currentY = ropeY[lastIndex]!;

      ropePreviousX[lastIndex] = currentX;
      ropePreviousY[lastIndex] = currentY;
      ropeX[lastIndex] = currentX + (target.x - currentX) * follow;
      ropeY[lastIndex] = currentY + (target.y - currentY) * follow;
    }

    solveRopeConstraints(tipPinned);
    constrainRopeTipToStage();
    syncMotionFromRope(stepSeconds);

    const directDistance = Math.hypot(motion.tipX - bounds.anchorX, motion.tipY - bounds.anchorY);
    return directDistance >= bounds.ropeRestLength * 0.992;
  }

  /**
   * Verlet integration: each particle keeps moving by its previous displacement
   * (damped by air drag) plus the gravity contribution for this step.
   */
  function integrateRopeParticles(stepSeconds: number, tipPinned: boolean) {
    const displacementDamping = Math.exp(-NAME_BADGE_SPRING_TUNING.airDrag * stepSeconds);
    const gravityStep = NAME_BADGE_SPRING_TUNING.gravity * stepSeconds * stepSeconds;

    for (let index = 1; index < particleCount; index += 1) {
      if (tipPinned && index === lastIndex) continue;

      const currentX = ropeX[index]!;
      const currentY = ropeY[index]!;
      const displacementX = (currentX - ropePreviousX[index]!) * displacementDamping;
      const displacementY = (currentY - ropePreviousY[index]!) * displacementDamping;

      ropePreviousX[index] = currentX;
      ropePreviousY[index] = currentY;
      ropeX[index] = currentX + displacementX;
      ropeY[index] = currentY + displacementY + gravityStep;
    }
  }

  /**
   * Pulls neighboring particles back to the segment rest length.
   *
   * Corrections are distributed by inverse mass: the anchor never moves, and the
   * tip resists correction because it carries the weight of the card. Repeating
   * the pass makes the rope behave as an inextensible chain.
   */
  function solveRopeConstraints(
    tipPinned: boolean,
    iterations: number = NAME_BADGE_SPRING_TUNING.constraintIterations,
  ) {
    const segmentLength = bounds.ropeRestLength / lastIndex;

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      pinRopeAnchor();

      for (let index = 0; index < lastIndex; index += 1) {
        const nextIndex = index + 1;
        const dx = ropeX[nextIndex]! - ropeX[index]!;
        const dy = ropeY[nextIndex]! - ropeY[index]!;
        const distance = Math.hypot(dx, dy);
        if (distance < 0.0001) continue;

        const inverseMassA = index === 0 ? 0 : 1;
        const inverseMassB =
          nextIndex === lastIndex ? (tipPinned ? 0 : NAME_BADGE_SPRING_TUNING.cardInverseMass) : 1;
        const totalInverseMass = inverseMassA + inverseMassB;
        if (totalInverseMass === 0) continue;

        const errorRatio = (distance - segmentLength) / distance;
        const correctionX = dx * errorRatio;
        const correctionY = dy * errorRatio;

        ropeX[index] = ropeX[index]! + correctionX * (inverseMassA / totalInverseMass);
        ropeY[index] = ropeY[index]! + correctionY * (inverseMassA / totalInverseMass);
        ropeX[nextIndex] = ropeX[nextIndex]! - correctionX * (inverseMassB / totalInverseMass);
        ropeY[nextIndex] = ropeY[nextIndex]! - correctionY * (inverseMassB / totalInverseMass);
      }

      if (tipPinned) {
        const target = projectTipWithinBounds(motion.dragTargetX, motion.dragTargetY);
        ropeX[lastIndex] = target.x;
        ropeY[lastIndex] = target.y;
      }
    }

    pinRopeAnchor();
  }

  /**
   * Keeps the card inside the stage after the constraint solver has run.
   *
   * When the tip is moved by this clamp the previous position is moved with it,
   * which cancels the velocity instead of letting the card bounce off the edge.
   */
  function constrainRopeTipToStage() {
    const currentX = ropeX[lastIndex]!;
    const currentY = ropeY[lastIndex]!;
    const constrained = projectTipWithinBounds(currentX, currentY, isEntryPhase, false);
    ropeX[lastIndex] = constrained.x;
    ropeY[lastIndex] = constrained.y;

    if (
      !isPinned &&
      (Math.abs(constrained.x - currentX) > 0.001 || Math.abs(constrained.y - currentY) > 0.001)
    ) {
      ropePreviousX[lastIndex] = constrained.x;
      ropePreviousY[lastIndex] = constrained.y;
    }
  }

  /** Nails particle `0` to the anchor, with zero velocity. */
  function pinRopeAnchor() {
    ropeX[0] = bounds.anchorX;
    ropeY[0] = bounds.anchorY;
    ropePreviousX[0] = bounds.anchorX;
    ropePreviousY[0] = bounds.anchorY;
  }

  /** Mirrors the solved tip particle into the publicly readable motion state. */
  function syncMotionFromRope(stepSeconds: number) {
    motion.tipX = ropeX[lastIndex]!;
    motion.tipY = ropeY[lastIndex]!;
    motion.velX = (ropeX[lastIndex]! - ropePreviousX[lastIndex]!) / Math.max(stepSeconds, 0.0001);
    motion.velY = (ropeY[lastIndex]! - ropePreviousY[lastIndex]!) / Math.max(stepSeconds, 0.0001);
  }

  /** Lays the rope out vertically below the anchor and clears all motion. */
  function initializeStraightRope() {
    const segmentLength = bounds.ropeRestLength / lastIndex;

    for (let index = 0; index < particleCount; index += 1) {
      const x = bounds.anchorX;
      const y = bounds.anchorY + segmentLength * index;
      ropeX[index] = x;
      ropeY[index] = y;
      ropePreviousX[index] = x;
      ropePreviousY[index] = y;
    }

    isEntryPhase = false;
    physicsAccumulatorSeconds = 0;
    motion.tipX = ropeX[lastIndex]!;
    motion.tipY = ropeY[lastIndex]!;
    motion.velX = 0;
    motion.velY = 0;
    motion.dragTargetX = motion.tipX;
    motion.dragTargetY = motion.tipY;
  }

  /**
   * Lays the rope out as a slack wave between the anchor and `(tipX, tipY)`.
   *
   * The tip starts much closer to the anchor than the rope is long, so the
   * excess length has to go somewhere. A binary search finds the wave amplitude
   * whose arc length matches the rope's rest length, giving a natural looking
   * coil that the constraint solver then tidies up.
   */
  function initializeFoldedRope(tipX: number, tipY: number) {
    const anchorX = bounds.anchorX;
    const anchorY = bounds.anchorY;
    const targetLength = bounds.ropeRestLength;
    let minimumAmplitude = 0;
    let maximumAmplitude = targetLength;

    for (let iteration = 0; iteration < 24; iteration += 1) {
      const amplitude = (minimumAmplitude + maximumAmplitude) * 0.5;
      if (measureFoldedRopeLength(amplitude, anchorX, anchorY, tipX, tipY) < targetLength) {
        minimumAmplitude = amplitude;
      } else {
        maximumAmplitude = amplitude;
      }
    }

    writeFoldedRope((minimumAmplitude + maximumAmplitude) * 0.5, anchorX, anchorY, tipX, tipY);
    motion.dragTargetX = tipX;
    motion.dragTargetY = tipY;
    // Extra iterations here because the initial guess is far from a valid pose.
    solveRopeConstraints(true, 64);

    // Zero velocity everywhere: the badge should start still, then fall.
    for (let index = 0; index < particleCount; index += 1) {
      ropePreviousX[index] = ropeX[index]!;
      ropePreviousY[index] = ropeY[index]!;
    }

    function measureFoldedRopeLength(
      amplitude: number,
      anchorX: number,
      anchorY: number,
      tipX: number,
      tipY: number,
    ) {
      let length = 0;
      let previousX = anchorX;
      let previousY = anchorY;

      for (let index = 1; index < particleCount; index += 1) {
        const point = foldedPoint(index, amplitude, anchorX, anchorY, tipX, tipY);
        length += Math.hypot(point.x - previousX, point.y - previousY);
        previousX = point.x;
        previousY = point.y;
      }

      return length;
    }

    function writeFoldedRope(
      amplitude: number,
      anchorX: number,
      anchorY: number,
      tipX: number,
      tipY: number,
    ) {
      for (let index = 0; index < particleCount; index += 1) {
        const point = foldedPoint(index, amplitude, anchorX, anchorY, tipX, tipY);
        ropeX[index] = point.x;
        ropeY[index] = point.y;
      }
    }

    /**
     * A point on the anchor-to-tip line, displaced sideways by a sine wave that
     * is enveloped so it vanishes at both ends.
     */
    function foldedPoint(
      index: number,
      amplitude: number,
      anchorX: number,
      anchorY: number,
      tipX: number,
      tipY: number,
    ) {
      const ratio = index / lastIndex;
      const envelope = Math.sin(Math.PI * ratio);
      const wave = Math.sin(Math.PI * 2 * NAME_BADGE_SPRING_TUNING.entryWaveCount * ratio);
      return {
        x: anchorX + (tipX - anchorX) * ratio + wave * envelope * amplitude,
        y: anchorY + (tipY - anchorY) * ratio,
      };
    }
  }

  /**
   * Keeps a candidate tip position inside the stage and within reach of the
   * rope.
   *
   * @param allowAboveTop Permits positions above the anchor, used during the
   * entry animation where the badge starts off-stage.
   * @param constrainToRope Also pulls the point back onto the circle of radius
   * `ropeRestLength` around the anchor. Disabled when the constraint solver has
   * already enforced the rope length and only the stage clamp is wanted.
   */
  function projectTipWithinBounds(
    x: number,
    y: number,
    allowAboveTop = false,
    constrainToRope = true,
  ) {
    const halfCardWidth = bounds.cardWidth * 0.5;
    const minVisibleCardWidth =
      bounds.cardWidth * clamp(NAME_BADGE_ROPE_TUNING.minVisibleCardRatio, 0.5, 1);
    // How far the card is allowed to hang off the side of the stage.
    const horizontalOverflow = bounds.cardWidth - minVisibleCardWidth;
    let nx = clamp(
      x,
      halfCardWidth - horizontalOverflow + NAME_BADGE_ROPE_TUNING.stageBoundsInsetX,
      bounds.stageWidth -
        halfCardWidth +
        horizontalOverflow -
        NAME_BADGE_ROPE_TUNING.stageBoundsInsetX,
    );
    let ny = clamp(
      y,
      allowAboveTop
        ? Number.NEGATIVE_INFINITY
        : bounds.anchorY + NAME_BADGE_ROPE_TUNING.stageBoundsInsetTop,
      bounds.stageHeight - NAME_BADGE_ROPE_TUNING.stageBoundsInsetBottom,
    );

    const dx = nx - bounds.anchorX;
    const dy = ny - bounds.anchorY;
    const maxDistance = bounds.ropeRestLength + NAME_BADGE_ROPE_TUNING.maxDragExtra;
    const distance = Math.hypot(dx, dy);

    if (constrainToRope && distance > maxDistance) {
      const ratio = maxDistance / distance;
      nx = bounds.anchorX + dx * ratio;
      ny = bounds.anchorY + dy * ratio;
    }

    return { x: nx, y: ny };
  }
}
