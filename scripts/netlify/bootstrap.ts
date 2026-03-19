import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadTaskEnv, repoRoot } from "../shared/load-env.ts";

loadTaskEnv();

type Site = {
  id: string;
  name: string;
};

const authToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
const teamSlug = process.env.NETLIFY_TEAM_SLUG || process.env.NETLIFY_ACCOUNT_SLUG;

if (!authToken) {
  console.error("NETLIFY_AUTH_TOKEN or NETLIFY_API_TOKEN is required.");
  process.exit(1);
}

if (!teamSlug) {
  console.error("NETLIFY_TEAM_SLUG or NETLIFY_ACCOUNT_SLUG is required.");
  process.exit(1);
}

const netlifyCli = resolve(repoRoot, "node_modules/.bin/netlify");
const targets = [
  {
    label: "event",
    name: process.env.NETLIFY_SITE_NAME || "vuefes-2026",
  },
];

const runCli = (args: string[]) =>
  execFileSync(netlifyCli, [...args, "--auth", authToken], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "inherit"],
  });

const listSites = () => JSON.parse(runCli(["sites:list", "--json"])) as Site[];

let sites = listSites();

for (const target of targets) {
  const existing = sites.find((site) => site.name === target.name);

  if (existing) {
    console.log(`[netlify] ${target.label} site already exists: ${target.name} (${existing.id})`);
    continue;
  }

  console.log(`[netlify] creating ${target.label} site: ${target.name}`);
  execFileSync(
    netlifyCli,
    [
      "sites:create",
      "--name",
      target.name,
      "--account-slug",
      teamSlug,
      "--disable-linking",
      "--auth",
      authToken,
    ],
    {
      stdio: "inherit",
    },
  );

  sites = listSites();
  const created = sites.find((site) => site.name === target.name);

  if (!created) {
    console.error(`[netlify] failed to find site after creation: ${target.name}`);
    process.exit(1);
  }

  console.log(`[netlify] created ${target.label} site: ${target.name} (${created.id})`);
}
