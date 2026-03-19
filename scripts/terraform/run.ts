import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";
import { writeBackendConfig } from "./backend.ts";

loadTaskEnv();

const infraDir = resolve(repoRoot, "infra");
const command = process.argv[2];

const runTerraform = (args: string[]) =>
  execFileSync("terraform", args, {
    cwd: infraDir,
    env: process.env,
    stdio: "inherit",
  });

const initTerraform = () => {
  writeBackendConfig();
  runTerraform(["init", "-backend-config=backend.conf"]);
};

switch (command) {
  case "init":
    initTerraform();
    break;
  case "fmt":
    runTerraform(["fmt", "-recursive"]);
    break;
  case "fmt:check":
    runTerraform(["fmt", "-check", "-recursive"]);
    break;
  case "validate":
    initTerraform();
    runTerraform(["validate"]);
    break;
  case "plan":
    initTerraform();
    runTerraform(["plan"]);
    break;
  case "plan:ci":
    initTerraform();
    runTerraform(["plan", "-no-color", "-out=tfplan"]);
    break;
  case "show-plan":
    runTerraform(["show", "-no-color", "tfplan"]);
    break;
  case "apply":
    initTerraform();
    runTerraform(["apply"]);
    break;
  case "apply:ci":
    initTerraform();
    runTerraform(["apply", "-auto-approve"]);
    break;
  default:
    console.error(`Unknown terraform command: ${command ?? "(missing)"}`);
    process.exit(1);
}
