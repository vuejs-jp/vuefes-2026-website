import { defineEventHandler, getQuery } from "h3";
import { PROGRAMS } from "../../static-data/programs";
import { excludeSponsorPrograms } from "../../static-data/relations";
import { SPEAKERS } from "../../static-data/speakers";
import { SPONSORS } from "../../static-data/sponsors";
import { resolveProgram, resolveSpeaker } from "../../static-data/utils";
import type { Program, ProgramData } from "../../static-data/types/program";
import type { Speaker } from "../../static-data/types/speaker";

export default defineEventHandler(
  (
    event,
  ): {
    sessionSpeakers: Speaker[];
    ltSpeakers: Speaker[];
    panelDiscussionSpeakers: Speaker[];
    studentSupportSpeakers: Speaker[];
    speakers: Speaker[];
    programs: Program[];
  } => {
    const query = getQuery(event);
    const locale = (query.locale as "ja" | "en") || "ja";

    const speakerPrograms = excludeSponsorPrograms(PROGRAMS, [
      ...SPONSORS.PLATINUM,
      ...SPONSORS.GOLD,
      ...SPONSORS.SILVER,
      ...SPONSORS.BRONZE,
      ...SPONSORS.OPTION_ONLY,
      ...SPONSORS.CREATIVE,
    ]);

    const resolveSpeakersForPrograms = (programs: readonly ProgramData[]): Speaker[] => {
      const speakerIds = [...new Set(programs.flatMap((program) => program.speakerIds))];
      return speakerIds.map((speakerId) => {
        const speaker = SPEAKERS.find((candidate) => candidate.id === speakerId);
        if (!speaker) throw new Error(`Speaker not found: ${speakerId}`);
        return resolveSpeaker(speaker, locale);
      });
    };

    return {
      sessionSpeakers: resolveSpeakersForPrograms(
        speakerPrograms.filter((program) => program.type === "session"),
      ),
      ltSpeakers: resolveSpeakersForPrograms(
        speakerPrograms.filter((program) => program.type === "lightningTalk"),
      ),
      panelDiscussionSpeakers: resolveSpeakersForPrograms(
        speakerPrograms.filter((program) => program.type === "panelDiscussion"),
      ),
      studentSupportSpeakers: resolveSpeakersForPrograms(
        PROGRAMS.filter((program) => program.id === "student-support-contents"),
      ),
      speakers: SPEAKERS.map((speaker) => resolveSpeaker(speaker, locale)),
      programs: PROGRAMS.map((program) => resolveProgram(program, SPEAKERS, locale)),
    };
  },
);
