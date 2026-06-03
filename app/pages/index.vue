<script setup lang="ts">
import SectionAccess from "./_components/SectionAccess.vue";
import SectionContact from "./_components/SectionContact.vue";
import SectionMessage from "./_components/SectionMessage.vue";

import {
  defineRouteRules,
  useI18n,
  // NOTE: import useHead to avoid `useHead is not defined` error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useHead,
  useSeoMeta,
  defineAsyncComponent,
} from "#imports";

defineRouteRules({ prerender: true });

const { t } = useI18n();

// === 条件付きコンポーネントローディング ===
// フラグが false の場合、コンポーネントはバンドルに含まれません

// フォトセクション
const SectionPhoto = import.meta.vfFeatures.photoSection
  ? defineAsyncComponent(() => import("./_components/SectionPhoto.vue"))
  : null;

// スポンサー資料セクション
const SectionSponsorDocument =
  import.meta.vfFeatures.sponsorDocument && !import.meta.vfFeatures.sponsorClosed
    ? defineAsyncComponent(() => import("./_components/SectionSponsorDocument.vue"))
    : null;
const SponsorBeforeWanted =
  import.meta.vfFeatures.sponsorDocument &&
  !import.meta.vfFeatures.sponsorWanted &&
  !import.meta.vfFeatures.sponsorClosed
    ? defineAsyncComponent(() => import("./_components/SponsorBeforeWanted.vue"))
    : null;
const SponsorWanted =
  import.meta.vfFeatures.sponsorDocument &&
  import.meta.vfFeatures.sponsorWanted &&
  !import.meta.vfFeatures.sponsorClosed
    ? defineAsyncComponent(() => import("./_components/SponsorWanted.vue"))
    : null;

// スポンサー募集終了セクション
const SectionSponsorClosed = import.meta.vfFeatures.sponsorClosed
  ? defineAsyncComponent(() => import("./_components/SectionSponsorClosed.vue"))
  : null;

// スピーカーセクション
const SectionSpeakers = import.meta.vfFeatures.guestSpeakers
  ? defineAsyncComponent(() => import("./_components/SectionSpeaker.vue"))
  : null;

// タイムテーブルセクション
const SectionTimetable = import.meta.vfFeatures.timetable
  ? defineAsyncComponent(() => import("./_components/SectionTimetable.vue"))
  : null;

// イベントセクション
const SectionEvent = import.meta.vfFeatures.eventPage
  ? defineAsyncComponent(() => import("./_components/SectionEvent.vue"))
  : null;

// スポンサー一覧セクション
const SectionSponsors = import.meta.vfFeatures.sponsorList
  ? defineAsyncComponent(() => import("./_components/SectionSponsors.vue"))
  : null;

// 学生支援募集中セクション
const studentSupportDisabled = import.meta.vfFeatures.photoSection;
const SectionStudentSupportOpen =
  import.meta.vfFeatures.studentSupportOpen && !import.meta.vfFeatures.studentSupportClosed
    ? defineAsyncComponent(() => import("./_components/SectionStudentSupportOpen.vue"))
    : null;

// 学生支援募集終了セクション
const SectionStudentSupportClosed = import.meta.vfFeatures.studentSupportClosed
  ? defineAsyncComponent(() => import("./_components/SectionStudentSupport.vue"))
  : null;

// ボランティア募集セクション
const SectionVolunteer =
  import.meta.vfFeatures.volunteerOpen || import.meta.vfFeatures.volunteerClosed
    ? defineAsyncComponent(() => import("./_components/SectionVolunteer.vue"))
    : null;

// チケット販売セクション
const SectionGetYourTicket = import.meta.vfFeatures.ticketSales
  ? defineAsyncComponent(() => import("./_components/SectionGetYourTicket.vue"))
  : null;

// ストアセクション
const SectionGrabYourGear = import.meta.vfFeatures.store
  ? defineAsyncComponent(() => import("./_components/SectionGranYourGear.vue"))
  : null;

// CFP募集中セクション
const SectionCfpOpen =
  import.meta.vfFeatures.cfpOpen && !import.meta.vfFeatures.cfpClosed
    ? defineAsyncComponent(() => import("./_components/SectionCfpOpen.vue"))
    : null;

// CFP募集終了セクション
const SectionCfpClosed = import.meta.vfFeatures.cfpClosed
  ? defineAsyncComponent(() => import("./_components/SectionCfpClosed.vue"))
  : null;

// スタッフセクション
const SectionStaff = import.meta.vfFeatures.staff
  ? defineAsyncComponent(() => import("./_components/SectionStaff.vue"))
  : null;

useSeoMeta({ title: "" });
</script>

<template>
  <div id="pages-index">
    <div class="section-container">
      <!-- フォト（イベント後に表示） -->
      <SectionPhoto v-if="SectionPhoto" />

      <!-- CFP -->
      <SectionCfpOpen v-if="SectionCfpOpen" />
      <SectionCfpClosed v-if="SectionCfpClosed" />

      <!-- タイムテーブル -->
      <SectionTimetable v-if="SectionTimetable" />

      <!-- スピーカー -->
      <SectionSpeakers v-if="SectionSpeakers" />

      <!-- イベント -->
      <SectionEvent v-if="SectionEvent" />

      <!-- 学生支援 -->
      <SectionStudentSupportOpen studentSupportDisabled v-if="SectionStudentSupportOpen" />
      <SectionStudentSupportClosed v-if="SectionStudentSupportClosed" />

      <!-- ボランティア -->
      <SectionVolunteer v-if="SectionVolunteer" />

      <!-- チケット -->
      <SectionGetYourTicket v-if="SectionGetYourTicket" />

      <!-- ストア -->
      <SectionGrabYourGear v-if="SectionGrabYourGear" />

      <!-- スポンサー一覧 -->
      <SectionSponsors v-if="SectionSponsors" />

      <!-- ゲストスピーカー公開のタイミングで順番を入れ替え -->
      <SectionAccess v-if="SectionSpeakers" />
      <SectionMessage />

      <!-- スポンサー募集 -->
      <SectionSponsorDocument v-if="SectionSponsorDocument">
        <SponsorBeforeWanted v-if="SponsorBeforeWanted" />
        <SponsorWanted v-if="SponsorWanted" />
      </SectionSponsorDocument>
      <SectionSponsorClosed v-if="SectionSponsorClosed" />

      <!-- ゲストスピーカー公開のタイミングで順番を入れ替え -->
      <SectionAccess v-if="!SectionSpeakers" />

      <SectionContact />

      <!-- スタッフ -->
      <SectionStaff v-if="SectionStaff" />
    </div>

    <h2 class="sns-introduction-heading">
      {{ t("snsIntroduction") }}
    </h2>
  </div>
</template>

<style scoped>
@import "~/assets/styles/custom-media-query.css";

.section-container {
  display: flex;
  position: relative;
  flex-direction: column;
  row-gap: 1.5rem;

  @media (--mobile) {
    row-gap: 1rem;
  }
}

.sns-introduction-heading {
  /* NOTE: Although this is a heading, using --color-primary-base makes it blend with the main visual, reducing readability. Therefore, --color-text-default is used instead. */
  color: var(--color-text-default);

  font-size: 20px;
  line-height: 34px;
  text-align: center;
  margin-top: 1.5rem;
  text-wrap-style: auto;

  @media (--mobile) {
    font-size: 18px;
    line-height: 31px;
    margin-top: 1rem;
  }
}
</style>
