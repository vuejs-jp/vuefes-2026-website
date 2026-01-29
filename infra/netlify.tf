# =============================================================================
# Netlify Site
# =============================================================================

resource "netlify_site" "vuefes_2026" {
  name      = "vuefes-2026"
  team_slug = var.netlify_team_slug

  # Repository configuration
  repo {
    provider    = "github"
    repo_path   = "vuejs-jp/vuefes-2026"
    repo_branch = "main"

    # Build settings
    cmd           = "pnpm run build"
    dir           = ".output/public"
    functions_dir = ".netlify/functions"
  }

  # Build image
  build_settings {
    build_image = "default"
  }
}

# =============================================================================
# Environment Variables
# =============================================================================

# Public environment variables
resource "netlify_environment_variable" "ga_id" {
  site_id = netlify_site.vuefes_2026.id
  key     = "NUXT_PUBLIC_GA_ID"

  values {
    context = "all"
    value   = var.ga_id
  }
}

resource "netlify_environment_variable" "contact_form_endpoint" {
  site_id = netlify_site.vuefes_2026.id
  key     = "NUXT_PUBLIC_CONTACT_FORM_ENDPOINT"

  values {
    context = "all"
    value   = var.contact_form_endpoint
  }
}

resource "netlify_environment_variable" "site_url" {
  site_id = netlify_site.vuefes_2026.id
  key     = "NUXT_SITE_URL"

  values {
    context = "production"
    value   = var.site_url
  }
}

resource "netlify_environment_variable" "site_base_path" {
  site_id = netlify_site.vuefes_2026.id
  key     = "NUXT_BASE_PATH"

  values {
    context = "all"
    value   = var.site_base_path
  }
}

# Sensitive environment variables
resource "netlify_environment_variable" "auth_secret" {
  count   = var.auth_secret != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "AUTH_SECRET"

  values {
    context = "all"
    value   = var.auth_secret
  }
}

resource "netlify_environment_variable" "oauth_github_client_id" {
  count   = var.oauth_github_client_id != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "OAUTH_GITHUB_CLIENT_ID"

  values {
    context = "all"
    value   = var.oauth_github_client_id
  }
}

resource "netlify_environment_variable" "oauth_github_client_secret" {
  count   = var.oauth_github_client_secret != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "OAUTH_GITHUB_CLIENT_SECRET_ID"

  values {
    context = "all"
    value   = var.oauth_github_client_secret
  }
}

resource "netlify_environment_variable" "oauth_google_client_id" {
  count   = var.oauth_google_client_id != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "OAUTH_GOOGLE_CLIENT_ID"

  values {
    context = "all"
    value   = var.oauth_google_client_id
  }
}

resource "netlify_environment_variable" "oauth_google_client_secret" {
  count   = var.oauth_google_client_secret != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "OAUTH_GOOGLE_CLIENT_SECRET"

  values {
    context = "all"
    value   = var.oauth_google_client_secret
  }
}

resource "netlify_environment_variable" "peatix_api_origin" {
  count   = var.peatix_api_origin != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "PEATIX_API_ORIGIN"

  values {
    context = "all"
    value   = var.peatix_api_origin
  }
}

resource "netlify_environment_variable" "peatix_api_secret" {
  count   = var.peatix_api_secret != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "PEATIX_API_SECRET"

  values {
    context = "all"
    value   = var.peatix_api_secret
  }
}

resource "netlify_environment_variable" "peatix_event_id" {
  count   = var.peatix_event_id != "" ? 1 : 0
  site_id = netlify_site.vuefes_2026.id
  key     = "PEATIX_EVENT_ID"

  values {
    context = "all"
    value   = var.peatix_event_id
  }
}

# D1 Database bindings
resource "netlify_environment_variable" "d1_database_id" {
  site_id = netlify_site.vuefes_2026.id
  key     = "D1_DATABASE_ID"

  values {
    context = "production"
    value   = cloudflare_d1_database.vuefes_2026_prod.id
  }

  values {
    context = "deploy-preview"
    value   = cloudflare_d1_database.vuefes_2026_dev.id
  }

  values {
    context = "branch-deploy"
    value   = cloudflare_d1_database.vuefes_2026_dev.id
  }

  values {
    context = "dev"
    value   = cloudflare_d1_database.vuefes_2026_dev.id
  }
}

# R2 Bucket bindings
resource "netlify_environment_variable" "r2_bucket_name" {
  site_id = netlify_site.vuefes_2026.id
  key     = "R2_BUCKET_NAME"

  values {
    context = "production"
    value   = cloudflare_r2_bucket.vuefes_2026_prod.name
  }

  values {
    context = "deploy-preview"
    value   = cloudflare_r2_bucket.vuefes_2026_dev.name
  }

  values {
    context = "branch-deploy"
    value   = cloudflare_r2_bucket.vuefes_2026_dev.name
  }

  values {
    context = "dev"
    value   = cloudflare_r2_bucket.vuefes_2026_dev.name
  }
}
