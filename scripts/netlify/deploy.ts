import { execFileSync } from "node:child_process";
import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

loadTaskEnv();

const authToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
const mode = process.argv[2] || "preview";
const netlifyCli = resolve(repoRoot, "node_modules/.bin/netlify");
const siteName = process.env.NETLIFY_SITE_NAME || "vuefes-2026";
const previewAlias = process.env.NETLIFY_DEPLOY_ALIAS || process.env.GITHUB_REF_NAME || "main";

if (!authToken) {
  console.error("NETLIFY_AUTH_TOKEN or NETLIFY_API_TOKEN is required.");
  process.exit(1);
}

const runCli = (args: string[]) =>
  execFileSync(netlifyCli, [...args, "--auth", authToken], {
    cwd: repoRoot,
    stdio: "inherit",
  });

const copyPreviewHeaders = () =>
  cpSync(
    resolve(repoRoot, "infra/netlify-noindex-headers"),
    resolve(repoRoot, ".output/public/_headers"),
  );

switch (mode) {
  case "preview": {
    copyPreviewHeaders();
    runCli([
      "deploy",
      "--no-build",
      "--dir=.output/public",
      "--alias",
      previewAlias,
      "--site",
      siteName,
    ]);
    break;
  }
  case "deploy": {
    copyPreviewHeaders();
    runCli(["deploy", "--no-build", "--dir=.output/public", "--site", siteName]);
    break;
  }
  case "release": {
    runCli(["deploy", "--no-build", "--prod", "--dir=.output/public", "--site", siteName]);
    break;
  }
  default:
    console.error(`Unknown deploy mode: ${mode}`);
    process.exit(1);
}
