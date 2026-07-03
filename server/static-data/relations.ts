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
