# =============================================================================
# Cloudflare Outputs
# =============================================================================

output "d1_database_dev_id" {
  description = "D1 Database ID (dev)"
  value       = cloudflare_d1_database.vuefes_2026_dev.id
}

output "d1_database_prod_id" {
  description = "D1 Database ID (prod)"
  value       = cloudflare_d1_database.vuefes_2026_prod.id
}

output "r2_bucket_dev_name" {
  description = "R2 Bucket name (dev)"
  value       = cloudflare_r2_bucket.vuefes_2026_dev.name
}

output "r2_bucket_prod_name" {
  description = "R2 Bucket name (prod)"
  value       = cloudflare_r2_bucket.vuefes_2026_prod.name
}

output "r2_bucket_tfstate_name" {
  description = "R2 Bucket name (tfstate)"
  value       = cloudflare_r2_bucket.vuefes_2026_tfstate.name
}

# =============================================================================
# Netlify Outputs
# =============================================================================

output "netlify_site_id" {
  description = "Netlify Site ID"
  value       = netlify_site.vuefes_2026.id
}

output "netlify_site_url" {
  description = "Netlify Site URL"
  value       = netlify_site.vuefes_2026.url
}

output "netlify_site_name" {
  description = "Netlify Site Name"
  value       = netlify_site.vuefes_2026.name
}
