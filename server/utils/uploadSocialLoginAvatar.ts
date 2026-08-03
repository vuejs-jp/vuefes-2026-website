import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const SOCIAL_LOGIN_AVATAR_FILE_NAME = "social-login-avatar";

const imageExtensions = new Map([
  ["image/avif", "avif"],
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export function getSocialLoginAvatarFileName(contentType: string | null): string {
  const normalizedContentType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  const extension = normalizedContentType && imageExtensions.get(normalizedContentType);

  if (!extension) {
    throw new Error(`Unsupported social login avatar content type: ${contentType ?? "unknown"}`);
  }

  return `${SOCIAL_LOGIN_AVATAR_FILE_NAME}.${extension}`;
}

export async function uploadSocialLoginAvatar(userId: string, imageUrl: string) {
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Failed to download social login avatar: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  const imageFileName = getSocialLoginAvatarFileName(contentType);
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_AVATAR_SIZE_BYTES) {
    throw new Error("Social login avatar must be 5MB or less");
  }

  const body = Buffer.from(await response.arrayBuffer());
  if (body.byteLength > MAX_AVATAR_SIZE_BYTES) {
    throw new Error("Social login avatar must be 5MB or less");
  }

  const r2Endpoint = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const objectName = `${userId}-${SOCIAL_LOGIN_AVATAR_FILE_NAME}`;
  const S3 = new S3Client({
    region: "auto",
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS!,
    },
  });

  await S3.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: objectName,
      ContentType: contentType!,
      Body: body,
    }),
  );

  return {
    avatarUrl: encodeURI(`${r2Endpoint}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${objectName}`),
    imageFileName,
  };
}
