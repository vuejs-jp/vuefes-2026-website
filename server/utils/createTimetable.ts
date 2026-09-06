import { useTranslation } from "../i18n/useTranslation";
import { PROGRAMS, type ProgramId } from "../static-data/programs";
import { SPEAKERS } from "../static-data/speakers";
import type { Program } from "../static-data/types/program";
import type {
  TimetableItem,
  TimetableResponse,
  TimetableTime,
  TimetableTrack,
} from "../static-data/types/timetable";
import { resolveProgram } from "../static-data/utils";

export function createTimetable(locale: "ja" | "en" = "ja"): TimetableResponse {
  const t = useTranslation(locale);

  function getProgram(id: ProgramId): Program {
    const program = PROGRAMS.find((candidate) => candidate.id === id);
    if (!program) {
      throw new Error(`Program not found: ${id}`);
    }

    return resolveProgram(program, SPEAKERS, locale);
  }

  const items: TimetableItem[] = [
    {
      id: "reception",
      type: "schedule",
      tracks: ["track1", "track2", "track3", "track4"],
      start: "09:00",
      end: "10:00",
      heading: t("timetable.openingReception"),
      programs: [],
    },
    (() => {
      const program = getProgram("opening");

      const item: TimetableItem = {
        id: "opening",
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: program.title ?? "",
        headingUrl: program.url,
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("keynote");

      const item: TimetableItem = {
        id: "keynote",
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: program.title ?? "",
        headingUrl: program.url,
        programs: [program],
      };

      return item;
    })(),
    createBreak("10:50", "10:55", ["track1", "track2"]),
    (() => {
      const program = getProgram("platinum-sponsor-session-1");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("platinum-sponsor-session-2");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("platinum-sponsor-session-3");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("platinum-sponsor-session-4");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("platinum-sponsor-session-5");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("platinum-sponsor-session-6");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "session",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.platinumSponsorSession"),
        programs: [program],
      };

      return item;
    })(),
    {
      id: "schedule-11:25-12:50-track1-track2",
      type: "schedule",
      tracks: ["track1", "track2"],
      start: "11:25",
      end: "12:50",
      heading: t("timetable.lunchTime"),
      programs: [],
    },
    (() => {
      const programs = [
        getProgram("student-support-sponsor-session-1"),
        getProgram("student-support-sponsor-session-2"),
      ];
      const firstProgram = programs[0]!;

      const item: TimetableItem = {
        id: [firstProgram.type, firstProgram.start, firstProgram.end, ...firstProgram.tracks].join(
          "-",
        ),
        type: "session",
        tracks: firstProgram.tracks,
        start: firstProgram.start,
        end: firstProgram.end,
        heading: t("timetable.studentSupportSponsorSession"),
        programs,
      };

      return item;
    })(),
    (() => {
      const program = getProgram("lunch-sponsor-lt-1");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "lightningTalk",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.lunchSponsorLightningTalk"),
        programs: [program],
      };

      return item;
    })(),
    // createBreak("11:45", "11:50", ["track3"]),
    // (() => {
    //   const program = getProgram("lunch-sponsor-lt-2");

    //   const item: TimetableItem = {
    //     id: [program.type, program.start, program.end, ...program.tracks].join("-"),
    //     type: "lightningTalk",
    //     tracks: program.tracks,
    //     start: program.start,
    //     end: program.end,
    //     heading: t("timetable.lunchSponsorLightningTalk"),
    //     headingUrl: program.url,
    //     programs: [program],
    //   };

    //   return item;
    // })(),
    // createBreak("11:55", "12:00", ["track3"]),
    // (() => {
    //   const program = getProgram("lunch-sponsor-lt-3");

    //   const item: TimetableItem = {
    //     id: [program.type, program.start, program.end, ...program.tracks].join("-"),
    //     type: "lightningTalk",
    //     tracks: program.tracks,
    //     start: program.start,
    //     end: program.end,
    //     heading: t("timetable.lunchSponsorLightningTalk"),
    //     headingUrl: program.url,
    //     programs: [program],
    //   };

    //   return item;
    // })(),
    (() => {
      const program = getProgram("student-support-contents");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "event",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.studentSupportProgram"),
        programs: [program],
      };

      return item;
    })(),
    // createBreak("12:05", "12:10", ["track3"]),
    // (() => {
    //   const program = getProgram("lunch-sponsor-lt-4");

    //   const item: TimetableItem = {
    //     id: [program.type, program.start, program.end, ...program.tracks].join("-"),
    //     type: "lightningTalk",
    //     tracks: program.tracks,
    //     start: program.start,
    //     end: program.end,
    //     heading: t("timetable.lunchSponsorLightningTalk"),
    //     headingUrl: program.url,
    //     programs: [program],
    //   };

    //   return item;
    // })(),
    // createBreak("12:15", "12:50", ["track3"]),
    createBreak("12:30", "12:50", ["track4"]),
    createSession("session-1"),
    createSession("session-2"),
    createSession("session-3"),
    (() => {
      const program = getProgram("hands-on");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "event",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("handsOn.title"),
        programs: [program],
      };

      return item;
    })(),
    createBreak("13:20", "13:35", ["track1", "track2", "track3"]),
    createSession("session-4"),
    createSession("session-5"),
    createSession("session-6"),
    createBreak("14:05", "14:20", ["track1", "track2", "track3"]),
    createSession("session-7"),
    createSession("session-8"),
    createSession("session-9"),
    createBreak("14:50", "15:05", ["track1", "track2", "track3", "track4"]),
    createSession("session-10"),
    createSession("session-11"),
    createSession("session-12"),
    createSession("session-13"),
    createBreak("15:35", "15:50", ["track1", "track2", "track3", "track4"]),
    (() => {
      const program = getProgram("panel-discussion-1");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "event",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.panelDiscussion"),
        headingUrl: "/event?session=panel-discussion#panel-discussion",
        programs: [program],
      };

      return item;
    })(),
    (() => {
      const program = getProgram("panel-discussion-2");

      const item: TimetableItem = {
        id: [program.type, program.start, program.end, ...program.tracks].join("-"),
        type: "event",
        tracks: program.tracks,
        start: program.start,
        end: program.end,
        heading: t("timetable.panelDiscussion"),
        headingUrl: "/event?session=panel-discussion#panel-discussion",
        programs: [program],
      };

      return item;
    })(),
    createSession("session-14"),
    createSession("session-15"),
    createBreak("16:20", "16:35", ["track3", "track4"]),
    (() => {
      const programs = [
        getProgram("lightning-talk-1"),
        getProgram("lightning-talk-2"),
        getProgram("lightning-talk-3"),
        getProgram("lightning-talk-4"),
        getProgram("lightning-talk-5"),
        getProgram("lightning-talk-6"),
        getProgram("lightning-talk-7"),
        getProgram("lightning-talk-8"),
        getProgram("lightning-talk-9"),
        getProgram("lightning-talk-10"),
      ];

      const item: TimetableItem = {
        id: "lightningTalk-16:35-17:50-track3",
        type: "lightningTalk",
        tracks: ["track3"],
        start: "16:35",
        end: "17:50",
        heading: t("timetable.lightningTalk"),
        programs,
      };

      return item;
    })(),
    createSession("session-16"),
    {
      id: "transition-1",
      type: "schedule",
      tracks: ["track1"],
      start: "16:50",
      end: "18:00",
      heading: t("timetable.transition"),
      programs: [],
      display: {
        startTime: "",
        endTime: "",
        color: "primary",
      },
      isPcOnly: true,
    },
    createBreak("16:50", "16:55", ["track2"], true),
    createSession("session-17"),
    createBreak("17:05", "17:20", ["track4"]),
    createSession("session-18"),
    {
      id: "transition-2",
      type: "schedule",
      tracks: ["track2"],
      start: "17:25",
      end: "18:00",
      heading: t("timetable.transition"),
      programs: [],
      display: {
        startTime: "",
        endTime: "",
        color: "primary",
      },
      isPcOnly: true,
    },
    {
      id: "close",
      type: "schedule",
      tracks: ["track3", "track4"],
      start: "17:50",
      end: "19:30",
      heading: "CLOSE",
      programs: [],
      display: {
        startTime: "",
        endTime: "",
        color: "grey",
      },
    },
    {
      id: "after-party",
      type: "schedule",
      tracks: ["track1", "track2"],
      start: "18:00",
      end: "19:30",
      heading: t("timetable.afterParty"),
      programs: [],
    },
  ];
  return { items };

  function createSession(programId: ProgramId): TimetableItem {
    const program = getProgram(programId);

    const item: TimetableItem = {
      id: [program.type, program.start, program.end, ...program.tracks].join("-"),
      type: "session",
      tracks: program.tracks,
      start: program.start,
      end: program.end,
      programs: [program],
    };

    return item;
  }
  function createBreak(
    start: TimetableTime,
    end: TimetableTime,
    tracks: TimetableTrack[],
    isPcOnly = false,
  ): TimetableItem {
    return {
      id: ["schedule", start, end, ...tracks].join("-"),
      type: "schedule",
      tracks,
      start,
      end,
      heading: t("timetable.break"),
      programs: [],
      display: {
        startTime: "",
        endTime: "",
        color: "primary",
      },
      isPcOnly,
    };
  }
}
