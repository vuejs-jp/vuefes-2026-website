# Cloudflare R2 as S3-compatible backend
# Initialize with:
#   terraform init \
#     -backend-config="endpoints={s3=\"https://<ACCOUNT_ID>.r2.cloudflarestorage.com\"}" \
#     -backend-config="access_key=<R2_ACCESS_KEY_ID>" \
#     -backend-config="secret_key=<R2_SECRET_ACCESS_KEY>"

terraform {
  backend "s3" {
    bucket = "vuefes-2026-tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1" # Required but ignored by R2

    # R2-specific settings
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}
