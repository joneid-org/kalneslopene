# pgtunnel.sh

Opens an SSH tunnel to a Postgres instance running on a Dokploy server, so you can point a local client
at `localhost:<port>`.

```
./pgtunnel.sh [-i identity-file] <remote-host> <docker-network-id> [published-port] [target-port] [timeout-seconds]
```

Requires an SSH key already registered on the target server — see `infra/servers.tf`/`ssh.tf` for how
server access is provisioned. `dev` and `test` databases live on the same Dokploy server; `prod` is on a
separate server. Point `<remote-host>` at whichever one you need (an SSH config `Host` alias, or
`user@host`). The tunnel tears itself down when the SSH session closes or after the timeout.

## Usage

Simple, using defaults (published port `15432`, target port `5432`, 1 hour timeout):

```
./pgtunnel.sh user@0.0.0.10 db-network-internal
```

With all parameters:

```
./pgtunnel.sh -i ~/.ssh/id_ed25519_dockerhost user@0.0.0.10 db-network-internal 15432 5432 3600
```
