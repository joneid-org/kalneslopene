resource "minio_s3_bucket" "torsdagslopet_minio_bucket" {
  for_each = var.environments
  bucket         = "${var.bucket_name}-${each.key}"
  acl            = "public-read"
  object_locking = false
}

resource "minio_s3_bucket_cors" "torsdagslopet_bucket_cors" {
  for_each = var.environments

  bucket = minio_s3_bucket.torsdagslopet_minio_bucket[each.key].id

  cors_rule {
    allowed_origins = [each.value]
    allowed_methods = ["GET", "PUT", "HEAD"]
    allowed_headers = ["content-type", "x-amz-*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
