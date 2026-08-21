import { describe, expect, it } from "vite-plus/test";
import { effectScope, ref, type Ref } from "vue";
import { createLayoutModel, type NameBadgePreviewLayout } from "../layout/createLayoutModel";
import type { NameBadgePreviewPropRefs } from "../types";
import { createInteractionModel, type NameBadgePreviewInteraction } from "./createInteractionModel";

const STAGE_LEFT = 20;
const STAGE_TOP = 10;

/** Records the pointer-capture calls the model makes on the stage element. */
function createStageElement() {
  const captured: number[] = [];
  const released: number[] = [];

  const element = {
    getBoundingClientRect: () => ({ left: STAGE_LEFT, top: STAGE_TOP }) as DOMRect,
    setPointerCapture: (pointerId: number) => captured.push(pointerId),
    releasePointerCapture: (pointerId: number) => released.push(pointerId),
  } as unknown as HTMLElement;

  return { element, captured, released };
}

/** Builds a pointer event in stage-local coordinates. */
function pointerEvent(x: number, y: number, pointerType = "mouse", pointerId = 7) {
  return {
    clientX: x + STAGE_LEFT,
    clientY: y + STAGE_TOP,
    pointerType,
    pointerId,
  } as PointerEvent;
}

function createPropRefs(): NameBadgePreviewPropRefs {
  return {
    userRole: ref("Attendee"),
    name: ref("Evan"),
    avatarImageUrl: ref(undefined),
    lang: ref(undefined),
    width: ref(undefined),
    height: ref("360px"),
    aspectRatio: ref(undefined),
  };
}

type Harness = {
  interaction: NameBadgePreviewInteraction;
  layout: NameBadgePreviewLayout;
  stageRef: Ref<HTMLElement | null>;
  stage: ReturnType<typeof createStageElement>;
};

function withInteraction<T>(body: (harness: Harness) => T, options: { mounted?: boolean } = {}) {
  const scope = effectScope();
  const stage = createStageElement();
  const stageRef = ref<HTMLElement | null>(options.mounted === false ? null : stage.element);

  try {
    return scope.run(() => {
      const layout = createLayoutModel({
        props: createPropRefs(),
        stageRef,
        withBase: (path) => path,
      });
      const interaction = createInteractionModel({ stageRef, layout });

      return body({ interaction, layout, stageRef, stage });
    }) as T;
  } finally {
    scope.stop();
  }
}

/** A point comfortably inside the card's footprint. */
function cardPoint(layout: NameBadgePreviewLayout) {
  const tip = { x: layout.anchorX.value, y: layout.anchorY.value + layout.ropeRestLength.value };
  return { x: tip.x, y: tip.y + layout.resolvedCardHeight.value * 0.5 };
}

