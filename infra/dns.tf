resource "hcloud_zone" "torsdagslopet" {
  name = var.domain
  mode = "primary"
  ttl  = 300 # 86400
}

resource "hcloud_zone_rrset" "root_a" {
  zone    = hcloud_zone.torsdagslopet.name
  name    = "@"
  type    = "A"
  records = [{ value = hcloud_server.dokploy.ipv4_address }]
}

resource "hcloud_zone_rrset" "wildcard_a" {
  zone    = hcloud_zone.torsdagslopet.name
  name    = "*"
  type    = "A"
  records = [{ value = hcloud_server.dokploy.ipv4_address }]
}

# E-posten ligger fortsatt hos one.com, så MX/SPF/DKIM må settes eksplisitt her etter at NS ble flyttet til Hetzner.
resource "hcloud_zone_rrset" "root_mx" {
  count = length(var.mail_mx_records) > 0 ? 1 : 0

  zone = hcloud_zone.torsdagslopet.name
  name = "@"
  type = "MX"
  records = [
    for host, priority in var.mail_mx_records : { value = "${priority} ${trimsuffix(host, ".")}." }
  ]
}

resource "hcloud_zone_rrset" "root_txt" {
  count = length(local.root_txt_records) > 0 ? 1 : 0

  zone = hcloud_zone.torsdagslopet.name
  name = "@"
  type = "TXT"
  records = [
    for value in local.root_txt_records : { value = provider::hcloud::txt_record(value) }
  ]
}

resource "hcloud_zone_rrset" "dkim_cname" {
  for_each = var.mail_dkim_cnames

  zone    = hcloud_zone.torsdagslopet.name
  name    = each.key
  type    = "CNAME"
  records = [{ value = "${trimsuffix(each.value, ".")}." }]
}

locals {
  root_txt_records = compact(concat([var.mail_spf_record], var.extra_root_txt_records))
}
