resource "hcloud_ssh_key" "team" {
  for_each = var.ssh_public_keys
  name       = "joneid-org-${each.key}"
  public_key = each.value
}
