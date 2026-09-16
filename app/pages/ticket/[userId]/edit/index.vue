<script setup lang="ts">
import * as v from "valibot";
import emojiRegex from "emoji-regex";
import { useRegleSchema } from "@regle/schemas";

import { useLocaleRoute } from "@typed-router";
import { useTicketDeadlines } from "../../_composables/useTicketDeadlines";
import {
  navigateTo,
  onMounted,
  ref,
  useAuth,
  useBreakpoint,
  useFetch,
  useI18n,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  usePageSeoMeta,
  useRoute,
  watch,
} from "#imports";

import type { VFFile } from "~/components/form/VFFileInput.vue";
import { VFFileInput, VFNameBadgePreview, VFSection, VFToast } from "#components";
import { useToast } from "~/components/toast/VFToast.vue";
import { NAME_BADGE_PREVIEW_LAYOUT } from "~/components/nameBadge/useNameBadgePreview";

const { t } = useI18n();
const title = () => `${t("nuxtSiteConfig.name")} %separator %s`;
usePageSeoMeta({
  title,
});

const { data: user } = useAuth();
const toast = useToast();
const bp = useBreakpoint();
const localeRoute = useLocaleRoute();
const route = useRoute();
const avatarImageChanged = ref(false);
const { isNameBadgeRegistrationClosed } = useTicketDeadlines();

const redirectFromEditPage = async () => {
  if (user.value) {
    return await navigateTo(
      localeRoute({
        name: "ticket-userId",
        params: { userId: user.value.userId },
      }),
    );
  }

  return await navigateTo(localeRoute({ name: "ticket" }));
};

watch(isNameBadgeRegistrationClosed, async (isClosed) => {
  if (isClosed) {
    await redirectFromEditPage();
  }
});

if (isNameBadgeRegistrationClosed.value || route.params.userId !== user.value?.userId) {
  await redirectFromEditPage();
}

const { data: nameBadgeData, refresh } = useFetch("/api/name-badge");

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const avatarImageSchema = v.pipeAsync(
  v.custom<VFFile>(
    (input: unknown): input is VFFile => !!input,
    t("nameBadge.form.avatarImage.error.required"),
  ),
  v.checkAsync(async (file: VFFile) => {
    if (!avatarImageChanged.value) return true;
    const { size } = await fetch(file.objectURL).then((r) => r.blob());
    return sizeInMB(size) <= 5;
  }, t("nameBadge.form.avatarImage.error.size")),
  v.check(
    (file: VFFile) =>
      !avatarImageChanged.value || ["image/jpg", "image/jpeg", "image/png"].includes(file.type),
    t("nameBadge.form.avatarImage.error.type"),
  ),
);

const schema = v.objectAsync({
  name: v.pipe(
    v.string(),
    v.minLength(1, t("nameBadge.form.name.error.required")),
    v.check((value) => {
      const len = [...value].reduce(
        (len, char) => len + (/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(char) ? 2 : 1),
        0,
      );
      return len <= 24;
    }, t("nameBadge.form.name.error.tooLong")),
    v.check((value) => !emojiRegex().test(value), t("nameBadge.form.name.error.emoji")),
  ),

  salesId: v.pipe(v.string(), v.minLength(1, t("nameBadge.form.receipt.error.required"))),

  avatarImage: avatarImageSchema,
});

const state = ref<{ name: string; salesId: string; avatarImage: VFFile | undefined }>({
  name: "",
  salesId: "",
  avatarImage: undefined,
});

const { r$ } = useRegleSchema(state, schema, { autoDirty: false });
const avatarImageError = ref<string>();

function getFirstIssueMessage(issues: unknown) {
  if (!Array.isArray(issues)) return;

  const [issue] = issues;
  if (typeof issue !== "object" || issue === null) return;

  const message =
    "$message" in issue ? issue.$message : "message" in issue ? issue.message : undefined;
  return typeof message === "string" ? message : undefined;
}

onMounted(async () => {
  await refresh();

  if (nameBadgeData.value) {
    state.value.name = nameBadgeData.value.name ?? "";
    state.value.salesId = nameBadgeData.value.salesId ?? "";

    if (nameBadgeData.value.avatarUrl) {
      const avatarImageFileName =
        nameBadgeData.value.avatarImageFileName ?? t("nameBadge.form.avatarImage.accountImage");
      state.value.avatarImage = {
        displayName: avatarImageFileName,
        name: avatarImageFileName,
        type: "",
        objectURL: nameBadgeData.value.avatarUrl,
      } satisfies VFFile;
    }
  }
});

const isLoading = ref(false);

