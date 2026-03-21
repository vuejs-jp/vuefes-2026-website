import { execFileSync } from "node:child_process";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { repoRoot } from "./shared/load-env.ts";

type PackageJson = {
  name?: string;
  version?: string;
};

const usage = "Usage: vp run boot <year>";
const targetYear = process.argv[2];

if (!targetYear || !/^\d{4}$/.test(targetYear)) {
  console.error(usage);
  process.exit(1);
}

const packageJson = JSON.parse(
  readFileSync(resolve(repoRoot, "package.json"), "utf8"),
) as PackageJson;
const currentYear = inferCurrentYear(packageJson);

if (!currentYear) {
  console.error("Could not infer the current festival year from package.json.");
  process.exit(1);
}

if (currentYear === targetYear) {
  console.log(`This repository is already set for ${targetYear}.`);
  printTodo({
    targetYear,
    currentYear,
    changedFiles: [],
  });
  process.exit(0);
}

const changedFiles: string[] = [];

for (const relativePath of listTrackedFiles()) {
  if (!shouldRewrite(relativePath)) {
    continue;
  }

  const absolutePath = resolve(repoRoot, relativePath);

  if (!statSync(absolutePath).isFile()) {
    continue;
  }

  const originalBuffer = readFileSync(absolutePath);

  if (!isLikelyTextFile(originalBuffer)) {
    continue;
  }

  const original = originalBuffer.toString("utf8");
  const next = original.split(currentYear).join(targetYear);

  if (original === next) {
    continue;
  }

  writeFileSync(absolutePath, next);
  changedFiles.push(relativePath);
}

console.log(`Updated ${changedFiles.length} file(s): ${currentYear} -> ${targetYear}`);

if (changedFiles.length > 0) {
  for (const path of changedFiles.slice(0, 40)) {
    console.log(`- ${path}`);
  }

  if (changedFiles.length > 40) {
    console.log(`- ...and ${changedFiles.length - 40} more`);
  }
}

printTodo({
  currentYear,
  targetYear,
  changedFiles,
});

function inferCurrentYear(pkg: PackageJson) {
  const candidates = [pkg.version, pkg.name];

  for (const value of candidates) {
    const matched = value?.match(/(20\d{2})/);

    if (matched) {
      return matched[1];
    }
  }

  return null;
}

function listTrackedFiles() {
  return execFileSync("git", ["ls-files", "-z"], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
}

function shouldRewrite(path: string) {
  const excludedPrefixes = [
    ".nuxt/",
    ".output/",
    "dist/",
    "node_modules/",
    "netlify-master/",
    "app/assets/fonts/external/",
    "public/images/sponsor-logo/",
  ];

  const excludedFiles = new Set([
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    ".cspellcache",
  ]);

  if (excludedPrefixes.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  if (excludedFiles.has(path)) {
    return false;
  }

  return true;
}

function isLikelyTextFile(buffer: Buffer) {
  return !buffer.includes(0);
}

function printTodo(args: { currentYear: string; targetYear: string; changedFiles: string[] }) {
  const { currentYear, targetYear, changedFiles } = args;
  const redirectBranch = `chore/root-redirect-${targetYear}`;

  console.log("");
  console.log(`TODO: Roll over Vue Fes Japan to ${targetYear}`);
  console.log("");
  console.log("1. Review the automatic rewrite");
  console.log(`   - Updated ${changedFiles.length} file(s) from ${currentYear} to ${targetYear}`);
  console.log(
    "   - Double-check event dates, copy, ticket information, and any content that should not simply move forward by one year",
  );
  console.log("   - Start with `git diff` to review the full change set");
  console.log("");
  console.log("2. Replace logo and visual assets manually");
  console.log(
    "   - Logo source data is managed in Google Drive, so download the latest asset there and update it manually",
  );
  console.log("   - Example destination: `public/images/logo/logo.svg`");
  console.log(
    "   - Also review visual areas where the year is visible, such as `app/components/mainVisual/MainVisual.vue`",
  );
  console.log("");
  console.log(`3. Clean up ${currentYear} images in public/images/`);
  console.log(
    `   - Remove assets that are no longer needed (e.g. ${currentYear} sponsor logos, event photos, OG Images)`,
  );
  console.log(`   - Replace assets that carry over but need updating for ${targetYear}`);
  console.log("   - Directories to review: `public/images/`");
  console.log("");
  console.log("4. Initialize the submodule");
  console.log("   - `git submodule update --init --recursive`");
  console.log("");
  console.log("5. Update the root redirect");
  console.log("   - Target: `netlify-master/netlify.toml`");
  console.log(`   - Add: \`from = "/${targetYear}/*"\``);
  console.log(`   - Add: \`to = "https://vuefes-${targetYear}.netlify.app/${targetYear}/:splat"\``);
  console.log(`   - Update the catch-all destination to \`"/${targetYear}/:splat"\``);
  console.log("");
  console.log("6. Commit and push the submodule change, then open a PR");
  console.log(`   - \`git -C netlify-master switch -c ${redirectBranch}\``);
  console.log("   - `git -C netlify-master add netlify.toml`");
  console.log(
    `   - \`git -C netlify-master commit -m "chore: update root redirects for ${targetYear}"\``,
  );
  console.log(`   - \`git -C netlify-master push -u origin ${redirectBranch}\``);
  console.log("   - Open a pull request against `vuejs-jp/vuefes-2019`");
  console.log("");
  console.log("7. After the vuefes-2019 PR is merged, update the submodule pointer in this repo");
  console.log("   - `git submodule update --remote -- netlify-master`");
  console.log("   - `git add netlify-master`");
  console.log('   - `git commit -m "chore: bump vuefes-2019 submodule"`');
  console.log("");
  console.log("8. Run the final checks");
  console.log("   - `vp run check`");
  console.log("   - Run `vp run build` if needed");
}
