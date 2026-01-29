# Cloudflare Provider
# Authentication via environment variables:
#   CLOUDFLARE_API_TOKEN - API token with D1 and R2 permissions
provider "cloudflare" {
  # api_token is read from CLOUDFLARE_API_TOKEN env var
}

# Netlify Provider
# Authentication via environment variables:
#   NETLIFY_API_TOKEN - Personal access token
provider "netlify" {
  # token is read from NETLIFY_API_TOKEN env var
}
