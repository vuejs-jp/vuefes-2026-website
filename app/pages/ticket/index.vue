<script setup lang="ts">
import { Temporal } from "temporal-polyfill-lite";
import { useTicketDeadlines } from "./_composables/useTicketDeadlines";
import { TICKET } from "./_data/ticket";
import { NAME_BADGE_REDIRECT_QUERY } from "~/constant";
import {
  computed,
  ref,
  useAuth,
  useCurrentInstant,
  useI18n,
  useLocaleRoute,
  useRuntimeConfig,
  useWithBase,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useSeoMeta,
} from "#imports";
import {
  VFButton,
  VFSection,
  EnTicketUsageInstructions,
  JaTicketUsageInstructions,
  EnNameBadgeFlowAndAttentions,
  JaNameBadgeFlowAndAttentions,
  EnIndividualSponsor,
  JaIndividualSponsor,
  EnHandsOnEvent,
  JaHandsOnEvent,
  EnFaq,
  JaFaq,
} from "#components";

const runtimeConfig = useRuntimeConfig();
const { signIn, status, data } = useAuth();
const { t, locale } = useI18n();
const localeRoute = useLocaleRoute();
const withBase = useWithBase();
const { earlyBirdDeadline, cancellationDeadline, cancellationDate, nameBadgeEditingDeadline } =
  useTicketDeadlines();

const handsOnImageList = [
  { src: withBase("/images/ticket/hands-on_1.jpg"), alt: t("event.handsOn.image.alt1") },
  { src: withBase("/images/ticket/hands-on_2.jpg"), alt: t("event.handsOn.image.alt2") },
  { src: withBase("/images/ticket/hands-on_3.jpg"), alt: t("event.handsOn.image.alt3") },
  { src: withBase("/images/ticket/hands-on_4.jpg"), alt: t("event.handsOn.image.alt4") },
];

const formatPrice = (price: number | null) =>
  price === null ? t("ticket.priceTbd") : new Intl.NumberFormat(locale.value).format(price);

const currentInstant = useCurrentInstant();
const earlyBirdDeadlineInstant = Temporal.ZonedDateTime.from(
  TICKET.deadlines.earlyBird,
).toInstant();
const hasEarlyBirdDeadlinePassed = computed(
  () =>
    currentInstant.value !== null &&
    Temporal.Instant.compare(currentInstant.value, earlyBirdDeadlineInstant) >= 0,
);

const isSoldOutAfterParty = import.meta.vfFeatures.soldOutAfterParty;
const isSoldOutEarlyBird = computed(
  () => import.meta.vfFeatures.soldOutEarlyBird || hasEarlyBirdDeadlinePassed.value,
);
const isSoldOutEarlyBirdAfterParty = computed(
  () => import.meta.vfFeatures.soldOutEarlyBirdAfterParty || isSoldOutEarlyBird.value,
);
const isSoldOutGeneral = import.meta.vfFeatures.soldOutGeneral;
const isSoldOutHandsOn = import.meta.vfFeatures.soldOutHandsOn;
const isSoldOutIndividualSponsor = import.meta.vfFeatures.soldOutIndividualSponsor;

const isLoading = ref(false);
const nameBadgeCallbackUrl =
  localeRoute({
    name: "ticket",
    query: { redirect: NAME_BADGE_REDIRECT_QUERY },
  })?.fullPath ?? `/ticket?redirect=${NAME_BADGE_REDIRECT_QUERY}`;

async function handleClockGoogleSignIn() {
  isLoading.value = true;
  await signIn("google", { callbackUrl: nameBadgeCallbackUrl }).finally(() => {
    isLoading.value = false;
  });
}

async function handleClockGitHubSignIn() {
  isLoading.value = true;
  await signIn("github", { callbackUrl: nameBadgeCallbackUrl }).finally(() => {
    isLoading.value = false;
  });
}

useSeoMeta({
  title: t("ticket.title"),
  ogImage: `${runtimeConfig.public.siteUrl}images/og/ticket.png`,
  ogTitle: t("ticket.title"),
});
</script>

