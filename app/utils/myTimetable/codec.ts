import type { MyTimetableSelectionId } from "./types";

export function serializeMyTimetableSelectionIds(ids: readonly MyTimetableSelectionId[]): string {
  return JSON.stringify([...new Set(ids)]);
}

export function parseMyTimetableSelectionIds(value: string): MyTimetableSelectionId[] | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      !Array.isArray(parsed) ||
      !parsed.length ||
      parsed.some((id) => typeof id !== "string" || !id)
    ) {
      return null;
    }

    return [...new Set(parsed)];
  } catch {
    return null;
  }
}
