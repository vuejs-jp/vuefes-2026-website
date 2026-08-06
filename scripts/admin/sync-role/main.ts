import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { eq } from "drizzle-orm";
import createClient from "openapi-fetch";
import dotenv from "dotenv";

import type { paths } from "../../../server/peatix-api/schema.d.ts";
import { TicketName } from "../../../server/peatix-api/constant.ts";
import { db } from "../../../server/db/orm.ts";
import { attendees } from "../../../server/db/schema/attendee.ts";

const requiredEnvVariables = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_DATABASE_ID",
  "CLOUDFLARE_API_TOKEN",
  "PEATIX_API_ORIGIN",
  "PEATIX_API_SECRET",
  "PEATIX_EVENT_ID",
] as const;

try {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      "env-file": {
        short: "e",
        type: "string",
      },
      help: {
        short: "h",
        type: "boolean",
      },
    },
  });

  if (values.help) {
    console.log(`Usage:
  vp run sync-role [env-file]
  node scripts/admin/sync-role/main.ts [--env-file <path>]

If env-file is omitted, dotenv loads .env from the current directory.`);
    process.exit(0);
  }

  if (positionals.length > 1 || (values["env-file"] && positionals.length > 0)) {
    throw new Error("Specify exactly one env file, either as an argument or with --env-file.");
  }

  const envFile = values["env-file"] ?? positionals[0];
  const envPath = envFile ? resolve(process.cwd(), envFile) : undefined;
  const envResult = dotenv.config({
    path: envPath,
    quiet: true,
  });

  if (envPath && envResult.error) {
    throw new Error(`Failed to load env file: ${envPath}`, { cause: envResult.error });
  }

  const missingEnvVariables = requiredEnvVariables.filter((name) => !process.env[name]);

  if (missingEnvVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVariables.join(", ")}`);
  }

  const attendeesData = await db
    .select({
      userId: attendees.userId,
      receiptId: attendees.receiptId,
      role: attendees.role,
    })
    .from(attendees)
    .all();

  const client = createClient<paths>({
    baseUrl: process.env.PEATIX_API_ORIGIN!,
    headers: {
      Authorization: `Bearer ${process.env.PEATIX_API_SECRET!}`,
    },
  });

  const sales = await client
    .GET("/event/{eventId}/list_sales", {
      params: {
        path: { eventId: process.env.PEATIX_EVENT_ID! },
      },
    })
    .then((response) => response.data?.sales);

  await Promise.allSettled(
    attendeesData.map(async (attendee) => {
      const sale = sales?.find((sale) => sale.salesId === attendee.receiptId);
      if (!sale) return;

      const role = (() => {
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
          .where(eq(attendees.userId, attendee.userId))
          .execute();
      }
    }),
  );
} catch (e) {
  console.error(`[Task: db:sync-role] Failed to synchronize attendee roles:`, e);
  process.exitCode = 1;
}