<template>
  <div id="pages-ticket">
    <div v-if="isLoading" class="overlay" />

    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <h1>Ticket</h1>

    <VFSection id="ticket-type" :title="t('ticket.type')" class="ticket-type">
      <div class="description">
        <p>{{ t("ticket.typeDescription1") }}</p>
        <p v-if="!isSoldOutEarlyBird">{{ t("ticket.typeDescription2") }}</p>
      </div>

      <section class="general-tickets">
        <ul class="general-ticket-list">
          <li class="ticket-badge">
            <img
              src="/images/ticket/ticket-type_general.png"
              width="400"
              height="266"
              alt=""
              class="ticket-badge-image"
            />

            <div class="ticket-badge-details">
              <h2 class="ticket-badge-title" :class="locale">
                {{ t("ticket.generalTicket.title") }}
              </h2>

              <div class="ticket-badge-prices">
                <span class="ticket-badge-price">
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  <span class="ticket-badge-price-type">{{ t("ticket.early") }}</span>
                  <span
                    class="ticket-badge-price-value"
                    :class="{ 'sold-out': isSoldOutEarlyBird }"
                  >
                    <span class="ticket-badge-price-unit" :class="locale">{{
                      t("ticket.priceUnit")
                    }}</span
                    >{{ formatPrice(TICKET.prices.general.early) }}
                  </span>
                  <span v-if="isSoldOutEarlyBird" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>

                <span class="ticket-badge-price">
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  <span class="ticket-badge-price-type">{{ t("ticket.standard") }}</span>
                  <span class="ticket-badge-price-value" :class="{ 'sold-out': isSoldOutGeneral }">
                    <span class="ticket-badge-price-unit" :class="locale">{{
                      t("ticket.priceUnit")
                    }}</span
                    >{{ formatPrice(TICKET.prices.general.standard) }}
                  </span>
                  <span v-if="isSoldOutGeneral" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>
              </div>
            </div>
          </li>

          <li class="ticket-badge">
            <img
              src="/images/ticket/ticket-type_party.png"
              width="400"
              height="266"
              alt="General Ticket"
              class="ticket-badge-image"
            />

            <div class="ticket-badge-details">
              <h2 class="ticket-badge-title" :class="locale">
                {{ t("ticket.afterPartyTicket.title") }}
              </h2>

              <div class="ticket-badge-prices">
                <span class="ticket-badge-price">
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  <span class="ticket-badge-price-type">{{ t("ticket.early") }}</span>
                  <span
                    class="ticket-badge-price-value"
                    :class="{ 'sold-out': isSoldOutEarlyBirdAfterParty }"
                  >
                    <span class="ticket-badge-price-unit" :class="locale">{{
                      t("ticket.priceUnit")
                    }}</span
                    >{{ formatPrice(TICKET.prices.afterParty.early) }}
                  </span>
                  <span v-if="isSoldOutEarlyBirdAfterParty" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>

                <span class="ticket-badge-price">
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  <span class="ticket-badge-price-type">{{ t("ticket.standard") }}</span>
                  <span
                    class="ticket-badge-price-value"
                    :class="{ 'sold-out': isSoldOutAfterParty }"
                  >
                    <span class="ticket-badge-price-unit" :class="locale">{{
                      t("ticket.priceUnit")
                    }}</span
                    >{{ formatPrice(TICKET.prices.afterParty.standard) }}
                  </span>
                  <span v-if="isSoldOutAfterParty" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="option-tickets">
        <h2 class="option-tickets-title">
          {{ t("ticket.option") }}
        </h2>

        <ul class="option-ticket-list">
          <li>
            <div class="ticket-badge ticket-badge_sub">
              <h2 class="ticket-badge-title" :class="locale">
                {{ t("ticket.handsOn.title") }}
              </h2>
              <div class="ticket-badge-prices">
                <span class="ticket-badge-price">
                  <span class="ticket-badge-price-value" :class="{ 'sold-out': isSoldOutHandsOn }">
                    <span class="ticket-badge-price-unit" :class="locale">{{
                      t("ticket.priceUnit")
                    }}</span
                    >{{ formatPrice(TICKET.prices.handsOn) }}
                  </span>
                  <span v-if="isSoldOutHandsOn" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>
              </div>
            </div>
            <div class="ticket-attention">
              <p>{{ t("ticket.handsOn.attention1") }}</p>
              <i18n-t keypath="ticket.handsOn.attention2" tag="p">
                <template #about>
                  <a href="#hands-on">
                    {{ t("ticket.handsOn.about") }}
                  </a>
                </template>
              </i18n-t>
            </div>
          </li>

          <li>
            <div class="ticket-badge ticket-badge_sub">
              <h2 class="ticket-badge-title" :class="locale">
                {{ t("ticket.individual.sponsor") }}
              </h2>
              <div class="ticket-badge-prices">
                <span class="ticket-badge-price">
                  <span
                    class="ticket-badge-price-value"
                    :class="{ 'sold-out': isSoldOutIndividualSponsor }"
                  >
                    <span
                      v-if="TICKET.prices.individualSponsor !== null"
                      class="ticket-badge-price-unit"
                      :class="locale"
                      >{{ t("ticket.priceUnit") }}</span
                    >{{ formatPrice(TICKET.prices.individualSponsor) }}
                  </span>
                  <span v-if="isSoldOutIndividualSponsor" class="sold-out-label">{{
                    t("ticket.soldOut")
                  }}</span>
                </span>
              </div>
            </div>
            <div class="ticket-attention">
              <p>{{ t("ticket.individual.attention1") }}</p>
              <i18n-t keypath="ticket.individual.attention2" tag="p">
                <template #about>
                  <a href="#individual-sponsor">
                    {{ t("ticket.individual.about") }}
                  </a>
                </template>
              </i18n-t>
            </div>
          </li>
        </ul>
      </section>

      <div class="buy-ticket-button-wrapper">
        <VFButton class="buy-ticket-button" :link="TICKET.url" external>
          {{ t("ticket.buy") }}
        </VFButton>
      </div>

      <hr class="divider" />

      <component
        :is="locale === 'ja' ? JaTicketUsageInstructions : EnTicketUsageInstructions"
        class="ticket-usage-instructions"
      />
    </VFSection>

    <VFSection id="name-badge" :title="t('nameBadge.title')" class="name-badge">
      <img
        src="/images/ticket/name-badge-cover.png"
        width="538"
        height="430"
        :alt="t('nameBadge.coverImageAlt')"
        class="cover-image"
      />

      <i18n-t keypath="nameBadge.description" tag="p" class="name-badge-description">
        <template #ticketName>
          <a :href="TICKET.url" target="_blank">
            {{ t("nameBadge.ticketName") }}
          </a>
        </template>
      </i18n-t>
      <p class="name-badge-description">
        {{ t("nameBadge.deadlineDescription", { deadline: nameBadgeEditingDeadline }) }}
      </p>
      <p class="name-badge-attention">
        {{ t("nameBadge.attention") }}
      </p>

      <div v-if="status === 'authenticated'" class="login-buttons">
        <VFButton
          v-if="data"
          :link="
            localeRoute({
              name: 'ticket-userId',
              params: { userId: data.userId },
            })
          "
        >
          {{ t("nameBadge.confirm") }}
        </VFButton>
      </div>

      <div v-else-if="status === 'unauthenticated'" class="login-buttons">
        <VFButton @click="handleClockGoogleSignIn">
          {{ t("login.withGoogle") }}
        </VFButton>
        <VFButton @click="handleClockGitHubSignIn">
          {{ t("login.withGitHub") }}
        </VFButton>
      </div>

      <hr class="divider" />

      <component
        :is="locale === 'ja' ? JaNameBadgeFlowAndAttentions : EnNameBadgeFlowAndAttentions"
        class="name-badge-flow-and-attentions"
      />
    </VFSection>

    <VFSection
      id="individual-sponsor"
      :title="t('individualSponsor.title')"
      class="individual-sponsor"
    >
      <component :is="locale === 'ja' ? JaIndividualSponsor : EnIndividualSponsor" />
    </VFSection>

    <VFSection id="hands-on" :title="t('handsOn.title')" class="hands-on">
      <component :is="locale === 'ja' ? JaHandsOnEvent : EnHandsOnEvent">
        <template #images>
          <div class="image-list">
            <img
              v-for="(item, index) in handsOnImageList"
              :key="index"
              :src="item.src"
              :alt="item.alt"
              loading="lazy"
            />
          </div>
        </template>
      </component>
    </VFSection>

    <VFSection id="faq" :title="t('faq.title')" class="faq">
      <component :is="locale === 'ja' ? JaFaq : EnFaq">
        <template #early-bird-deadline>{{ earlyBirdDeadline }}</template>
        <template #cancellation-deadline>{{ cancellationDeadline }}</template>
        <template #cancellation-date>{{ cancellationDate }}</template>
      </component>
    </VFSection>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

