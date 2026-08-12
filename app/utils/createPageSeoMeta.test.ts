import { globSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { createPageSeoMeta } from "./createPageSeoMeta";

describe("createPageSeoMeta", () => {
  it("keeps Open Graph and Twitter card metadata in sync", () => {
    const title = () => "Page title";
    const description = () => "Page description";
    const image = () => "https://vuefes.jp/2026/images/og/page.png";

    expect(createPageSeoMeta({ title, description, image })).toEqual({
      title,
      ogTitle: title,
      twitterTitle: title,
      description,
      ogDescription: description,
      twitterDescription: description,
      ogImage: image,
      twitterImage: image,
      twitterCard: "summary_large_image",
    });
  });

  it("supports a separate social title and leaves dynamic images unset", () => {
    const titleTemplate = () => "Vue Fes Japan 2026 - %s";
    const socialTitle = () => "Vue Fes Japan 2026";

    expect(createPageSeoMeta({ titleTemplate, socialTitle })).toEqual({
      titleTemplate,
      ogTitle: socialTitle,
      twitterTitle: socialTitle,
      twitterCard: "summary_large_image",
    });
  });

  it("routes Vue metadata through the shared Open Graph and Twitter helper", () => {
    const appDirectory = fileURLToPath(new URL("..", import.meta.url));
    const directUseSeoMetaCalls = globSync("**/*.vue", { cwd: appDirectory }).filter((file) =>
      /\buseSeoMeta\s*\(/.test(readFileSync(`${appDirectory}/${file}`, "utf8")),
    );

    expect(directUseSeoMetaCalls).toEqual([]);
  });
});
