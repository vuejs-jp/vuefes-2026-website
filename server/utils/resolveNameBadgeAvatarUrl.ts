import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type NameBadgeAvatar = {
  avatarUrl: string | null;
  imageFileName: string | null;
};

export async function resolveNameBadgeAvatarUrl({
  avatarUrl,
  imageFileName,
}: NameBadgeAvatar): Promise<string | undefined> {
  if (!avatarUrl) return undefined;

  // A provider URL is kept only as a fallback when the initial R2 copy fails.
  // R2 images have a file name and need a signed URL.
  if (!imageFileName) return avatarUrl;

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS!,
    },
  });

  return await getSignedUrl(
    S3,
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: new URL(avatarUrl).pathname.split("/").pop(),
    }),
    { expiresIn: 3600 },
  );
}
