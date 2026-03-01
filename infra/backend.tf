# Cloudflare R2 as S3-compatible backend
# Initialize with:
#   terraform init -backend-config=backend.conf
#
# backend.conf (not committed):
#   endpoints = {
#     s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
#   }
#
# Credentials via environment variables:
#   AWS_ACCESS_KEY_ID=<R2_TFSTATE_ACCESS_KEY_ID>
#   AWS_SECRET_ACCESS_KEY=<R2_TFSTATE_SECRET_ACCESS_KEY>

terraform {
  backend "s3" {
    bucket                      = "vuefes-2026-tfstate"
    key                         = "terraform.tfstate"
    region                      = "auto"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

resource "cloudflare_r2_bucket" "vuefes_2026_tfstate" {
  account_id = var.cloudflare_account_id
  name       = "vuefes-2026-tfstate"
  location   = "APAC"

  lifecycle {
    prevent_destroy = true
  }
}
