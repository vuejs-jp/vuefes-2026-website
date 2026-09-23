<script setup lang="ts">
import { useRoute, useLocaleRoute } from "@typed-router";

import { useTicketDeadlines } from "../_composables/useTicketDeadlines";
import {
  computed,
  defineOgImage,
  navigateTo,
  useAuth,
  useBreakpoint,
  useFetch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useI18n,
  useRuntimeConfig,
  usePageSeoMeta,
} from "#imports";

import { VFNameBadgePreview, VFSection, VFToast } from "#components";
import { NAME_BADGE_PREVIEW_LAYOUT } from "~/components/nameBadge/useNameBadgePreview";
import { useToast } from "~/components/toast/VFToast.vue";

import XIcon from "~icons/icons/ic_x";
import BlueskyIcon from "~icons/icons/ic_bluesky";
import FacebookIcon from "~icons/icons/ic_facebook";

const { t } = useI18n();
const toast = useToast();
const bp = useBreakpoint();
const localeRoute = useLocaleRoute();
const { nameBadgeEditingDeadline, isNameBadgeRegistrationClosed } = useTicketDeadlines();

const { data: session, status } = useAuth();
const route = useRoute("ticket-userId");
const shareUrl = new URL(
  `ticket/${route.params.userId}`,
  useRuntimeConfig().public.siteUrl,
).toString();
const { data: nameBadgeData } = await useFetch(`/api/name-badge/${route.params.userId}`);
const nameBadgeStatus = computed(() => {
  if (!nameBadgeData.value) return "notCreated";
  return nameBadgeData.value.isLinked ? "linked" : "created";
});
defineOgImage("OgNameBadgeSatori", {
  name: () => nameBadgeData.value?.name ?? undefined,
  userRole: () => nameBadgeData.value?.role ?? undefined,
  avatarImageUrl: () => nameBadgeData.value?.avatarUrl,
  lang: () => nameBadgeData.value?.lang ?? undefined,
});

usePageSeoMeta({
  title: () =>
    nameBadgeData.value?.role === "Sponsor"
      ? t("nameBadge.pageTitleSponsor", { sponsorName: nameBadgeData.value?.name })
      : t("nameBadge.pageTitle", { username: nameBadgeData.value?.name }),
  description: () => t("nameBadge.pageDescription"),
});

function handleClickXIcon() {
  const shareText = t("nameBadge.shareText", { link: shareUrl });
  const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const _ = window.open(url, "_blank") ?? navigateTo(url, { external: true });
}

function handleClickBlueskyIcon() {
  const shareText = t("nameBadge.shareText", { link: shareUrl });
  const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`;
  const _ = window.open(url, "_blank") ?? navigateTo(url, { external: true });
}

function handleClickFacebookIcon() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const _ = window.open(url, "_blank") ?? navigateTo(url, { external: true });
}

function copyUrl() {
  navigator.clipboard.writeText(shareUrl).then(() => {
    toast.open({ type: "success", message: t("clipboard.copySuccess") });
  });
}
</script>

<template>
  <div id="pages-ticket-userId">
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Ticket</h1>
    <VFSection :title="t('nameBadge.title')" class="name-badge-section">
      <div class="name-badge-preview-area">
        <VFNameBadgePreview
          :user-role="nameBadgeData?.role ?? 'Attendee'"
          :name="nameBadgeData?.name || t('nameBadge.form.name.label')"
          :avatar-image-url="nameBadgeData?.avatarUrl"
          :lang="nameBadgeData?.lang ?? undefined"
          v-bind="
            bp === 'mobile' ? NAME_BADGE_PREVIEW_LAYOUT.mobile : NAME_BADGE_PREVIEW_LAYOUT.desktop
          "
        />
      </div>

      <div
        v-if="status === 'authenticated' && session?.userId === route.params.userId"
        class="authenticated-action"
      >
        <p class="name-badge-status">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ t("nameBadge.status.label") }} :
          {{ t(`nameBadge.status.${nameBadgeStatus}`) }}
        </p>

        <VFButton
          v-if="!isNameBadgeRegistrationClosed"
          :link="localeRoute(`/ticket/${session!.userId}/edit`)"
          class="vf-button vf-button-primary"
        >
          {{ t("nameBadge.edit") }}
        </VFButton>

        <p class="name-badge-deadline">
          {{ t("nameBadge.deadlineDescription", { deadline: nameBadgeEditingDeadline }) }}
        </p>
      </div>

      <hr class="divider" />

      <div class="foot-action">
        <p class="name-badge-lets-share">
          {{ t("nameBadge.letsShare") }}
        </p>

        <div class="name-badge-sns-buttons">
          <div class="name-badge-sns-icons">
            <button type="button" class="sns-icon-button" @click="handleClickXIcon">
              <XIcon />
            </button>

            <button type="button" class="sns-icon-button" @click="handleClickBlueskyIcon">
              <BlueskyIcon />
            </button>

            <button type="button" class="sns-icon-button" @click="handleClickFacebookIcon">
              <FacebookIcon />
            </button>
          </div>

          <VFButton outlined @click="copyUrl()">
            {{ t("copyLink") }}
          </VFButton>
        </div>

        <p class="name-badge-join-event">
          {{ t("nameBadge.joinEvent") }}
        </p>
        <VFButton :link="localeRoute('/')">
          {{ t("siteName") }}
        </VFButton>
      </div>
    </VFSection>
  </div>

  <VFToast :state="toast.state.value" />
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-ticket-userId {
  display: grid;
  row-gap: 1.5rem;
  @media (--mobile) {
    row-gap: 1rem;
  }

  h1 {
    font-family: "ClashDisplay-Semibold";
    font-size: 3rem;
    padding: 7.5rem 0;
    margin: 0;

    @media (--mobile) {
      padding: 2.5rem 0.75rem;
    }
  }

  .name-badge-section {
    .name-badge-preview-area {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-bottom: 2rem;
      @media (--mobile) {
        margin-bottom: 1.5rem;
      }
    }

    .authenticated-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 1rem;

      .name-badge-status {
        margin-top: 2rem;
        color: var(--color-place-holder);
        @media (--mobile) {
          margin-top: 1.5rem;
        }
      }

      .name-badge-deadline {
        color: var(--color-text-secondary);
        text-align: center;
        margin-top: 1rem;
      }
    }

    hr.divider {
      width: 100%;
      border: 0;
      border-top: 1px solid var(--color-divider);
      margin: 2rem 0;

      @media (--mobile) {
        margin: 1.5rem 0;
      }
    }

    .foot-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 1rem;

      p {
        width: 100%;
        text-align: start;
        margin: 0;
      }

      .name-badge-join-event {
        margin-top: 2rem;

        @media (--mobile) {
          margin-top: 1.5rem;
        }
      }

      .name-badge-sns-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        @media (--mobile) {
          flex-direction: column;
        }

        .name-badge-sns-icons {
          display: flex;
          gap: 0.5rem;
          align-items: center;

          .sns-icon-button {
            background: none;
            border: var(--color-divider) 1px solid;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 59px;
            height: 59px;

            @media (any-hover: hover) {
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
    }
  }
}
</style>
