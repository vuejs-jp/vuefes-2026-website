import { execFileSync } from "node:child_process";
import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

loadTaskEnv();

const authToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
const mode = process.argv[2] || "preview";
const netlifyCli = resolve(repoRoot, "node_modules/.bin/netlify");

if (!authToken) {
  console.error("NETLIFY_AUTH_TOKEN or NETLIFY_API_TOKEN is required.");
  process.exit(1);
}

const runCli = (args: string[]) =>
  execFileSync(netlifyCli, [...args, "--auth", authToken], {
    cwd: repoRoot,
    stdio: "inherit",
  });

switch (mode) {
  case "deploy":
  case "preview": {
    cpSync(
      resolve(repoRoot, "infra/netlify-noindex-headers"),
      resolve(repoRoot, ".output/public/_headers"),
    );
    runCli([
      "deploy",
      "--no-build",
      "--dir=.output/public",
      "--context",
      "deploy-preview",
      "--site",
      process.env.NETLIFY_SITE_NAME || "vuefes-2026",
    ]);
    break;
  }
  case "release": {
    runCli([
      "deploy",
      "--no-build",
      "--prod",
      "--dir=.output/public",
      "--site",
      process.env.NETLIFY_SITE_NAME || "vuefes-2026",
    ]);
    break;
  }
  default:
    console.error(`Unknown deploy mode: ${mode}`);
    process.exit(1);
}
