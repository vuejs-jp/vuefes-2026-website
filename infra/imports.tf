# Import blocks for existing resources (Terraform >= 1.7.0)

import {
  to = cloudflare_d1_database.vuefes_2026_dev
  id = "${var.cloudflare_account_id}/${var.d1_dev_database_id}"
}

import {
  to = cloudflare_d1_database.vuefes_2026_prod
  id = "${var.cloudflare_account_id}/${var.d1_prod_database_id}"
}

import {
  to = cloudflare_r2_bucket.vuefes_2026_tfstate
  id = "${var.cloudflare_account_id}/vuefes-2026-tfstate/default"
}

import {
  to = cloudflare_r2_bucket.vuefes_2026_dev
  id = "${var.cloudflare_account_id}/vuefes-2026-dev/default"
}

import {
  to = cloudflare_r2_bucket.vuefes_2026_prod
  id = "${var.cloudflare_account_id}/vuefes-2026-prod/default"
}
