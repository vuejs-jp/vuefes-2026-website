import type { TimetableCell } from "~~/server/static-data/types/timetable";

type TimetableCellLinkSource = Pick<TimetableCell, "headingUrl" | "programs">;

/**
 * Returns the destination for the cell-wide link.
 *
 * A cell with multiple programs has no single unambiguous destination, so only
 * its heading and program links remain individually interactive.
 */
export function getTimetableCellLinkUrl({
  headingUrl,
  programs,
}: TimetableCellLinkSource): string | undefined {
  if (programs.length > 1) {
    return undefined;
  }

  return programs[0]?.url || headingUrl || undefined;
}
