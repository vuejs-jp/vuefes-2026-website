import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

export function writeBackendConfig() {
  loadTaskEnv();

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKey = process.env.R2_TFSTATE_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.R2_TFSTATE_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!accountId) {
    console.error("CLOUDFLARE_ACCOUNT_ID is required.");
    process.exit(1);
  }

  if ((accessKey && !secretKey) || (!accessKey && secretKey)) {
    console.error(
      "Set both R2_TFSTATE_ACCESS_KEY_ID and R2_TFSTATE_SECRET_ACCESS_KEY, or rely on AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.",
    );
    process.exit(1);
  }

  const backendPath = resolve(repoRoot, "infra/backend.conf");
  const lines = ["endpoints = {", `  s3 = "https://${accountId}.r2.cloudflarestorage.com"`, "}"];

  if (accessKey && secretKey) {
    lines.push(`access_key = "${accessKey}"`);
    lines.push(`secret_key = "${secretKey}"`);
  }

  writeFileSync(backendPath, `${lines.join("\n")}\n`);
  return backendPath;
}
