
variable "hcloud_token" {}
variable "s3_access_key" {}
variable "s3_secret_key" {}
variable "torsdagslopet_domain" {}
variable "bucket_name" {}

variable "location" {
  default = "hel1"
}

variable "os_type" {
  default = "ubuntu-24.04"
}

variable "ssh_public_keys" {
  description = "Map of team mebers name -> public ssh key"
  type = map(string)
}
