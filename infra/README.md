# Vue Fes Japan 2026 Infrastructure

Terraform configuration for managing Netlify and Cloudflare resources.

## Overview

This configuration manages:
- **Cloudflare D1**: SQLite databases for dev/prod
- **Cloudflare R2**: Object storage buckets for dev/prod and Terraform state
- **Netlify**: Site configuration and environment variables

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads) >= 1.5.0
2. Cloudflare API token with permissions:
   - D1: Edit
   - R2: Edit
   - Account Settings: Read
3. Netlify Personal Access Token

## Setup

### 1. Create the tfstate bucket manually

Before initializing Terraform, create the R2 bucket for state storage:

```bash
# Using Cloudflare Wrangler CLI
npx wrangler r2 bucket create vuefes-2026-tfstate
```

### 2. Set environment variables

```bash
# Cloudflare
export CLOUDFLARE_API_TOKEN="your-api-token"
export AWS_ACCESS_KEY_ID="your-r2-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"

# Netlify
export NETLIFY_API_TOKEN="your-netlify-token"
```

### 3. Create terraform.tfvars

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Initialize Terraform

```bash
terraform init \
  -backend-config="endpoints={s3=\"https://<ACCOUNT_ID>.r2.cloudflarestorage.com\"}"
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

The workflow in `.github/workflows/terraform.yml` runs:
- **On PR**: `terraform plan` with results posted as a comment
- **On merge to main**: `terraform apply -auto-approve`

### Required Secrets

| Name | Description |
|------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `AWS_ACCESS_KEY_ID` | R2 Access Key ID (for state backend) |
| `AWS_SECRET_ACCESS_KEY` | R2 Secret Access Key (for state backend) |
| `NETLIFY_API_TOKEN` | Netlify Personal Access Token |

### Required Variables

| Name | Description |
|------|-------------|
| `NETLIFY_TEAM_SLUG` | Netlify team slug |
| `NETLIFY_SITE_ID` | Netlify site ID (optional, for import) |

## File Structure

```
infra/
├── .gitignore                   # Exclude local state files
├── README.md                    # This file
├── versions.tf                  # Terraform/provider versions
├── providers.tf                 # Provider configuration
├── backend.tf                   # R2 backend configuration
├── variables.tf                 # Input variable definitions
├── outputs.tf                   # Output definitions
├── terraform.tfvars.example     # Variable examples
├── cloudflare.tf                # D1, R2 resources
├── netlify.tf                   # Site, environment variables
└── imports.tf                   # Existing resource imports
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
