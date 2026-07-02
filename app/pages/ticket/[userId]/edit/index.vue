<script setup lang="ts">
import * as v from "valibot";
import emojiRegex from "emoji-regex";
import { useRegleSchema } from "@regle/schemas";

import { useLocaleRoute } from "@typed-router";
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
  useSeoMeta,
  useRoute,
} from "#imports";

import type { VFFile } from "~/components/form/VFFileInput.vue";
import { VFFileInput, VFNameBadgePreview, VFSection, VFToast } from "#components";
import { useToast } from "~/components/toast/VFToast.vue";
import { NAME_BADGE_PREVIEW_LAYOUT } from "~/composables/useNameBadgePreview";

const { t } = useI18n();
const title = () => `${t("nuxtSiteConfig.name")} %separator %s`;
useSeoMeta({
  ogTitle: title,
  title,
});

const { data: user } = useAuth();
const toast = useToast();
const bp = useBreakpoint();
const localeRoute = useLocaleRoute();
const route = useRoute();

if (import.meta.vfFeatures.expiredNameBadgeRegistration) {
  if (user.value) {
    await navigateTo(
      localeRoute({
        name: "ticket-userId",
        params: { userId: user.value.userId },
      }),
    );
  } else {
    await navigateTo(localeRoute({ name: "ticket" }));
  }
}

if (route.params.userId !== user.value?.userId) {
  if (user.value) {
    await navigateTo(
      localeRoute({
        name: "ticket-userId",
        params: { userId: user.value.userId },
      }),
    );
  } else {
    await navigateTo(localeRoute({ name: "ticket" }));
  }
}

const { data: nameBadgeData, refresh } = useFetch("/api/name-badge");

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

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

  avatarImage: v.pipeAsync(
    v.custom<VFFile>((input: unknown): input is VFFile => !!input),
    v.checkAsync(async (file: VFFile) => {
      const { size } = await fetch(file.objectURL).then((r) => r.blob());
      return sizeInMB(size) <= 5;
    }, t("nameBadge.form.avatarImage.error.size")),
    v.check(
      (file: VFFile) => ["image/jpg", "image/jpeg", "image/png"].includes(file.type),
      t("nameBadge.form.avatarImage.error.type"),
    ),
  ),
});

const state = ref<{ name: string; salesId: string; avatarImage: VFFile | undefined }>({
  name: "",
  salesId: "",
  avatarImage: undefined,
});

const { r$ } = useRegleSchema(state, schema, { autoDirty: false });

onMounted(async () => {
  await refresh();

  if (nameBadgeData.value) {
    state.value.name = nameBadgeData.value.name ?? "";
    state.value.salesId = nameBadgeData.value.salesId ?? "";

    if (nameBadgeData.value?.avatarUrl && nameBadgeData.value?.avatarImageFileName) {
      // NOTE: need to configure cors
      const avatarBlob = await fetch(nameBadgeData.value.avatarUrl).then((r) => r.blob());
      state.value.avatarImage = {
        displayName: nameBadgeData.value.avatarImageFileName,
        name: nameBadgeData.value.avatarImageFileName,
        type: avatarBlob.type,
        objectURL: URL.createObjectURL(avatarBlob),
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

  if (result.valid) {
    try {
      isLoading.value = true;
      const formData = new FormData();
      formData.append("name", state.value.name);
      formData.append("salesId", state.value.salesId);
      if (state.value.avatarImage) {
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
          :error-message="r$.$fields.avatarImage.$errors.$self?.[0]"
          :invalid="r$.$fields.avatarImage.$error"
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
          <VFButton
            type="submit"
            :disabled="
              r$.$fields.name.$error ||
              !state.avatarImage ||
              r$.$fields.avatarImage.$error ||
              r$.$fields.salesId.$error
            "
          >
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
