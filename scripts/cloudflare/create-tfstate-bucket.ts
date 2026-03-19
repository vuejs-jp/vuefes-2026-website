import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

loadTaskEnv();

const bucketName = process.env.TFSTATE_BUCKET_NAME || "vuefes-2026-tfstate";
const wranglerCli = resolve(repoRoot, "node_modules/.bin/wrangler");

execFileSync(wranglerCli, ["r2", "bucket", "create", bucketName], {
  cwd: repoRoot,
  env: process.env,
  stdio: "inherit",
});