async function submit() {
  if (!user.value) {
    toast.open({ type: "alert", message: t("nameBadge.form.submitResult.error") });
    return;
  }

  const result = await r$.$validate();

  if (!result.valid) {
    const avatarValidationError = getFirstIssueMessage(result.issues.avatarImage);
    avatarImageError.value = avatarValidationError;

    const validationError = [
      {
        label: t("nameBadge.form.name.label"),
        message: getFirstIssueMessage(result.issues.name),
      },
      {
        label: t("nameBadge.form.avatarImage.label"),
        message: avatarValidationError,
      },
      {
        label: t("nameBadge.form.receipt.label"),
        message: getFirstIssueMessage(result.issues.salesId),
      },
    ].find(({ message }) => message);

    toast.open({
      type: "alert",
      message: validationError
        ? `${validationError.label}: ${validationError.message}`
        : t("nameBadge.form.submitResult.error"),
    });
    return;
  }

  avatarImageError.value = undefined;

  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("name", state.value.name);
    formData.append("salesId", state.value.salesId);
    if (state.value.avatarImage && avatarImageChanged.value) {
      const blob = await fetch(state.value.avatarImage.objectURL).then((r) => r.blob());
      formData.append("avatarImageBlob", blob);
      formData.append("avatarImageName", state.value.avatarImage.name);
    }

    // ident by session
    await $fetch(`/api/name-badge/`, { method: "POST", body: formData });
    toast.open({ type: "success", message: t("nameBadge.form.submitResult.success") });
    await navigateTo(`/ticket/${user.value.userId}`);
  } catch (error) {
    console.error(error);
    toast.open({ type: "alert", message: t("nameBadge.form.submitResult.error") });
  } finally {
    isLoading.value = false;
  }
}

async function handleAvatarImageUpdate(file: VFFile) {
  avatarImageChanged.value = true;
  const result = await v.safeParseAsync(avatarImageSchema, file);
  avatarImageError.value = result.success ? undefined : result.issues[0]?.message;
}
</script>

<template>
  <div id="pages-ticket-userId-edit">
    <div v-if="isLoading" class="overlay" />

    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Ticket</h1>

    <VFSection
      :title="nameBadgeData ? t('nameBadge.edit') : t('nameBadge.create')"
      class="name-badge-section"
    >
      <div class="name-badge-preview-area">
        <VFNameBadgePreview
          :user-role="nameBadgeData?.role || 'Attendee'"
          :name="state.name || t('nameBadge.form.name.label')"
          :avatar-image-url="state.avatarImage?.objectURL"
          :lang="nameBadgeData?.lang ?? undefined"
          v-bind="
            bp === 'mobile' ? NAME_BADGE_PREVIEW_LAYOUT.mobile : NAME_BADGE_PREVIEW_LAYOUT.desktop
          "
        />
      </div>

      <form class="name-badge-form" @submit.prevent="submit">
        <VFInput
          v-model="state.name"
          name="name"
          required
          :label="t('nameBadge.form.name.label')"
          :placeholder="t('nameBadge.form.name.placeholder')"
          :error-message="r$.$fields.name.$errors[0]"
          :invalid="r$.$fields.name.$error"
          @blur="r$.$fields.name.$touch()"
        />
        <VFFileInput
          v-model="state.avatarImage"
          name="avatarImage"
          :label="t('nameBadge.form.avatarImage.label')"
          :placeholder="t('nameBadge.form.avatarImage.placeholder')"
          :description="t('nameBadge.form.avatarImage.description')"
          :error-message="avatarImageError"
          :invalid="avatarImageError !== undefined"
          @update:model-value="handleAvatarImageUpdate"
        />
        <VFInput
          v-model="state.salesId"
          name="salesId"
          required
          :label="t('nameBadge.form.receipt.label')"
          :description="t('nameBadge.form.receipt.description')"
          :error-message="r$.$fields.salesId.$errors[0]"
          :invalid="r$.$fields.salesId.$error"
          @blur="r$.$fields.salesId.$touch()"
        />

        <div class="name-badge-form-actions">
          <VFButton
            outlined
            :link="
              localeRoute({
                name: 'ticket-userId',
                params: { userId: user!.userId },
              })
            "
          >
            {{ t("nameBadge.form.cancel") }}
          </VFButton>
          <VFButton type="submit" :disabled="isLoading">
            {{ t("nameBadge.form.save") }}
          </VFButton>
        </div>
      </form>
    </VFSection>
  </div>

  <VFToast :state="toast.state.value" />
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-ticket-userId-edit {
  display: grid;
  row-gap: 1.5rem;

  @media (--mobile) {
    row-gap: 1rem;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    z-index: var(--z-index-overlay);
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

    .name-badge-form {
      display: grid;
      row-gap: 1.5rem;

      .name-badge-form-actions {
        display: flex;
        column-gap: 1rem;
        justify-content: center;
      }
    }
  }
}
</style>
