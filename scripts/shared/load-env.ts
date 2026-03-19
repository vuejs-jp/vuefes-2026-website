import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

export const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const envFiles = [
  { path: ".env", override: false },
  { path: ".env.local", override: true },
];

let loaded = false;

export function loadTaskEnv() {
  if (loaded) {
    return;
  }

  for (const envFile of envFiles) {
    const filePath = resolve(repoRoot, envFile.path);

    if (!existsSync(filePath)) {
      continue;
    }

    dotenv.config({
      path: filePath,
      override: envFile.override,
    });
  }

  loaded = true;
}
