import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const TARGETS: Record<string, string> = {
  alpha: "prerelease --preid alpha",
  beta: "prerelease --preid beta",
  rc: "prerelease --preid rc",
  minor: "minor",
  patch: "patch",
};

const bumpTarget = process.argv[2];

if (!bumpTarget || !(bumpTarget in TARGETS)) {
  console.error(`Usage: vp run release <${Object.keys(TARGETS).join("|")}>`);
  process.exit(1);
}

// Bump version (without git commit/tag — we handle that ourselves)
execSync(`vp pm version ${TARGETS[bumpTarget]} --no-git-tag-version`, { stdio: "inherit" });

// Read the new version
const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const tag = `v${pkg.version}`;

// Commit, tag, and push
execSync("git add package.json", { stdio: "inherit" });
execSync(`git commit -m "${tag}"`, { stdio: "inherit" });
execSync(`git tag ${tag}`, { stdio: "inherit" });
execSync("git push", { stdio: "inherit" });
execSync("git push --tags", { stdio: "inherit" });

console.log(`\n✅ Released ${tag}`);
