import { randomUUID } from "node:crypto";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { defineEventHandler, readFormData } from "h3";
import * as v from "valibot";
import { eq } from "drizzle-orm/sql";

import { db } from "../../db/orm";
import { attendees } from "../../db/schema";

import { getServerSession } from "#auth";
import {
  createError,
  // useRuntimeConfig,
} from "#imports";
import {} from // usePeatixApi,
"~~/server/peatix-api/usePeatixApi";

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  salesId: v.pipe(v.string(), v.minLength(1)),
  avatarImageBlob: v.optional(
    v.pipe(
      v.custom<File>((input: unknown) => input instanceof File),
      v.check((file) => sizeInMB(file.size) <= 5, "File size must be 5MB or less"),
    ),
  ),
  avatarImageName: v.optional(v.pipe(v.string(), v.minLength(1))),
});

export default defineEventHandler(async (event) => {
  if (import.meta.vfFeatures.expiredNameBadgeRegistration) {
    throw createError({
      message: "Name badge registration period has ended",
      statusCode: 403,
    });
  }

  // Authorization
  const session = await getServerSession(event);
  if (!session || !session.user || !session.userId || !session.user.email) {
    throw createError({
      message: "Unauthenticated",
      statusCode: 403,
    });
  }

  // read data
  const rawBody = (await readFormData(event))
    .entries()
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const validatedBody = v.safeParse(schema, rawBody);
  if (!validatedBody.success) {
    throw createError({
      message: "Invalid request",
      statusCode: 400,
    });
  }

  // // async data syncing
  // const { peatixEventId } = useRuntimeConfig();
  // const { client } = usePeatixApi();
  // client.GET("/event/{eventId}/list_sales/{salesId}", {
  //   params: {
  //     path: {
  //       eventId: peatixEventId,
  //       salesId: validatedBody.data.salesId,
  //     },
  //     query: { fresh: "true" },
  //   },
  // }).catch((error) => {
  //   console.error("Failed to fetch sales data from Peatix API:", error);
  // });

  const maybeRegistered = await db
    .select()
    .from(attendees)
    .where(eq(attendees.userId, session.userId))
    .get();

  const avatarImageBlob = validatedBody.output.avatarImageBlob;
  const avatarImageName = validatedBody.output.avatarImageName;
  if (Boolean(avatarImageBlob) !== Boolean(avatarImageName)) {
    throw createError({
      message: "Invalid avatar image",
      statusCode: 400,
    });
  }
  if (!avatarImageBlob && !maybeRegistered?.avatarUrl) {
    throw createError({
      message: "Avatar image is required",
      statusCode: 400,
    });
  }

  let avatarUrl = maybeRegistered?.avatarUrl;
  let imageFileName = maybeRegistered?.imageFileName;

  try {
    // image registration
    if (avatarImageBlob && avatarImageName) {
      const objectName = `${randomUUID()}-${avatarImageName}`;

      const r2Endpoint = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
      const S3 = new S3Client({
        region: "auto",
        endpoint: r2Endpoint,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS!,
        },
      });

      if (maybeRegistered?.avatarUrl && maybeRegistered.imageFileName) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          Key: new URL(maybeRegistered.avatarUrl).pathname.split("/").pop()!,
        });
        // NOTE: asynchronously delete old image
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        S3.send(deleteCommand).catch(() => {});
      }

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: encodeURIComponent(objectName),
        ContentType: avatarImageBlob.type,
        Body: Buffer.from(await avatarImageBlob.arrayBuffer()),
      });
      await S3.send(command);
      avatarUrl = encodeURI(`${r2Endpoint}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${objectName}`);
      imageFileName = avatarImageName;
    }

    try {
      // all upsert
      const data = {
        email: session.user.email,
        avatarUrl,
        imageFileName,
        displayName: validatedBody.output.name,
        receiptId: validatedBody.output.salesId,
      };
      await db
        .insert(attendees)
        .values({ userId: session.userId, ...data })
        .onConflictDoUpdate({ target: [attendees.userId], set: { ...data } });
    } catch (e) {
      console.error(e);
      throw createError({
        message: "Failed to insert attendee",
        statusCode: 500,
      });
    }
  } catch (e) {
    console.error(e);
    throw createError({
      message: "Failed to upload image",
      statusCode: 500,
    });
  }

  return { message: "Name badge registered successfully" };
});
