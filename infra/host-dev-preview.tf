# Dev / Preview environment resources

resource "cloudflare_d1_database" "vuefes_2026_dev" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-dev"

  read_replication = {
    mode = "disabled"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_r2_bucket" "vuefes_2026_dev" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-dev"
  location   = "APAC"
}

# Netlify D1 binding (multi-context)
resource "netlify_environment_variable" "d1_database_id" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "CLOUDFLARE_DATABASE_ID"
  values = [
    { context = "production", value = cloudflare_d1_database.vuefes_2026_prod.id },
    { context = "deploy-preview", value = cloudflare_d1_database.vuefes_2026_dev.id },
    { context = "branch-deploy", value = cloudflare_d1_database.vuefes_2026_dev.id },
    { context = "dev", value = cloudflare_d1_database.vuefes_2026_dev.id },
  ]
}

# Netlify R2 binding (multi-context)
resource "netlify_environment_variable" "r2_bucket_name" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "CLOUDFLARE_R2_BUCKET_NAME"
  values = [
    { context = "production", value = cloudflare_r2_bucket.vuefes_2026_prod.name },
    { context = "deploy-preview", value = cloudflare_r2_bucket.vuefes_2026_dev.name },
    { context = "branch-deploy", value = cloudflare_r2_bucket.vuefes_2026_dev.name },
    { context = "dev", value = cloudflare_r2_bucket.vuefes_2026_dev.name },
  ]
}
