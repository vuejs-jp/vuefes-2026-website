import { describe, expect, it } from "vite-plus/test";
import { createImageLoader } from "./imageLoader";

type FakeImage = {
  crossOrigin: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  src: string;
};

/** An image factory that records every element it hands out. */
function createFakeImageFactory() {
  const created: FakeImage[] = [];

  const factory = () => {
    const image: FakeImage = { crossOrigin: "", onload: null, onerror: null, src: "" };
    created.push(image);
    return image as unknown as HTMLImageElement;
  };

  return { factory, created };
}

describe("createImageLoader", () => {
  it("resolves with the loaded image", async () => {
    const { factory, created } = createFakeImageFactory();
    const load = createImageLoader(factory);

    const pending = load("/badge.png");
    created[0]!.onload?.();

    await expect(pending).resolves.toBe(created[0]);
  });

  it("points the element at the requested URL", () => {
    const { factory, created } = createFakeImageFactory();
    void createImageLoader(factory)("/badge.png");

    expect(created[0]!.src).toBe("/badge.png");
  });

  it("requests the image anonymously, so the canvas stays readable", () => {
    const { factory, created } = createFakeImageFactory();
    void createImageLoader(factory)("/badge.png");

    expect(created[0]!.crossOrigin).toBe("anonymous");
  });

  it("sets the handlers before assigning the source, so a cached hit is not missed", () => {
    const { factory, created } = createFakeImageFactory();
    void createImageLoader(factory)("/badge.png");

    // `src` is only assigned once both handlers are in place.
    expect(created[0]!.onload).toBeTypeOf("function");
    expect(created[0]!.onerror).toBeTypeOf("function");
  });

  it("rejects with a message naming the URL", async () => {
    const { factory, created } = createFakeImageFactory();
    const load = createImageLoader(factory);

    const pending = load("/missing.png");
    created[0]!.onerror?.();

    await expect(pending).rejects.toThrow("/missing.png");
  });

  it("reuses the same request for a repeated URL", async () => {
    const { factory, created } = createFakeImageFactory();
    const load = createImageLoader(factory);

    const first = load("/badge.png");
    const second = load("/badge.png");
    created[0]!.onload?.();

    expect(second).toBe(first);
    expect(created).toHaveLength(1);
    await expect(second).resolves.toBe(created[0]);
  });

  it("keeps separate requests for different URLs", () => {
    const { factory, created } = createFakeImageFactory();
    const load = createImageLoader(factory);

    void load("/a.png");
    void load("/b.png");

    expect(created).toHaveLength(2);
    expect(created.map((image) => image.src)).toEqual(["/a.png", "/b.png"]);
  });

  it("caches failures, so a broken URL is not requested again", async () => {
    const { factory, created } = createFakeImageFactory();
    const load = createImageLoader(factory);

    const first = load("/missing.png");
    created[0]!.onerror?.();
    await expect(first).rejects.toThrow();

    await expect(load("/missing.png")).rejects.toThrow();
    expect(created).toHaveLength(1);
  });

  it("keeps its cache per loader instance", () => {
    const { factory, created } = createFakeImageFactory();

    void createImageLoader(factory)("/badge.png");
    void createImageLoader(factory)("/badge.png");

    expect(created).toHaveLength(2);
  });
});
