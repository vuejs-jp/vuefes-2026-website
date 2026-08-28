import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const TARGETS: Record<string, string[]> = {
  alpha: ["prerelease", "--preid", "alpha"],
  beta: ["prerelease", "--preid", "beta"],
  rc: ["prerelease", "--preid", "rc"],
  minor: ["minor"],
  patch: ["patch"],
};

const bumpTarget = process.argv[2];

if (!bumpTarget || !(bumpTarget in TARGETS)) {
  console.error(`Usage: vp run release <${Object.keys(TARGETS).join("|")}>`);
  process.exit(1);
}

const run = (command: string, args: string[]) => {
  execFileSync(command, args, { stdio: "inherit" });
};

// Bump version (without git commit/tag — we handle that ourselves)
run("vpx", ["pnpm", "version", ...TARGETS[bumpTarget], "--no-git-tag-version"]);

// Read the new version
const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const tag = `v${pkg.version}`;

// Commit, tag, and push
run("git", ["add", "package.json"]);
run("git", ["commit", "-m", tag]);
run("git", ["tag", tag]);
run("git", ["push"]);
run("git", ["push", "origin", `refs/tags/${tag}`]);

console.log(`\n✅ Released ${tag}`);
