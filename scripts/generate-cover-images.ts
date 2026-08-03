import { access, copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp, { type Sharp } from "sharp";

// cspell:ignore subsampling

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT_DIRECTORY = path.join(REPOSITORY_ROOT, "public/images/top/cover");

const variants = ["pc", "pc-2x", "sp", "sp-2x"] as const;
const formats = [
  {
    extension: "webp",
    encode: (image: Sharp) => image.webp({ quality: 80, effort: 6, smartSubsample: true }),
  },
  {
    extension: "avif",
    encode: (image: Sharp) => image.avif({ quality: 60, effort: 6, chromaSubsampling: "4:4:4" }),
  },
] as const;

const usage = `Usage:
  vp run generate:cover-images <name> [input-directory] [output-directory]

Example:
  vp run generate:cover-images get-your-ticket ./image-exports

Expected JPG files:
  <name>-pc.jpg
  <name>-pc-2x.jpg
  <name>-sp.jpg
  <name>-sp-2x.jpg

The input directory defaults to public/images/top/cover.
The output directory defaults to public/images/top/cover.`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

const [name, inputDirectoryArgument, outputDirectoryArgument] = args;

if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error(`${usage}\n\n<name> must contain only lowercase letters, numbers, and hyphens.`);
  process.exit(1);
}

const inputDirectory = path.resolve(inputDirectoryArgument ?? DEFAULT_OUTPUT_DIRECTORY);
const outputDirectory = path.resolve(outputDirectoryArgument ?? DEFAULT_OUTPUT_DIRECTORY);

const sources = variants.map((variant) => ({
  variant,
  path: path.join(inputDirectory, `${name}-${variant}.jpg`),
}));

await Promise.all(
  sources.map(async (source) => {
    try {
      await access(source.path);
    } catch {
      throw new Error(`Input file not found: ${source.path}`);
    }
  }),
);

const metadata = new Map<(typeof variants)[number], { width: number; height: number }>();

await Promise.all(
  sources.map(async (source) => {
    const sourceMetadata = await sharp(source.path).metadata();

    if (sourceMetadata.format !== "jpeg") {
      throw new Error(`Input file is not a JPEG: ${source.path}`);
    }
    if (!sourceMetadata.width || !sourceMetadata.height) {
      throw new Error(`Could not read image dimensions: ${source.path}`);
    }

    metadata.set(source.variant, {
      width: sourceMetadata.width,
      height: sourceMetadata.height,
    });
  }),
);

for (const target of ["pc", "sp"] as const) {
  const oneX = metadata.get(target)!;
  const twoX = metadata.get(`${target}-2x`)!;

  if (twoX.width !== oneX.width * 2 || twoX.height !== oneX.height * 2) {
    throw new Error(
      `${name}-${target}-2x.jpg must be exactly twice the size of ${name}-${target}.jpg ` +
        `(${oneX.width}x${oneX.height} expected ${oneX.width * 2}x${oneX.height * 2}, ` +
        `received ${twoX.width}x${twoX.height}).`,
    );
  }
}

await mkdir(outputDirectory, { recursive: true });

const jpgOutputs = await Promise.all(
  sources.map(async (source) => {
    const outputPath = path.join(outputDirectory, `${name}-${source.variant}.jpg`);
    if (source.path !== outputPath) {
      await copyFile(source.path, outputPath);
    }
    const outputStat = await stat(outputPath);
    return { outputPath, size: outputStat.size };
  }),
);

const convertedOutputs = await Promise.all(
  sources.flatMap((source) =>
    formats.map(async ({ extension, encode }) => {
      const outputPath = path.join(outputDirectory, `${name}-${source.variant}.${extension}`);
      await encode(sharp(source.path)).toFile(outputPath);
      const outputStat = await stat(outputPath);
      return { outputPath, size: outputStat.size };
    }),
  ),
);

const outputs = [...jpgOutputs, ...convertedOutputs];

for (const output of outputs) {
  const displayedPath = path.relative(REPOSITORY_ROOT, output.outputPath);
  console.log(`Generated ${displayedPath} (${(output.size / 1024).toFixed(1)} KiB)`);
}

console.log(`Generated ${outputs.length} cover images from ${sources.length} JPG files.`);
