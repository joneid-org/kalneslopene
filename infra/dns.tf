resource "hcloud_zone" "torsdagslopet" {
  name = var.domain
  mode = "primary"
  ttl  = 300
}

resource "hcloud_zone_rrset" "root_a" {
  zone = hcloud_zone.torsdagslopet.name
  name = "@"
  type = "A"
  records = [{ value = hcloud_server.dokploy.ipv4_address }]
}

resource "hcloud_zone_rrset" "wildcard_a" {
  zone = hcloud_zone.torsdagslopet.name
  name = "*"
  type = "A"
  records = [{ value = hcloud_server.dokploy.ipv4_address }]
}