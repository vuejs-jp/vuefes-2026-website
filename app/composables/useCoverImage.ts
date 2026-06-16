import { useWithBase } from "./useWithBase";

const COVER_IMAGE_DIR = "/images/top/cover";

export function useCoverImage() {
  const withBase = useWithBase();

  const srcset = (name: string, ext: string) =>
    `${withBase(`${COVER_IMAGE_DIR}/${name}.${ext}`)} 1x, ${withBase(
      `${COVER_IMAGE_DIR}/${name}-2x.${ext}`,
    )} 2x`;

  return (name: string, fallback: "png" | "jpg" = "png") => ({
    avif: srcset(name, "avif"),
    webp: srcset(name, "webp"),
    src: srcset(name, fallback),
  });
}
