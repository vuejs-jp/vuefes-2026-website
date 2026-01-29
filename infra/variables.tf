# =============================================================================
# Cloudflare Variables
# =============================================================================

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

# =============================================================================
# Netlify Variables
# =============================================================================

variable "netlify_team_slug" {
  description = "Netlify team slug"
  type        = string
}

variable "netlify_site_id" {
  description = "Netlify site ID (for import)"
  type        = string
  default     = ""
}

# =============================================================================
# Environment Configuration
# =============================================================================

variable "environment" {
  description = "Environment name (dev or prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be 'dev' or 'prod'."
  }
}

# =============================================================================
# Application Configuration
# =============================================================================

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

# =============================================================================
# Sensitive Variables (set via environment or tfvars)
# =============================================================================

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

# =============================================================================
# D1 Database IDs (for import)
# =============================================================================

variable "d1_dev_database_id" {
  description = "Existing D1 dev database ID"
  type        = string
  default     = "0c6b7881-3c26-472e-9276-2b71ed6af10b"
}

variable "d1_prod_database_id" {
  description = "Existing D1 prod database ID (if any)"
  type        = string
  default     = ""
}
