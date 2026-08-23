
variable "hcloud_token" {}
variable "s3_access_key" {}
variable "s3_secret_key" {}
variable "domain" {}
variable "bucket_name" {}

variable "location" {
  default = "hel1"
}

variable "os_type" {
  default = "ubuntu-26.04"
}

variable "ssh_public_keys" {
  description = "Map of team mebers name -> public ssh key"
  type        = map(string)
}

variable "environments" {
  description = "Map of environments -> url"
  type        = map(string)
}

variable "mail_mx_records" {
  description = "MX-verter -> prioritet for sonerota. Hent eksakte verdier fra one.com: Avanserte innstillinger -> DNS-innstillinger."
  type        = map(number)
  default     = {}
}

variable "mail_spf_record" {
  description = "SPF-record på sonerota. Tom streng slår den av."
  type        = string
  default     = "v=spf1 include:_custspf.one.com ~all"
}

variable "extra_root_txt_records" {
  description = "Flere TXT-records på sonerota (domeneverifisering, DMARC-lignende oppsett o.l.)"
  type        = list(string)
  default     = []
}

variable "mail_dkim_cnames" {
  description = "DKIM CNAME-navn -> mål. one.com support gir ut fire av disse når DNS ligger utenfor one.com."
  type        = map(string)
  default     = {}
}
