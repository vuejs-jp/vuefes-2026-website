# Name Badge Admin Scripts

Participant name badge data management tool for Vue Fes Japan 2026

## Setup

### 1. Environment Variables (`.env`)

```env
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS=xxx
CLOUDFLARE_R2_BUCKET_NAME=xxx
```

### 2. Create Data File (`input/data.ts`)

Since `/input/img` is gitignored, to place image files.

```typescript
import path from "node:path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

import type { NameBadgeInput } from "./type";

const data: NameBadgeInput[] = [
  // Create new
  {
    name: "Taro Yamada",
    role: "Attendee", // Attendee | Attendee+Party | Speaker | Sponsor | Staff
    localAvatarImagePath: path.resolve(__dirname, "./images/yamada.jpg"),
  },

  // Staff (language specification required)
  {
    name: "Hanako Suzuki",
    role: "Staff",
    lang: "ja,en",
    localAvatarImagePath: path.resolve(__dirname, "./images/suzuki.png"),
  },

  // Update
  {
    name: "Jiro Tanaka",
    role: "Speaker",
    action: "update",
    localAvatarImagePath: path.resolve(__dirname, "./images/tanaka_new.jpg"), // Optional
  },

  // Delete
  {
    name: "Saburo Sato",
    role: "Sponsor",
    action: "delete",
  },
];

export default data;
```

### 3. Compress Images Larger Than 5 MB

The script overwrites JPEG and PNG files of 5 MB or more in place. It adjusts the quality based on
the encoded file size and selects the result closest to 5 MB without exceeding it.

When no path is specified, all images in `input/img` are processed.

```bash
pnpm dlx tsx scripts/admin/name-badge/compress-images.ts
```

To process specific files or directories, pass their paths as arguments.

```bash
pnpm dlx tsx scripts/admin/name-badge/compress-images.ts path/to/avatar.png path/to/images
```

## Execution

When no env file is specified, `.env` in the current directory is loaded.

```bash
pnpm dlx tsx scripts/admin/name-badge/main.ts
```

To use a different env file, pass it as a positional argument or with `--env-file` (`-e`).

```bash
pnpm dlx tsx scripts/admin/name-badge/main.ts .env.prod
pnpm dlx tsx scripts/admin/name-badge/main.ts --env-file .env.prod
```

## Notes

- **Image formats**: `.png`, `.jpg`, `.jpeg` only
- **Unique**: Combination of name + role must be unique
- **Images are automatically uploaded to Cloudflare R2**
