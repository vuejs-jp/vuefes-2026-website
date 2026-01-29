# =============================================================================
# Import Blocks for Existing Resources
# =============================================================================
# These import blocks allow Terraform to manage existing resources.
# Run `terraform plan` to see what changes would be made.
#
# Note: Import blocks require Terraform >= 1.5.0
# =============================================================================

# -----------------------------------------------------------------------------
# D1 Database (dev) - Already exists
# Format: <account_id>/<database_id>
# -----------------------------------------------------------------------------
import {
  to = cloudflare_d1_database.vuefes_2026_dev
  id = "${var.cloudflare_account_id}/${var.d1_dev_database_id}"
}

# -----------------------------------------------------------------------------
# D1 Database (prod) - Import if exists
# Uncomment when prod database exists
# -----------------------------------------------------------------------------
# import {
#   to = cloudflare_d1_database.vuefes_2026_prod
#   id = "${var.cloudflare_account_id}/${var.d1_prod_database_id}"
# }

# -----------------------------------------------------------------------------
# Netlify Site - Import existing site
# Uncomment and set site_id when importing
# -----------------------------------------------------------------------------
# import {
#   to = netlify_site.vuefes_2026
#   id = var.netlify_site_id
# }

# -----------------------------------------------------------------------------
# Manual Import Commands
# Use these if import blocks don't work for your Terraform version
# -----------------------------------------------------------------------------
#
# D1 Database (dev):
#   terraform import cloudflare_d1_database.vuefes_2026_dev \
#     "<ACCOUNT_ID>/0c6b7881-3c26-472e-9276-2b71ed6af10b"
#
# D1 Database (prod):
#   terraform import cloudflare_d1_database.vuefes_2026_prod \
#     "<ACCOUNT_ID>/<DATABASE_ID>"
#
# R2 Bucket:
#   terraform import cloudflare_r2_bucket.vuefes_2026_dev \
#     "<ACCOUNT_ID>/vuefes-2026-dev"
#
# Netlify Site:
#   terraform import netlify_site.vuefes_2026 "<SITE_ID>"
#
