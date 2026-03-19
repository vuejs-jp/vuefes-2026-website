# Vue Fes Japan 2026 Infrastructure

Terraform configuration for managing Netlify and Cloudflare resources.

## Overview

This configuration manages:

- **Cloudflare D1**: SQLite databases for dev/prod
- **Cloudflare R2**: Object storage buckets for dev/prod and Terraform state
- **Netlify**: Site configuration, domain settings, and environment variables

## Important Constraint

The Netlify Terraform provider currently manages settings for existing sites,
but it does not create the site resource itself. In this repository, blank
sites are bootstrapped by the Netlify CLI and then managed by Terraform, and
the operational entrypoint is `vp run`.

### Deploy Flow

- **Preview**: Push to `main` → CI workflow builds and deploys via `netlify-cli deploy`
- **Production**: `vp run release <alpha|beta|rc|minor|patch>` → tag push → release workflow builds and deploys the year site
- **Root redirect site**: maintained in the `netlify-master` submodule (`vuejs-jp/vuefes-2019`) and deployed from that repository / Netlify dashboard

Netlify auto-builds are disabled (`stop_builds = true`). All builds are handled by GitHub Actions.

## Prerequisites

1. Nix with flakes enabled, then `nix develop` from the repository root
2. [Vite+](https://vite.plus/) (`vp`)
3. [Terraform](https://www.terraform.io/downloads) v1.7.0 or higher if you are not using the project Nix shell
4. Cloudflare API token with permissions:
   - D1: Edit
   - R2: Edit
   - Account Settings: Read
5. Netlify Personal Access Token

The root `flake.nix` supplies Node.js 24 and Terraform for local work, so the recommended flow is to enter `nix develop` before running any `vp` task.

## Setup

### 1. Create the tfstate bucket manually

Before initializing Terraform, create the R2 bucket for state storage:

```bash
vp run tfstate:create
```

### 2. Bootstrap Netlify sites

```bash
vp run netlify:bootstrap
```

By default this creates:

- `vuefes-2026`

Override it with `NETLIFY_SITE_NAME` in `.env.local` if needed.

### 3. Fill `.env` or `.env.local`

Use [`.env.example`](/Users/ubugeeei/projects/personal/oss/vuejs-jp/vuefes-2026/.env.example) as the source of truth for the required keys.

### 4. Create terraform.tfvars

Create `terraform.tfvars` from [terraform.tfvars.example](/Users/ubugeeei/projects/personal/oss/vuejs-jp/vuefes-2026/infra/terraform.tfvars.example) and edit the values.

### 5. Initialize Terraform via Vite task

```bash
vp run terraform:init
```

`vp run terraform:init` writes `infra/backend.conf` automatically. You can also
use `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in `.env.local` instead of `R2_TFSTATE_*`.

## Usage

### Plan changes

```bash
vp run terraform:plan
```

### Apply changes

```bash
vp run terraform:apply
```

### Import existing resources

The `imports.tf` file contains import blocks for existing resources. Uncomment the relevant blocks and run:

```bash
vp run terraform:plan  # Verify import
vp run terraform:apply # Apply import
```

## GitHub Actions

### Terraform (`.github/workflows/terraform.yml`)

- **On PR**: `vp run terraform:plan:ci` with results posted as a comment
- **On merge to main**: `vp run terraform:apply:ci`

### Deploy Preview (`.github/workflows/deploy-preview.yml`)

- **On push**: Spell check, lint, type check, build
- **On push to main**: Build + preview deploy to Netlify

### Release (`.github/workflows/release.yml`)

- **On tag push (`v*`)**: Create GitHub Release + production deploy to the year site

### Required Secrets

| Name                           | Description                              |
| ------------------------------ | ---------------------------------------- |
| `CLOUDFLARE_API_TOKEN`         | Cloudflare API token                     |
| `CLOUDFLARE_ACCOUNT_ID`        | Cloudflare Account ID (vars)             |
| `R2_TFSTATE_ACCESS_KEY_ID`     | R2 Access Key ID (for state backend)     |
| `R2_TFSTATE_SECRET_ACCESS_KEY` | R2 Secret Access Key (for state backend) |
| `NETLIFY_API_TOKEN`            | Netlify Personal Access Token            |
| `AUTH_SECRET`                  | Auth.js secret for production builds     |
| `PEATIX_API_SECRET`            | Peatix API secret for production builds  |

### Recommended Variables

| Name                | Description                               |
| ------------------- | ----------------------------------------- |
| `NETLIFY_TEAM_SLUG` | Netlify team slug                         |
| `NETLIFY_SITE_NAME` | Year site name, defaults to `vuefes-2026` |

## File Structure

```
infra/
├── backend.tf               # Terraform state backend (R2)
├── host-dev-preview.tf      # Dev/preview resources (D1 dev, R2 dev)
├── host-production.tf       # Production resources (D1 prod, R2 prod, Netlify site/build/env)
├── imports.tf               # Existing resource imports
├── outputs.tf               # Output definitions
├── providers.tf             # Provider configuration
├── variables.tf             # Input variable definitions
├── versions.tf              # Terraform/provider versions
└── terraform.tfvars.example # Variable examples
```

## Notes

### State Locking

R2 does not support DynamoDB-style state locking. The GitHub Actions workflow uses `concurrency` groups to prevent concurrent runs.

### Database Schema

Terraform manages infrastructure only. Database schema migrations are handled by Drizzle Kit:

```bash
vp run db:generate  # Generate migrations
vp run db:migrate   # Apply migrations
```

### Environment Separation

- **dev**: Used for preview deployments and development
- **prod**: Used for production deployments

Resources are named with environment suffix (e.g., `vuefes-2026-dev`, `vuefes-2026-prod`).
