terraform {
  required_providers {
    minio = {
      source  = "aminueza/minio"
      version = "3.20.0"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "minio" {
  minio_server   = "hel1.your-objectstorage.com"
  minio_user     = var.s3_access_key
  minio_password = var.s3_secret_key
  minio_region   = "hel1"
  minio_ssl      = true
}
