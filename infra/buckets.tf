# resource "minio_s3_bucket" "torsdagslopet_minio_bucket" {
#   bucket         = var.bucket_name
#   acl            = "private"
#   object_locking = false
# }

# resource "minio_s3_bucket_cors" "torsdagslopet_bucket_cors" {
#   bucket = minio_s3_bucket.torsdagslopet_minio_bucket.id

#   cors_rule {
#     allowed_origins = ["https://print.demo.dokploy.ejoneid.dev", "https://print.demo.ejoneid.dev"]
#     allowed_methods = ["GET", "PUT", "HEAD"]
#     allowed_headers = ["content-type", "x-amz-*"]
#     expose_headers  = ["ETag"]
#     max_age_seconds = 3000
#   }
# }
