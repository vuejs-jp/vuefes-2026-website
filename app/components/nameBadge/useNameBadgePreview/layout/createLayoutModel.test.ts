import { describe, expect, it } from "vite-plus/test";
import { effectScope, ref } from "vue";
import {
  NAME_BADGE_PREVIEW_DEFAULTS,
  NAME_BADGE_PREVIEW_ROLE_THEME,
  NAME_BADGE_PREVIEW_STAGE_LAYOUT,
  NAME_BADGE_ROPE_TUNING,
} from "../constant";
import type { NameBadgePreviewPropRefs, NameBadgeUserRole } from "../types";
import { createLayoutModel } from "./createLayoutModel";

type PropOverrides = {
  userRole?: NameBadgeUserRole;
  name?: string;
  avatarImageUrl?: string;
  lang?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
};

function createPropRefs(overrides: PropOverrides = {}): NameBadgePreviewPropRefs {
  return {
    userRole: ref<NameBadgeUserRole>(overrides.userRole ?? "Attendee"),
    name: ref(overrides.name ?? "Evan"),
    avatarImageUrl: ref(overrides.avatarImageUrl),
    lang: ref(overrides.lang),
    width: ref(overrides.width),
    height: ref(overrides.height),
    aspectRatio: ref(overrides.aspectRatio),
  };
}

/** Stands in for the Nuxt base URL helper. */
const withBase = (path: string) => `/2026${path}`;

/**
 * Runs `body` inside an effect scope, so the model's `onScopeDispose` hook has
 * somewhere to register and is cleaned up afterwards.
 */
function withLayout<T>(
  props: NameBadgePreviewPropRefs,
  body: (layout: ReturnType<typeof createLayoutModel>) => T,
): T {
  const scope = effectScope();
  try {
    return scope.run(() => body(createLayoutModel({ props, stageRef: ref(null), withBase }))) as T;
  } finally {
    scope.stop();
  }
}

