# Vue Fes Japan 2026 Infrastructure

Terraform configuration for managing Netlify and Cloudflare resources.

## Overview

This configuration manages:

- **Cloudflare D1**: SQLite databases for dev/prod
- **Cloudflare R2**: Object storage buckets for dev/prod and Terraform state
- **Netlify**: Site configuration and environment variables

### Deploy Flow

- **Preview**: Push to `main` → CI workflow builds and deploys via `netlify-cli deploy`
- **Production**: `pnpm run release <alpha|beta|rc|minor|patch>` → tag push → release workflow builds and deploys via `netlify-cli deploy --prod`

Netlify auto-builds are disabled (`stop_builds = true`). All builds are handled by GitHub Actions.

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads) v1.7.0 or higher
2. Cloudflare API token with permissions:
   - D1: Edit
   - R2: Edit
   - Account Settings: Read
3. Netlify Personal Access Token

## Setup

### 1. Create the tfstate bucket manually

Before initializing Terraform, create the R2 bucket for state storage:

```bash
npx wrangler r2 bucket create vuefes-2026-tfstate
```

### 2. Set environment variables

```bash
# Cloudflare
export CLOUDFLARE_API_TOKEN="your-api-token"

# Netlify
export NETLIFY_API_TOKEN="your-netlify-token"
```

### 3. Create terraform.tfvars

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Create backend.conf

```bash
cat > backend.conf <<EOF
endpoints = {
  s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
}
EOF
```

### 5. Initialize Terraform

```bash
# R2 credentials are passed via environment variables
# (Terraform S3 backend uses AWS SDK internally)
AWS_ACCESS_KEY_ID=<R2_TFSTATE_ACCESS_KEY_ID> \
AWS_SECRET_ACCESS_KEY=<R2_TFSTATE_SECRET_ACCESS_KEY> \
terraform init -backend-config=backend.conf
```

## Usage

### Plan changes

```bash
terraform plan
```

### Apply changes

```bash
terraform apply
```

### Import existing resources

The `imports.tf` file contains import blocks for existing resources. Uncomment the relevant blocks and run:

```bash
terraform plan  # Verify import
terraform apply # Apply import
```

## GitHub Actions

### Terraform (`.github/workflows/terraform.yml`)

- **On PR**: `terraform plan` with results posted as a comment
- **On merge to main**: `terraform apply -auto-approve`

### CI (`.github/workflows/ci.yml`)

- **On push**: Spell check, lint, type check, build
- **On push to main**: Build + preview deploy to Netlify

### Release (`.github/workflows/release.yml`)

- **On tag push (`v*`)**: Create GitHub Release + production deploy to Netlify

### Required Secrets

| Name                           | Description                              |
| ------------------------------ | ---------------------------------------- |
| `CLOUDFLARE_API_TOKEN`         | Cloudflare API token                     |
| `CLOUDFLARE_ACCOUNT_ID`        | Cloudflare Account ID (vars)             |
| `R2_TFSTATE_ACCESS_KEY_ID`     | R2 Access Key ID (for state backend)     |
| `R2_TFSTATE_SECRET_ACCESS_KEY` | R2 Secret Access Key (for state backend) |
| `NETLIFY_API_TOKEN`            | Netlify Personal Access Token            |
| `NETLIFY_AUTH_TOKEN`           | Netlify auth token (for CLI deploys)     |
| `NETLIFY_SITE_ID`              | Netlify site ID (for CLI deploys)        |

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
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Apply migrations
```

### Environment Separation

- **dev**: Used for preview deployments and development
- **prod**: Used for production deployments

Resources are named with environment suffix (e.g., `vuefes-2026-dev`, `vuefes-2026-prod`).
