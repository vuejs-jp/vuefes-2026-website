<script setup lang="ts">
import * as v from "valibot";
import { useRegleSchema } from "@regle/schemas";
import { HOME_HEADING_ID } from "~/constant";
import { reactive, useI18n, useRuntimeConfig } from "#imports";
import { VFSection, VFButton } from "#components";
import { VFInput, VFTextarea } from "~/components/form";
import VFToast, { useToast } from "~/components/toast/VFToast.vue";

const { t } = useI18n();

const config = useRuntimeConfig();

const toast = useToast();

const schema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.name.label") })),
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.email.label") })),
    v.email(t("validation.email")),
  ),
  content: v.pipe(
    v.string(),
    v.nonEmpty(t("validation.required", { target: t("contactForm.formFields.content.label") })),
  ),
});

const state = reactive<v.InferOutput<typeof schema>>({
  name: "",
  email: "",
  content: "",
});

const { r$ } = useRegleSchema(state, schema, { autoDirty: false });

async function submit() {
  const result = await r$.$validate();

  if (result.valid) {
    const formData = new FormData();
    for (const [name, value] of Object.entries(state)) {
      formData.append(name, value);
    }
    try {
      await fetch(config.public.contactFormEndpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      r$.$reset();
      toast.open({
        type: "success",
        message: t("contactForm.successMessage"),
      });
    } catch (error) {
      console.error(error);
      toast.open({
        type: "alert",
        message: t("contactForm.errorMessage"),
      });
    }
  }
}
</script>

<template>
  <VFSection :id="HOME_HEADING_ID.contact" :title="t('contactForm.title')">
    <p>{{ t("contactForm.description") }}</p>
    <form @submit.prevent="submit">
      <div class="contact-form-items">
        <VFInput
          v-model="state.name"
          name="name"
          required
          :label="t('contactForm.formFields.name.label')"
          :placeholder="t('contactForm.formFields.name.placeholder')"
          :error-message="r$.$fields.name.$errors[0]"
          :invalid="r$.$fields.name.$error"
          @blur="r$.$fields.name.$touch()"
        />
        <VFInput
          v-model="state.email"
          name="email"
          required
          :label="t('contactForm.formFields.email.label')"
          :placeholder="t('contactForm.formFields.email.placeholder')"
          :error-message="r$.$fields.email.$errors[0]"
          :invalid="r$.$fields.email.$error"
          @blur="r$.$fields.email.$touch()"
        />
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <VFTextarea
          v-model="state.content"
          name="content"
          required
          :label="t('contactForm.formFields.content.label')"
          :placeholder="t('contactForm.formFields.content.placeholder')"
          :error-message="r$.$fields.content.$errors[0]"
          :invalid="r$.$fields.content.$error"
          @blur="r$.$fields.content.$touch()"
        />
      </div>
      <VFButton
        type="submit"
        class="submit-button"
        :disabled="
          !(
            r$.$fields.name.$dirty &&
            !r$.$fields.name.$error &&
            r$.$fields.email.$dirty &&
            !r$.$fields.email.$error &&
            r$.$fields.content.$dirty &&
            !r$.$fields.content.$error
          )
        "
      >
        {{ t("contactForm.formFields.submit.label") }}
      </VFButton>
    </form>

    <VFToast :state="toast.state.value" />
  </VFSection>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.contact-form-items {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 2rem;
  @media (--mobile) {
    margin-top: 1.5rem;
  }
}

.submit-button {
  display: block;
  margin: 0 auto;
  margin-top: 2rem;
  @media (--mobile) {
    margin-top: 1.5rem;
  }
}
</style>
