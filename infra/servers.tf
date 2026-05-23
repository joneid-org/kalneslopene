resource "hcloud_server" "dokploy" {
  name               = "torsdagslopet-dokploy-server"
  image              = var.os_type
  server_type        = "cx23"
  location           = var.location
  delete_protection  = false
  rebuild_protection = false
  ssh_keys           = [for k in hcloud_ssh_key.team : k.id]
  user_data = templatefile("user_data.yml.tftpl", {
    ssh_public_key = file(pathexpand("~/.ssh/ejoneid_devops.pub"))
  })
}
