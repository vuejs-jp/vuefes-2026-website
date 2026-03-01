# Production hosting resources
# - Netlify site, build settings, environment variables
# - Cloudflare D1 (prod) and R2 (prod)
# - Production deploys are triggered by tag push via GitHub Actions (netlify-cli deploy --prod)
# - Preview deploys are triggered by main branch push via CI workflow (netlify-cli deploy)

# -----------------------------------------------------------------------------
# Cloudflare Resources
# -----------------------------------------------------------------------------

resource "cloudflare_d1_database" "vuefes_2026_prod" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-prod"

  read_replication = {
    mode = "disabled"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_r2_bucket" "vuefes_2026_prod" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-prod"
  location   = "APAC"
}

# -----------------------------------------------------------------------------
# Netlify Site
# -----------------------------------------------------------------------------

# Site is created manually via Netlify dashboard; referenced here as data source.
data "netlify_site" "vuefes_2026" {
  name      = "vuefes-2026"
  team_slug = var.netlify_team_slug
}

# All builds are handled by GitHub Actions, not Netlify.
# Preview deploys: push to main triggers preview deploy via CI workflow.
# Production deploys: tag push triggers production deploy via release workflow.
resource "netlify_site_build_settings" "vuefes_2026" {
  site_id           = data.netlify_site.vuefes_2026.id
  build_command     = "pnpm rebuild && pnpm build"
  publish_directory = "dist/"
  production_branch = "main"
  stop_builds       = true
  pretty_urls       = true
}

# -----------------------------------------------------------------------------
# Netlify Environment Variables
# -----------------------------------------------------------------------------

# Public
resource "netlify_environment_variable" "ga_id" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "NUXT_PUBLIC_GA_ID"
  values  = [{ context = "all", value = var.ga_id }]
}

resource "netlify_environment_variable" "contact_form_endpoint" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "NUXT_PUBLIC_CONTACT_FORM_ENDPOINT"
  values  = [{ context = "all", value = var.contact_form_endpoint }]
}

resource "netlify_environment_variable" "site_url" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "NUXT_SITE_URL"
  values  = [{ context = "production", value = var.site_url }]
}

resource "netlify_environment_variable" "site_base_path" {
  site_id = data.netlify_site.vuefes_2026.id
  key     = "NUXT_BASE_PATH"
  values  = [{ context = "all", value = var.site_base_path }]
}

# Auth
resource "netlify_environment_variable" "auth_secret" {
  count         = var.auth_secret != "" ? 1 : 0
  site_id       = data.netlify_site.vuefes_2026.id
  key           = "AUTH_SECRET"
  secret_values = [{ context = "all", value = var.auth_secret }]
}

# OAuth — GitHub
resource "netlify_environment_variable" "oauth_github_client_id" {
  count   = var.oauth_github_client_id != "" ? 1 : 0
  site_id = data.netlify_site.vuefes_2026.id
  key     = "OAUTH_GITHUB_CLIENT_ID"
  values  = [{ context = "all", value = var.oauth_github_client_id }]
}

resource "netlify_environment_variable" "oauth_github_client_secret" {
  count         = var.oauth_github_client_secret != "" ? 1 : 0
  site_id       = data.netlify_site.vuefes_2026.id
  key           = "OAUTH_GITHUB_CLIENT_SECRET_ID"
  secret_values = [{ context = "all", value = var.oauth_github_client_secret }]
}

# OAuth — Google
resource "netlify_environment_variable" "oauth_google_client_id" {
  count   = var.oauth_google_client_id != "" ? 1 : 0
  site_id = data.netlify_site.vuefes_2026.id
  key     = "OAUTH_GOOGLE_CLIENT_ID"
  values  = [{ context = "all", value = var.oauth_google_client_id }]
}

resource "netlify_environment_variable" "oauth_google_client_secret" {
  count         = var.oauth_google_client_secret != "" ? 1 : 0
  site_id       = data.netlify_site.vuefes_2026.id
  key           = "OAUTH_GOOGLE_CLIENT_SECRET"
  secret_values = [{ context = "all", value = var.oauth_google_client_secret }]
}

# Peatix
resource "netlify_environment_variable" "peatix_api_origin" {
  count         = var.peatix_api_origin != "" ? 1 : 0
  site_id       = data.netlify_site.vuefes_2026.id
  key           = "PEATIX_API_ORIGIN"
  secret_values = [{ context = "all", value = var.peatix_api_origin }]
}

resource "netlify_environment_variable" "peatix_api_secret" {
  count         = var.peatix_api_secret != "" ? 1 : 0
  site_id       = data.netlify_site.vuefes_2026.id
  key           = "PEATIX_API_SECRET"
  secret_values = [{ context = "all", value = var.peatix_api_secret }]
}

resource "netlify_environment_variable" "peatix_event_id" {
  count   = var.peatix_event_id != "" ? 1 : 0
  site_id = data.netlify_site.vuefes_2026.id
  key     = "PEATIX_EVENT_ID"
  values  = [{ context = "all", value = var.peatix_event_id }]
}
