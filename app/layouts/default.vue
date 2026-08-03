<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import { useLocaleRoute } from "@typed-router";
import {
  computed,
  nextTick,
  useBreakpoint,
  useRoute,
  watch,
  useI18n,
  type Breakpoint,
  type Component,
  type ComputedRef,
} from "#imports";
import {
  EnCtaTicket,
  JaCtaTicket,
  EnCtaCfp,
  JaCtaCfp,
  EnCtaVolunteer,
  JaCtaVolunteer,
  MainVisual,
  VFCta,
  VFFooter,
  VFHeader,
  VFMenu,
  VFSpCta,
  VFSpMenu,
} from "#components";
import { useAnimationStore } from "~/stores/animation";
import { HOME_HEADING_ID } from "~/constant";
import type { MenuItemProps } from "~/components/menu/VFMenuItem.vue";

defineSlots<{ default: () => unknown }>();

const [animation] = useAnimationStore();

const bp = useBreakpoint();
const route = useRoute();
const localeRoute = useLocaleRoute();
const isRoot = computed(() => ["/", "/en"].includes(route.path));
const { locale, t } = useI18n();

const menuItems = computed<MenuItemProps[]>(() =>
  [
    {
      id: HOME_HEADING_ID.home,
      label: "Home",
      routeName: localeRoute({ name: "index" }).name,
    },
    import.meta.vfFeatures.photoSection && {
      id: HOME_HEADING_ID.photo,
      label: "Photo",
      routeName: localeRoute({ name: "photo" }).name,
    },
    import.meta.vfFeatures.timetable && {
      id: HOME_HEADING_ID.timetable,
      label: "Timetable",
      routeName: localeRoute({ name: "timetable" }).name,
    },
    import.meta.vfFeatures.guestSpeakers && {
      id: HOME_HEADING_ID.speaker,
      label: "Speaker",
      routeName: localeRoute({ name: "speaker" }).name,
    },
    import.meta.vfFeatures.eventPage && {
      id: HOME_HEADING_ID.event,
      label: "Event",
      routeName: localeRoute({ name: "event" }).name,
    },
    import.meta.vfFeatures.store && {
      id: HOME_HEADING_ID.store,
      label: "Store",
      routeName: localeRoute({ name: "store" }).name,
    },
    import.meta.vfFeatures.ticketSales && {
      id: HOME_HEADING_ID.ticket,
      label: "Ticket",
      routeName: localeRoute({ name: "ticket" }).name,
    },
    import.meta.vfFeatures.sponsorList && {
      id: HOME_HEADING_ID.sponsor,
      label: "Sponsor",
      routeName: localeRoute({ name: "sponsors" }).name,
    },
  ].filter((it) => !!it),
);

type CtaConfig = {
  props: {
    actionButton: {
      label: string;
      link: string;
    };
    openerText: string;
  };
  content: Component;
};
const ctaConfigs: ComputedRef<Record<NonNullable<typeof viewedCta>, CtaConfig>> = computed(() => ({
  ticket: {
    props: {
      actionButton: {
        label: t("ticket.purchase"),
        link: localeRoute({ name: "ticket" }).path,
      },
      openerText: "Ticket",
    },
    content: locale.value === "ja" ? JaCtaTicket : EnCtaTicket,
  },
  cfp: {
    props: {
      actionButton: {
        label: t("cfp.apply"),
        link: t("cfp.applyLink"),
      },
      openerText: "CFP",
    },
    content: locale.value === "ja" ? JaCtaCfp : EnCtaCfp,
  },
  volunteer: {
    props: {
      actionButton: {
        label: t("volunteer.applyButtonShort"),
        link: t("volunteer.applyLink"),
      },
      openerText: "Volunteer",
    },
    content: locale.value === "ja" ? JaCtaVolunteer : EnCtaVolunteer,
  },
}));

const viewedCta: "ticket" | "cfp" | "volunteer" | null = (() => {
  if (import.meta.vfFeatures.ctaTicket) {
    return "ticket";
  } else if (import.meta.vfFeatures.ctaCfp) {
    return "cfp";
  } else if (import.meta.vfFeatures.ctaVolunteer) {
    return "volunteer";
  } else {
    return null;
  }
})();
const cta = computed(() => (viewedCta ? ctaConfigs.value[viewedCta] : null));