describe("createLayoutModel", () => {
  describe("variants", () => {
    it("resolves the role theme through the base URL helper", () => {
      const props = createPropRefs({ userRole: "Speaker" });

      withLayout(props, (layout) => {
        const theme = NAME_BADGE_PREVIEW_ROLE_THEME.Speaker;

        expect(layout.variants.value).toEqual({
          color: theme.color,
          baseImageUrl: withBase(theme.baseImagePath),
          avatarPlaceholderImageUrl: withBase(theme.avatarPlaceholderImagePath),
        });
      });
    });

    it("exposes the default artwork separately, for the fallback path", () => {
      withLayout(createPropRefs({ userRole: "Staff" }), (layout) => {
        expect(layout.defaultBaseImageUrl).toBe("/2026/images/name-badge/default.png");
      });
    });

    it.each(Object.keys(NAME_BADGE_PREVIEW_ROLE_THEME) as NameBadgeUserRole[])(
      "has a variant for the %s role",
      (userRole) => {
        withLayout(createPropRefs({ userRole }), (layout) => {
          expect(layout.variants.value.color).toMatch(/^#[0-9a-f]{6}$/i);
          expect(layout.variants.value.baseImageUrl).toContain("/images/name-badge/");
        });
      },
    );

    it("tracks a role change", () => {
      const props = createPropRefs({ userRole: "Attendee" });

      withLayout(props, (layout) => {
        const before = layout.variants.value.color;
        props.userRole.value = "Sponsor";

        expect(layout.variants.value.color).not.toBe(before);
        expect(layout.variants.value.color).toBe(NAME_BADGE_PREVIEW_ROLE_THEME.Sponsor.color);
      });
    });
  });

  describe("card size", () => {
    it("falls back to the default height and aspect", () => {
      withLayout(createPropRefs(), (layout) => {
        expect(layout.resolvedCardHeight.value).toBe(NAME_BADGE_PREVIEW_DEFAULTS.heightPx);
        expect(layout.resolvedAspect.value).toBe(NAME_BADGE_PREVIEW_DEFAULTS.aspect);
      });
    });

    it("derives the width from the height and the aspect ratio", () => {
      const props = createPropRefs({ height: "284px", aspectRatio: "200 / 284" });

      withLayout(props, (layout) => {
        expect(layout.resolvedCardHeight.value).toBe(284);
        expect(layout.resolvedCardWidth.value).toBeCloseTo(200, 10);
      });
    });

    it("prefers an explicit px width over the derived one", () => {
      const props = createPropRefs({ width: "120px", height: "284px" });

      withLayout(props, (layout) => {
        expect(layout.resolvedCardWidth.value).toBe(120);
      });
    });

    it("ignores a percentage width, which cannot be resolved without layout", () => {
      const props = createPropRefs({ width: "100%", height: "360px", aspectRatio: "1 / 2" });

      withLayout(props, (layout) => {
        expect(layout.resolvedCardWidth.value).toBe(180);
      });
    });

    it("recomputes when the height prop changes", () => {
      const props = createPropRefs({ height: "284px" });

      withLayout(props, (layout) => {
        props.height.value = "360px";
        expect(layout.resolvedCardHeight.value).toBe(360);
      });
    });
  });

  describe("stage size", () => {
    it("pads the stage horizontally so the badge can swing", () => {
      const props = createPropRefs({ width: "200px" });

      withLayout(props, (layout) => {
        expect(layout.stageWidth.value).toBe(200 + NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingX * 2);
      });
    });

    it("keeps a minimum stage width for very narrow cards", () => {
      const props = createPropRefs({ width: "1px" });

      withLayout(props, (layout) => {
        expect(layout.stageWidth.value).toBeGreaterThanOrEqual(280);
      });
    });

    it("adds the vertical padding to the card height", () => {
      const props = createPropRefs({ height: "360px" });

      withLayout(props, (layout) => {
        expect(layout.stageHeight.value).toBe(
          360 +
            NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingTop +
            NAME_BADGE_PREVIEW_STAGE_LAYOUT.paddingBottom,
        );
      });
    });

    it("caps the stage style at the container width", () => {
      const props = createPropRefs({ width: "200px", height: "360px" });

      withLayout(props, (layout) => {
        expect(layout.stageStyle.value).toEqual({
          width: "min(100%, 680px)",
          height: "508px",
        });
      });
    });
  });

  describe("rope anchor", () => {
    it("centres the anchor horizontally", () => {
      const props = createPropRefs({ width: "200px" });

      withLayout(props, (layout) => {
        expect(layout.anchorX.value).toBe(layout.stageWidth.value * 0.5);
      });
    });

    it("places the anchor far above the stage, so the badge swings on a long arc", () => {
      withLayout(createPropRefs(), (layout) => {
        expect(layout.anchorY.value).toBe(NAME_BADGE_ROPE_TUNING.ropeStartY);
        expect(layout.anchorY.value).toBeLessThan(0);
        expect(layout.ropeRestLength.value).toBeGreaterThan(layout.stageHeight.value);
      });
    });

    it("scales the slot offset with the card height", () => {
      const props = createPropRefs({ height: "360px" });

      withLayout(props, (layout) => {
        expect(layout.attachOffset.value).toBeCloseTo(
          360 * NAME_BADGE_ROPE_TUNING.attachOffsetRatio,
          10,
        );
      });
    });

    it("keeps a minimum slot offset for tiny cards", () => {
      const props = createPropRefs({ height: "10px" });

      withLayout(props, (layout) => {
        expect(layout.attachOffset.value).toBe(NAME_BADGE_ROPE_TUNING.attachOffsetMin);
      });
    });
  });

  describe("nameScaleX", () => {
    it("tracks the name prop", () => {
      const props = createPropRefs({ name: "Evan" });

      withLayout(props, (layout) => {
        expect(layout.nameScaleX.value).toBe(1);

        props.name.value = "a".repeat(40);
        expect(layout.nameScaleX.value).toBe(0.5);
      });
    });
  });
});
