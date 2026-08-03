import { defineEventHandler } from "h3";
import { eq } from "drizzle-orm/sql";

import { attendees } from "../../db/schema";
import { db } from "../../db/orm";
import { resolveNameBadgeAvatarUrl } from "../../utils/resolveNameBadgeAvatarUrl";

import { getServerSession } from "#auth";

import { createError, useRuntimeConfig } from "#imports";
import { usePeatixApi } from "~~/server/peatix-api/usePeatixApi";
import { TicketName } from "~~/server/peatix-api/constant";

export default defineEventHandler(async (event) => {
  // Authorization
  const session = await getServerSession(event);
  if (!session || !session.user || !session.userId || !session.user.email) {
    throw createError({
      message: "Unauthenticated",
      statusCode: 403,
    });
  }

  // image registration
  const nameBadgeData = await db
    .select()
    .from(attendees)
    .where(eq(attendees.userId, session.userId))
    .get();

  const { peatixEventId } = useRuntimeConfig();
  const { client } = usePeatixApi();
  let role = nameBadgeData?.role;

  if (nameBadgeData?.receiptId && !role) {
    const sale = await client
      .GET("/event/{eventId}/list_sales/{salesId}", {
        params: {
          path: {
            eventId: peatixEventId,
            salesId: nameBadgeData.receiptId,
          },
        },
      })
      .then((response) => response.data);

    if (sale) {
      role = (() => {
        switch (sale.ticketName) {
          case TicketName.EarlyBirdGeneral:
          case TicketName.General:
            return "Attendee";
          case TicketName.EarlyBirdGeneralParty:
          case TicketName.GeneralParty:
            return "Attendee+Party";
          default:
            return null;
        }
      })();

      if (role) {
        await db
          .update(attendees)
          .set({ role })
          .where(eq(attendees.userId, session.userId))
          .execute();
      }
    }
  }

  return nameBadgeData
    ? {
        name: nameBadgeData.displayName,
        avatarUrl: await resolveNameBadgeAvatarUrl(nameBadgeData),
        role: role ?? "Attendee",
        lang: nameBadgeData.lang,

        /**
         * Authorized private data
         */
        salesId: nameBadgeData.receiptId,
        avatarImageFileName: nameBadgeData.imageFileName,
      }
    : null;
});
