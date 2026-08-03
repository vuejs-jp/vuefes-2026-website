import { toBlob } from "html-to-image";

const CAPTURE_WIDTH = 1200;

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
    await waitForImages(captureTarget);

    const blob = await toBlob(captureTarget, {
      backgroundColor: "#ffffff",
      cacheBust: true,
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

async function waitForImages(element: HTMLElement): Promise<void> {
  await Promise.all(
    [...element.querySelectorAll("img")].map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
}
