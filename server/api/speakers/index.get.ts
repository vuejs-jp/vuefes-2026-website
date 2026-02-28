import { defineEventHandler, getQuery } from "h3";
import {
  SESSION_SPEAKERS,
  LT_SPEAKERS,
  PANEL_DISCUSSION_SPEAKERS,
  STUDENT_SUPPORT_SPEAKERS,
} from "../../static-data/speakers";
import { resolveSpeaker, resolveStudentSupportSpeaker } from "../../static-data/utils";
import type { Speaker, StudentSupportSpeaker } from "../../static-data/types/speaker";

export default defineEventHandler(
  (
    event,
  ): {
    sessionSpeakers: Speaker[];
    ltSpeakers: Speaker[];
    panelDiscussionSpeakers: Speaker[];
    studentSupportSpeakers: StudentSupportSpeaker[];
  } => {
    const query = getQuery(event);
    const locale = (query.locale as "ja" | "en") || "ja";

    return {
      sessionSpeakers: SESSION_SPEAKERS.map((s) => resolveSpeaker(s, locale)),
      ltSpeakers: LT_SPEAKERS.map((s) => resolveSpeaker(s, locale)),
      panelDiscussionSpeakers: PANEL_DISCUSSION_SPEAKERS.map((s) => resolveSpeaker(s, locale)),
      studentSupportSpeakers: STUDENT_SUPPORT_SPEAKERS.map((s) =>
        resolveStudentSupportSpeaker(s, locale),
      ),
    };
  },
);