const { y } = useScroll(window);
const isShowedSpMenu = computed(() => {
  const targetBp: Breakpoint[] = isTimetable.value
    ? ["pc", "mobile-wide", "mobile"]
    : isWidenContent.value
      ? ["mobile-wide", "mobile"]
      : ["mobile"];
  return targetBp.includes(bp.value) && (!isRoot.value || y.value > 450);
});
const isShowedSpCta = computed(() => {
  const targetBp: Breakpoint[] =
    isTimetable.value || isWidenContent.value
      ? ["pc", "mobile-wide", "mobile"]
      : ["mobile-wide", "mobile"];
  return targetBp.includes(bp.value) && (!isRoot.value || y.value > 450);
});

const stripLocalePath = (path: string) =>
  path === "/en" ? "/" : path.startsWith("/en/") ? path.slice(3) : path;

const WIDE_ROUTE_PATHS = [
  "/speaker",
  "/ticket",
  "/sponsors",
  "/event",
  "/related-events",
  "/store",
];

const isWidenContent = computed(() => {
  const path = stripLocalePath(route.path);
  return WIDE_ROUTE_PATHS.some((widePath) => path === widePath || path.startsWith(`${widePath}/`));
});

const isTimetable = computed(() => {
  const path = stripLocalePath(route.path);
  return path === "/timetable" || path.startsWith("/timetable/");
});

// scroll behavior
watch(
  () => route.hash,
  async (hash) => {
    if (hash === "") {
      return;
    }

    await nextTick();

    if (isRoot.value && hash === "#") {
      window.scrollTo(0, 0);
      return;
    }

    const target = document.querySelector(hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3;
      window.scrollTo({ top, behavior: "smooth" });
    }
  },
);
</script>

<template>
  <div>
    <MainVisual
      :title-tag="isRoot ? 'h1' : 'div'"
      :animation
      :show-scroll-attention="isRoot"
      class="main-visual"
    />
    <div v-if="isRoot" style="height: 100svh" />
    <div class="layout">
      <div class="side-content left-menu">
        <div v-if="!isShowedSpMenu && menuItems.length > 1" class="nav-menu">
          <VFMenu :items="menuItems" />
        </div>
      </div>
      <div class="content" :class="{ 'widen-content': isWidenContent, timetable: isTimetable }">
        <VFHeader :is-root class="header" />

        <main class="main">
          <slot />
        </main>
        <VFFooter />
      </div>
      <div class="side-content right-menu">
        <div v-if="!isShowedSpCta && cta" class="nav-menu">
          <VFCta :action-button="cta.props.actionButton">
            <component :is="cta.content" />
          </VFCta>
        </div>
      </div>
    </div>
    <div style="height: 100lvh" />
  </div>

  <div class="sp-nav-container">
    <Transition>
      <VFSpMenu v-if="isShowedSpMenu && cta" :items="menuItems" />
    </Transition>

    <Transition>
      <VFSpCta
        v-if="isShowedSpCta && cta && route.path !== cta.props.actionButton.link"
        v-bind="cta.props"
      >
        <component :is="cta.content" />
      </VFSpCta>
    </Transition>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.layout {
  display: flex;
  column-gap: 1rem;
  position: relative;
}

.main-visual {
  position: fixed;
  z-index: var(--z-index-background);
}

.content {
  margin: 0;
  padding: 0 0.5rem;
  background-color: transparent;
  display: flex;
  row-gap: 1.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 700px;
  max-width: 700px;
  transition: unset;

  @media (--mobile) {
    row-gap: 1rem;
    padding: 0 0.25rem;
    max-width: none;
    width: 100%;
    min-width: 0;
    flex-basis: auto;
  }

  &.timetable {
    width: 90%;
    max-width: 1400px;

    @media (--mobile) {
      min-width: 0;
      width: 100%;
    }
  }

  &.widen-content {
    min-width: 960px;

    @media (--mobile) {
      min-width: 0;
      width: 100%;
    }
  }
}

.side-content {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  min-height: 100%;
  height: 100%;

  position: sticky;
  padding-top: 0.5rem;

  @media (--mobile) {
    display: none;
  }
}

.left-menu {
  justify-content: end;
  top: calc(100svh / 2 - 128px - 0.25rem);
}

.right-menu {
  justify-content: start;
  top: calc(100svh / 2 - 190px - 0.25rem); /* Hardcoded(190px) to half the content height */
}

.header {
  position: sticky;
  top: 0;
  width: 100%;
  padding-top: 0.5rem;
  z-index: var(--z-index-header);

  @media (--mobile) {
    padding-top: 0.25rem;
  }
}

.nav-menu {
  width: auto;
  height: 100%;
}

.sp-nav-container {
  position: fixed;
  bottom: 24px;
  width: 100%;
  height: auto;
  z-index: var(--z-index-navigation); /* higher than .header */
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.main {
  width: 100%;
  margin-top: 0.5rem;

  @media (--mobile) {
    margin-top: 0.25rem;
  }
}
</style>
