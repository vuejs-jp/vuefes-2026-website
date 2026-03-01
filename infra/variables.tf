# Cloudflare
variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

# Netlify
variable "netlify_team_slug" {
  description = "Netlify team slug"
  type        = string
  default     = "core-staff"
}

variable "netlify_site_id" {
  description = "Netlify site ID (for import)"
  type        = string
  default     = "f0c9dd8c-9333-4197-a783-09646a6f84a5"
}

# Application
variable "ga_id" {
  description = "Google Analytics Measurement ID"
  type        = string
  default     = "G-H7VEJHSZH4"
}

variable "contact_form_endpoint" {
  description = "Contact form endpoint URL"
  type        = string
  default     = "https://vuejs-jp.form.newt.so/v1/UR5LmScZc"
}

variable "site_url" {
  description = "Production site URL"
  type        = string
  default     = "https://vuefes.jp/"
}

variable "site_base_path" {
  description = "Site base path (e.g., /2026/)"
  type        = string
  default     = "/2026/"
}

# Sensitive — set via TF_VAR_* environment variables
variable "auth_secret" {
  description = "Auth.js secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "oauth_github_client_id" {
  description = "GitHub OAuth Client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "oauth_github_client_secret" {
  description = "GitHub OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "oauth_google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "oauth_google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "peatix_api_origin" {
  description = "Peatix API Origin URL"
  type        = string
  sensitive   = true
  default     = ""
}

variable "peatix_api_secret" {
  description = "Peatix API Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "peatix_event_id" {
  description = "Peatix Event ID"
  type        = string
  default     = ""
}

# D1 Database IDs (for import)
variable "d1_dev_database_id" {
  description = "Existing D1 dev database ID"
  type        = string
  default     = ""
}

variable "d1_prod_database_id" {
  description = "Existing D1 prod database ID"
  type        = string
  default     = ""
}
