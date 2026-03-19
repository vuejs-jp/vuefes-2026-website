import { writeBackendConfig } from "./backend.ts";

const backendPath = writeBackendConfig();
console.log(`[terraform] wrote ${backendPath}`);
