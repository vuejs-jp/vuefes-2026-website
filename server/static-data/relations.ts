type ProgramReference = {
  id: string;
};

type SponsorProgramReference = {
  programIds?: readonly string[];
};

export function excludeSponsorPrograms<TProgram extends ProgramReference>(
  programs: readonly TProgram[],
  sponsors: readonly SponsorProgramReference[],
): TProgram[] {
  const sponsorProgramIds = new Set(sponsors.flatMap((sponsor) => sponsor.programIds));
  return programs.filter((program) => !sponsorProgramIds.has(program.id));
}

type SponsorOptionReference = {
  id: string;
  option?: readonly string[];
};

type JobBoardSponsorReference = {
  sponsorId: string;
};

/**
 * ジョブボードに掲載する会社は、スポンサー側で `option: ["job-board"]` を持つ必要がある。
 * 一致しない sponsorId (typo やスポンサー側の option 付け忘れ) を返す。
 */
export function findUnlistedJobBoardSponsorIds(
  jobBoards: readonly JobBoardSponsorReference[],
  sponsors: readonly SponsorOptionReference[],
): string[] {
  const jobBoardSponsorIds = new Set(
    sponsors
      .filter((sponsor) => sponsor.option?.includes("job-board"))
      .map((sponsor) => sponsor.id),
  );
  return jobBoards
    .map((jobBoard) => jobBoard.sponsorId)
    .filter((sponsorId) => !jobBoardSponsorIds.has(sponsorId));
}
