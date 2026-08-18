import { readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const TARGET_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_QUALITY = 1;
const MAX_QUALITY = 100;
const MAX_RESIZE_ATTEMPTS = 6;
const DEFAULT_IMAGE_DIRECTORY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "input/img",
);

type ImageFormat = "jpeg" | "png";

type CompressionCandidate = {
  body: Buffer;
  quality: number;
};

const usage = `Usage:
  pnpm dlx tsx scripts/admin/name-badge/compress-images.ts [file-or-directory ...]

If no path is specified, scripts/admin/name-badge/input/img is processed.
JPEG and PNG files of 5 MB or more are overwritten in place after compression.`;

function getImageFormat(filePath: string): ImageFormat | null {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "jpeg";
    case ".png":
      return "png";
    default:
      return null;
  }
}

function formatImageSize(size: number): string {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function clampQuality(quality: number): number {
  return Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, quality));
}

async function collectImageFiles(targetPath: string): Promise<string[]> {
  const targetStat = await stat(targetPath);

  if (targetStat.isFile()) {
    if (!getImageFormat(targetPath)) {
      throw new Error(`Unsupported image format: ${targetPath}`);
    }
    return [targetPath];
  }

  if (!targetStat.isDirectory()) {
    throw new Error(`Path is neither a file nor a directory: ${targetPath}`);
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetPath, entry.name);
      if (entry.isDirectory()) return collectImageFiles(entryPath);
      if (entry.isFile() && getImageFormat(entryPath)) return [entryPath];
      return [];
    }),
  );

  return files.flat();
}

async function encodeImage(
  source: Buffer,
  format: ImageFormat,
  quality: number,
  width: number,
): Promise<Buffer> {
  let image = sharp(source).autoOrient();

  if (width > 0) {
    image = image.resize({ width, withoutEnlargement: true });
  }

  if (format === "png") {
    return image
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality,
        effort: 10,
      })
      .toBuffer();
  }

  return image.jpeg({ quality, mozjpeg: true }).toBuffer();
}

async function findBestQuality(
  source: Buffer,
  format: ImageFormat,
  width: number,
  sourceWidth: number,
): Promise<{ best: CompressionCandidate | null; smallest: CompressionCandidate }> {
  const candidates = new Map<number, CompressionCandidate>();
  let best: CompressionCandidate | null = null;
  let smallest: CompressionCandidate | null = null;

  const evaluate = async (quality: number): Promise<CompressionCandidate> => {
    const normalizedQuality = clampQuality(quality);
    const cached = candidates.get(normalizedQuality);
    if (cached) return cached;

    const candidate = {
      body: await encodeImage(source, format, normalizedQuality, width),
      quality: normalizedQuality,
    };
    candidates.set(normalizedQuality, candidate);

    if (!smallest || candidate.body.length < smallest.body.length) {
      smallest = candidate;
    }
    if (
      candidate.body.length <= TARGET_SIZE_BYTES &&
      (!best || candidate.body.length > best.body.length)
    ) {
      best = candidate;
    }

    return candidate;
  };

  const estimatedSizeAtFullQuality = source.length * (width / sourceWidth) ** 2;
  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  let quality = clampQuality(
    Math.round((TARGET_SIZE_BYTES / estimatedSizeAtFullQuality) * MAX_QUALITY),
  );

  while (low <= high) {
    const candidate = await evaluate(quality);

    if (candidate.body.length <= TARGET_SIZE_BYTES) {
      low = quality + 1;
    } else {
      high = quality - 1;
    }

    if (low <= high) quality = Math.floor((low + high) / 2);
  }

  // Check around the boundary because encoded sizes are not perfectly linear with quality.
  for (let boundaryQuality = high - 2; boundaryQuality <= low + 2; boundaryQuality++) {
    await evaluate(boundaryQuality);
  }

  return { best, smallest: smallest! };
}

async function compressImage(filePath: string): Promise<"compressed" | "skipped"> {
  const source = await readFile(filePath);
  if (source.length < TARGET_SIZE_BYTES) {
    console.log(`[Skip] ${filePath} (${formatImageSize(source.length)})`);
    return "skipped";
  }

  const format = getImageFormat(filePath)!;
  const metadata = await sharp(source).metadata();
  const sourceWidth = metadata.autoOrient.width;
  let outputWidth = sourceWidth;

  for (let resizeAttempt = 0; resizeAttempt < MAX_RESIZE_ATTEMPTS; resizeAttempt++) {
    const { best, smallest } = await findBestQuality(source, format, outputWidth, sourceWidth);

    if (best) {
      const temporaryPath = `${filePath}.${process.pid}.tmp`;
      try {
        await writeFile(temporaryPath, best.body);
        await rename(temporaryPath, filePath);
      } finally {
        await rm(temporaryPath, { force: true });
      }

      console.log(
        `[Compressed] ${filePath}: ${formatImageSize(source.length)} -> ${formatImageSize(best.body.length)} ` +
          `(quality: ${best.quality}, width: ${outputWidth}px)`,
      );
      return "compressed";
    }

    const targetScale = Math.sqrt(TARGET_SIZE_BYTES / smallest.body.length) * 0.98;
    outputWidth = Math.max(1, Math.floor(outputWidth * Math.min(targetScale, 0.9)));
  }

  throw new Error(`Could not compress ${filePath} to ${formatImageSize(TARGET_SIZE_BYTES)}`);
}

try {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      help: {
        short: "h",
        type: "boolean",
      },
    },
  });

  if (values.help) {
    console.log(usage);
    process.exit(0);
  }

  const targets =
    positionals.length > 0
      ? positionals.map((target) => path.resolve(target))
      : [DEFAULT_IMAGE_DIRECTORY];
  const imageFiles = [
    ...new Set((await Promise.all(targets.map(collectImageFiles))).flat()),
  ].sort();

  if (imageFiles.length === 0) {
    console.log("No JPEG or PNG images found.");
    process.exit(0);
  }

  let compressedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const imageFile of imageFiles) {
    try {
      const result = await compressImage(imageFile);
      if (result === "compressed") compressedCount++;
      else skippedCount++;
    } catch (error) {
      failedCount++;
      console.error(`[Error] ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(
    `Finished: ${compressedCount} compressed, ${skippedCount} skipped, ${failedCount} failed.`,
  );

  if (failedCount > 0) process.exitCode = 1;
} catch (error) {
  console.error(`[Error] ${error instanceof Error ? error.message : String(error)}\n\n${usage}`);
  process.exitCode = 1;
}