#pages-ticket {
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    z-index: var(--z-index-overlay);
  }

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

  .ticket-type {
    ul.general-ticket-list {
      display: grid;
      gap: 32px;
      margin-top: 40px;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

      @media (--mobile-small) {
        margin-top: 2rem;
        grid-template-columns: 1fr;
      }
    }

    .option-tickets-title {
      margin-top: 32px;
    }

    ul.option-ticket-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
      gap: 32px;
      margin-top: 16px;

      @media (--mobile-small) {
        grid-template-columns: 1fr;
      }
    }

    .ticket-badge {
      width: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      border: 1px solid var(--color-divider);
      overflow: hidden;

      &.ticket-badge_sub {
        padding: 20px;
      }

      .ticket-badge-image {
        width: 100%;
        height: auto;
      }

      .ticket-badge-details {
        padding: 1.25rem;
      }

      .ticket-badge-title {
        margin: 0;
      }

      .ticket-badge-prices {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;

        @media (--mobile) {
          display: flex;
          flex-direction: column;
        }

        .ticket-badge-price {
          display: flex;
          align-items: center;
          gap: 16px;

          .ticket-badge-price-type {
            font-size: 1rem;
            display: block;
            text-align: center;

            @media (--mobile) {
              font-size: 0.875rem;
            }
          }

          .ticket-badge-price-value {
            display: block;
            font-size: 1.75rem;
            font-weight: 700;
            line-height: 1;

            &.sold-out {
              text-decoration: line-through;
            }

            .ticket-badge-price-unit {
              font-size: 1.75rem;

              &.en {
                font-size: 1.25rem;
                margin-right: 0.5rem;
              }
            }
          }

          .sold-out-label {
            color: var(--color-sub);
            background-color: var(--color-base);
            font-size: 11px;
            padding: 0 0.375rem;
            border-radius: 4px;
            margin-left: -8px;
          }
        }
      }
    }

    .ticket-attention {
      margin-top: 0.375rem;

      p,
      a {
        font-size: 11px;
        line-height: 15px;
        margin-bottom: 0;

        @media (--mobile) {
          font-size: 10px;
        }
      }
    }

    .buy-ticket-button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 40px;
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

    .ticket-usage-instructions {
      :deep(ul) {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 0;
      }
    }
  }

  .name-badge {
    .cover-image {
      width: 100%;
      height: auto;
      max-width: 538px;
      margin: 0 auto 32px;
    }

    .name-badge-attention {
      font-size: 14px;
      line-height: 21px;
      margin: 2rem 0;

      @media (--mobile) {
        font-size: 12px;
        line-height: 18px;
        margin: 1.5rem 0;
      }
    }

    .login-buttons {
      display: flex;
      justify-content: center;
      gap: 0.5rem;

      @media (--mobile) {
        flex-direction: column;
        align-items: center;
      }

      button {
        width: 100%;
        max-width: fit-content;
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

    .name-badge-flow-and-attentions {
      :deep(ol) {
        list-style-type: decimal;
        padding-left: 1.5rem;
      }
      :deep(ul) {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 0;
      }
    }
  }

  .individual-sponsor {
    :deep(.individual-sponsor-list) {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 32px;
    }
    :deep(.individual-sponsor-item) {
      display: flex;
      gap: 16px 24px;

      img {
        width: 100%;
        max-width: 240px;
        aspect-ratio: 16/9;
        border-radius: 8px;
        border: 1px solid var(--color-divider-light);
      }

      @media (--mobile-small) {
        flex-direction: column;

        img {
          width: 100%;
          height: auto;
          max-width: inherit;
        }
      }
    }
    :deep(.individual-sponsor-description) {
      h2 {
        margin: 0;
      }
      p {
        margin: 8px 0;
      }
    }

    :deep(.individual-sponsor-attention) {
      margin: 0 !important;
      font-size: 14px;
      line-height: 21px;

      @media (--mobile-small) {
        font-size: 12px;
        line-height: 18px;
      }
    }

    :deep([data-vf-mdc] > hr) {
      width: 100%;
      border: 0;
      border-top: 1px solid var(--color-divider);
      margin: 2rem 0;

      @media (--mobile-small) {
        margin: 1.5rem 0;
      }
    }
  }

  .hands-on {
    :deep([data-vf-mdc] ul:not([class])) {
      padding-inline-start: 1.5rem;
      list-style-type: disc;
    }

    .image-list {
      --size: 180px;
      margin-top: 32px;
      display: grid;
      justify-items: center;
      grid-template-columns: repeat(auto-fill, minmax(var(--size), 1fr));
      row-gap: 10px;
      column-gap: 10px;

      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }

      @media (--mobile) {
        --size: 150px;
        margin-top: 24px;
      }
    }
  }
}
</style>
