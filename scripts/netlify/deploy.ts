import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

loadTaskEnv();

const authToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
const mode = process.argv[2] || "preview";
const netlifyCli = resolve(repoRoot, "node_modules/.bin/netlify");
const siteName = process.env.NETLIFY_SITE_NAME || "vuefes-2026";
const previewAlias = process.env.NETLIFY_DEPLOY_ALIAS || process.env.GITHUB_REF_NAME || "main";
const buildDir = resolve(repoRoot, ".output/public");

if (!authToken) {
  console.error("NETLIFY_AUTH_TOKEN or NETLIFY_API_TOKEN is required.");
  process.exit(1);
}

const runCli = (args: string[]) =>
  execFileSync(netlifyCli, [...args, "--auth", authToken], {
    cwd: repoRoot,
    stdio: "inherit",
  });

const normalizeBasePath = (value: string) => {
  if (!value || value === "/") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const prepareDeployDir = () => {
  const basePath = normalizeBasePath(process.env.NUXT_BASE_PATH || "/");

  if (basePath === "/") {
    return buildDir;
  }

  const deployRoot = resolve(repoRoot, ".output/netlify");
  const nestedDir = resolve(deployRoot, basePath.slice(1, -1));

  rmSync(deployRoot, {
    force: true,
    recursive: true,
  });
  mkdirSync(deployRoot, {
    recursive: true,
  });
  cpSync(buildDir, nestedDir, {
    recursive: true,
  });
  writeFileSync(resolve(deployRoot, "_redirects"), `/ ${basePath} 302\n`);

  return deployRoot;
};

const copyPreviewHeaders = (deployDir: string) =>
  cpSync(resolve(repoRoot, "infra/netlify-noindex-headers"), resolve(deployDir, "_headers"));

const deployDir = prepareDeployDir();

switch (mode) {
  case "preview": {
    copyPreviewHeaders(deployDir);
    runCli([
      "deploy",
      "--no-build",
      `--dir=${deployDir}`,
      "--alias",
      previewAlias,
      "--site",
      siteName,
    ]);
    break;
  }
  case "deploy": {
    copyPreviewHeaders(deployDir);
    runCli(["deploy", "--no-build", `--dir=${deployDir}`, "--site", siteName]);
    break;
  }
  case "release": {
    runCli(["deploy", "--no-build", "--prod", `--dir=${deployDir}`, "--site", siteName]);
    break;
  }
  default:
    console.error(`Unknown deploy mode: ${mode}`);
    process.exit(1);
}
