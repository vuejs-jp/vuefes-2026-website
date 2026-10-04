type HandlerResponse<Handler extends (...args: never[]) => unknown> = Awaited<ReturnType<Handler>>;

export type PhotoResponse = HandlerResponse<typeof import("~~/server/api/photo/index.get").default>;
export type JobBoardResponse = HandlerResponse<
  typeof import("~~/server/api/job-board/index.get").default
>;
export type RelatedEventsResponse = HandlerResponse<
  typeof import("~~/server/api/related-events/index.get").default
>;
export type SpeakersResponse = HandlerResponse<
  typeof import("~~/server/api/speakers/index.get").default
>;
export type SponsorsResponse = HandlerResponse<
  typeof import("~~/server/api/sponsors/index.get").default
>;
export type StaffsResponse = HandlerResponse<
  typeof import("~~/server/api/staffs/index.get").default
>;
export type TimetableResponse = HandlerResponse<
  typeof import("~~/server/api/timetable/index.get").default
>;
export type NameBadgeResponse = HandlerResponse<
  typeof import("~~/server/api/name-badge/index.get").default
>;
export type PublicNameBadgeResponse = HandlerResponse<
  typeof import("~~/server/api/name-badge/[userId]/index.get").default
>;