describe("createInteractionModel", () => {
  describe("before the stage is mounted", () => {
    it("ignores pointer events", () => {
      withInteraction(
        ({ interaction }) => {
          interaction.handleStagePointerDown(pointerEvent(100, 100));
          interaction.handleStagePointerMove(pointerEvent(200, 200));

          expect(interaction.getCameraMotionSnapshot()).toEqual({
            normalizedX: 0,
            normalizedY: 0,
          });
        },
        { mounted: false },
      );
    });
  });

  describe("dragging the badge", () => {
    it("starts a drag when the pointer goes down on the card", () => {
      withInteraction(({ interaction, layout }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));
        interaction.handleStagePointerMove(pointerEvent(start.x + 40, start.y - 10));
        interaction.stepSimulation(1 / 60);

        expect(interaction.getSimulationSnapshot().tipX).toBeCloseTo(layout.anchorX.value + 40, 2);
      });
    });

    it("keeps the grab point under the pointer instead of snapping the card to it", () => {
      withInteraction(({ interaction, layout }) => {
        const start = cardPoint(layout);
        const restTipX = layout.anchorX.value;

        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));
        interaction.stepSimulation(1 / 60);

        // Grabbing alone must not move the badge, even though the grab point is
        // well below the rope tip.
        expect(interaction.getSimulationSnapshot().tipX).toBeCloseTo(restTipX, 2);
      });
    });

    it("does not start a drag when the pointer goes down beside the card", () => {
      withInteraction(({ interaction, layout }) => {
        const restTipX = layout.anchorX.value;

        interaction.handleStagePointerDown(pointerEvent(2, 2));
        interaction.handleStagePointerMove(pointerEvent(300, 300));
        interaction.stepSimulation(1 / 60);

        expect(interaction.getSimulationSnapshot().tipX).toBeCloseTo(restTipX, 2);
      });
    });

    it("does not start a drag below the card", () => {
      withInteraction(({ interaction, layout }) => {
        const restTipX = layout.anchorX.value;
        const below = {
          x: layout.anchorX.value,
          y: layout.anchorY.value + layout.ropeRestLength.value + 5000,
        };

        interaction.handleStagePointerDown(pointerEvent(below.x, below.y));
        interaction.handleStagePointerMove(pointerEvent(restTipX + 100, 200));
        interaction.stepSimulation(1 / 60);

        expect(interaction.getSimulationSnapshot().tipX).toBeCloseTo(restTipX, 2);
      });
    });

    it("stops dragging when the pointer is released", () => {
      withInteraction(({ interaction, layout }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));
        interaction.handleStagePointerMove(pointerEvent(start.x + 40, start.y));
        interaction.stepSimulation(1 / 60);

        const draggedX = interaction.getSimulationSnapshot().tipX;
        interaction.handleStagePointerUp(pointerEvent(start.x + 40, start.y));
        interaction.handleStagePointerMove(pointerEvent(start.x + 200, start.y));
        interaction.stepSimulation(1 / 60);

        // The badge is swinging on its own now, not following the pointer.
        expect(interaction.getSimulationSnapshot().tipX).toBeLessThan(draggedX + 10);
      });
    });

    it("drags on touch as well as with a mouse", () => {
      withInteraction(({ interaction, layout }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y, "touch"));
        interaction.handleStagePointerMove(pointerEvent(start.x + 40, start.y - 10, "touch"));
        interaction.stepSimulation(1 / 60);

        expect(interaction.getSimulationSnapshot().tipX).toBeCloseTo(layout.anchorX.value + 40, 2);
      });
    });
  });

  describe("pointer capture", () => {
    it("captures the pointer when a drag starts, so it can leave the stage", () => {
      withInteraction(({ interaction, layout, stage }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));

        expect(stage.captured).toEqual([7]);
      });
    });

    it("does not capture the pointer for a press beside the card", () => {
      withInteraction(({ interaction, stage }) => {
        interaction.handleStagePointerDown(pointerEvent(2, 2));

        expect(stage.captured).toEqual([]);
      });
    });

    it("releases the pointer on pointer up", () => {
      withInteraction(({ interaction, layout, stage }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));
        interaction.handleStagePointerUp(pointerEvent(start.x, start.y));

        expect(stage.released).toEqual([7]);
      });
    });
  });

  describe("camera parallax", () => {
    it("follows the mouse over the stage", () => {
      withInteraction(({ interaction, layout }) => {
        interaction.handleStagePointerMove(pointerEvent(layout.stageWidth.value, 0));

        expect(interaction.getCameraMotionSnapshot()).toEqual({
          normalizedX: 1,
          normalizedY: 1,
        });
      });
    });

    it("stays parked while the badge is being dragged", () => {
      withInteraction(({ interaction, layout }) => {
        const start = cardPoint(layout);
        interaction.handleStagePointerDown(pointerEvent(start.x, start.y));
        interaction.handleStagePointerMove(pointerEvent(layout.stageWidth.value, 0));

        expect(interaction.getCameraMotionSnapshot()).toEqual({
          normalizedX: 0,
          normalizedY: 0,
        });
      });
    });

    it("stays parked for touch input", () => {
      withInteraction(({ interaction, layout }) => {
        interaction.handleStagePointerMove(pointerEvent(layout.stageWidth.value, 0, "touch"));

        expect(interaction.getCameraMotionSnapshot()).toEqual({
          normalizedX: 0,
          normalizedY: 0,
        });
      });
    });

    it("parks when the pointer leaves the stage", () => {
      withInteraction(({ interaction, layout }) => {
        interaction.handleStagePointerMove(pointerEvent(layout.stageWidth.value, 0));
        interaction.handleStagePointerLeave();

        expect(interaction.getCameraMotionSnapshot()).toEqual({
          normalizedX: 0,
          normalizedY: 0,
        });
      });
    });
  });

  describe("simulation passthrough", () => {
    it("resets the simulation on request", () => {
      withInteraction(({ interaction, layout }) => {
        interaction.resetSimulation("entry");
        expect(interaction.getSimulationSnapshot().tipY).toBeLessThan(0);

        interaction.resetSimulation("rest");
        expect(interaction.getSimulationSnapshot().tipY).toBeCloseTo(
          layout.anchorY.value + layout.ropeRestLength.value,
          2,
        );
      });
    });

    it("advances the simulation", () => {
      withInteraction(({ interaction }) => {
        interaction.resetSimulation("entry");
        const startY = interaction.getSimulationSnapshot().tipY;

        for (let i = 0; i < 30; i += 1) {
          interaction.stepSimulation(1 / 60);
        }

        expect(interaction.getSimulationSnapshot().tipY).toBeGreaterThan(startY);
      });
    });
  });
});
