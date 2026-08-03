import { describe, expect, it } from "vite-plus/test";
import { resolveNameBadgeAvatarUrl } from "./resolveNameBadgeAvatarUrl";

describe("resolveNameBadgeAvatarUrl", () => {
  it("uses a social login avatar URL without signing it", async () => {
    const avatarUrl = "https://avatars.example.com/account/image.png";

    await expect(resolveNameBadgeAvatarUrl({ avatarUrl, imageFileName: null })).resolves.toBe(
      avatarUrl,
    );
  });

  it("returns undefined when the account has no avatar", async () => {
    await expect(
      resolveNameBadgeAvatarUrl({ avatarUrl: null, imageFileName: null }),
    ).resolves.toBeUndefined();
  });
});
