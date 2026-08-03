import { describe, expect, it } from "vite-plus/test";
import { getSocialLoginAvatarFileName } from "./uploadSocialLoginAvatar";

describe("getSocialLoginAvatarFileName", () => {
  it("creates a stable file name from the response content type", () => {
    expect(getSocialLoginAvatarFileName("image/jpeg")).toBe("social-login-avatar.jpg");
    expect(getSocialLoginAvatarFileName("image/png; charset=binary")).toBe(
      "social-login-avatar.png",
    );
  });

  it("rejects unsupported response content types", () => {
    expect(() => getSocialLoginAvatarFileName("text/html")).toThrow(
      "Unsupported social login avatar content type",
    );
  });
});
