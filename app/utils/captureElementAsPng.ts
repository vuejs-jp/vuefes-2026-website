import { toBlob } from "html-to-image";

const CAPTURE_WIDTH = 1200;
const IMAGE_FETCH_TIMEOUT_MS = 10_000;
const IMAGE_DECODE_TIMEOUT_MS = 5_000;
const IMAGE_FETCH_ATTEMPTS = 2;

export async function captureElementAsPng(element: HTMLElement): Promise<Blob> {
  const captureRoot = document.createElement("div");
  const captureTarget = element.cloneNode(true) as HTMLElement;

  captureRoot.style.position = "fixed";
  captureRoot.style.inset = "0 auto auto -10000px";
  captureRoot.style.width = `${CAPTURE_WIDTH}px`;
  captureRoot.style.pointerEvents = "none";
  captureRoot.style.opacity = "0";
  captureRoot.setAttribute("aria-hidden", "true");
  captureRoot.inert = true;
  captureTarget.classList.add("is-capturing");
  captureRoot.append(captureTarget);
  document.body.append(captureRoot);

  try {
    await document.fonts.ready;
    await inlineImages(captureTarget);

    const blob = await toBlob(captureTarget, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      skipAutoScale: true,
      width: CAPTURE_WIDTH,
    });

    if (!blob) {
      throw new Error("Timetable image generation failed");
    }

    return blob;
  } finally {
    captureRoot.remove();
  }
}

async function inlineImages(element: HTMLElement): Promise<void> {
  await Promise.all(
    [...element.querySelectorAll("img")].map(async (image) => {
      const source = image.currentSrc || image.src;
      if (!source) {
        throw new Error("Image source is unavailable");
      }

      image.loading = "eager";
      image.decoding = "sync";
      image.srcset = "";
      image.src = source.startsWith("data:") ? source : await fetchImageAsDataUrl(source);

      await decodeImage(image, source);
    }),
  );
}

async function fetchImageAsDataUrl(source: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < IMAGE_FETCH_ATTEMPTS; attempt += 1) {
    try {
      const blob = await fetchImage(source);
      return await readBlobAsDataUrl(blob);
    } catch (error) {
      lastError = error;
    }
  }

  const detail = lastError instanceof Error ? `: ${lastError.message}` : "";
  throw new Error(`Image fetch failed for ${source}${detail}`);
}

async function fetchImage(source: string): Promise<Blob> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(source, {
      cache: "force-cache",
      credentials: "same-origin",
      signal: abortController.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error(`Unexpected content type: ${blob.type || "unknown"}`);
    }

    return blob;
  } finally {
    clearTimeout(timeoutId);
  }
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }
        reject(new Error("Image conversion failed"));
      },
      { once: true },
    );
    reader.addEventListener("error", () => reject(reader.error), { once: true });
    reader.addEventListener("abort", () => reject(new Error("Image conversion aborted")), {
      once: true,
    });
    reader.readAsDataURL(blob);
  });
}

async function decodeImage(image: HTMLImageElement, source: string): Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      image.decode(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`Image decode timed out for ${source}`)),
          IMAGE_DECODE_TIMEOUT_MS,
        );
      }),
    ]);
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : "";
    throw new Error(`Image decode failed for ${source}${detail}`);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
    throw new Error(`Decoded image is unavailable for ${source}`);
  }
}
