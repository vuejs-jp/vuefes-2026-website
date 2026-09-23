import type { attendees } from "../db/schema";

type NameBadgeRole = NonNullable<typeof attendees.$inferSelect.role>;

const SUPPORTED_ROLES: ReadonlySet<string> = new Set<NameBadgeRole>([
  "Attendee",
  "Attendee+Party",
  "Sponsor",
  "Speaker",
  "Staff",
]);

export function isSupportedNameBadgeRole(role: unknown): role is NameBadgeRole {
  return typeof role === "string" && SUPPORTED_ROLES.has(role);
}
