# =============================================================================
# D1 Databases
# =============================================================================

resource "cloudflare_d1_database" "vuefes_2026_dev" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-dev"

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_d1_database" "vuefes_2026_prod" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-prod"

  lifecycle {
    prevent_destroy = true
  }
}

# =============================================================================
# R2 Buckets
# =============================================================================

resource "cloudflare_r2_bucket" "vuefes_2026_dev" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-dev"
  location   = "APAC"
}

resource "cloudflare_r2_bucket" "vuefes_2026_prod" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-prod"
  location   = "APAC"
}

resource "cloudflare_r2_bucket" "vuefes_2026_tfstate" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-tfstate"
  location   = "APAC"

  lifecycle {
    prevent_destroy = true
  }
}
