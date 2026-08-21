/** Loads an image by URL, resolving once it is safe to draw onto a canvas. */
export type ImageLoader = (url: string) => Promise<HTMLImageElement>;

/**
 * Creates a memoised image loader.
 *
 * The badge face is redrawn whenever any prop changes, and most of those
 * redraws reuse the same artwork, so results are cached by URL.
 *
 * Rejections are cached too. That is deliberate: a URL that failed once is
 * treated as permanently unavailable, so the draw routine falls through to the
 * next candidate immediately instead of re-requesting a broken asset on every
 * keystroke.
 *
 * @param createImage Injection point for the `HTMLImageElement` factory, so the
 * loader can be exercised outside a browser.
 */
export function createImageLoader(
  createImage: () => HTMLImageElement = () => new Image(),
): ImageLoader {
  const cache = new Map<string, Promise<HTMLImageElement>>();

  return (url: string) => {
    const cached = cache.get(url);
    if (cached) return cached;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = createImage();
      // Required for the canvas to stay untainted, since the texture is read
      // back through `getImageData` when building the surface maps.
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      image.src = url;
    });

    cache.set(url, promise);
    return promise;
  };
}
