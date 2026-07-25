#!/usr/bin/env bash
#
# pgtunnel-up.sh
#
# Creates a Docker Swarm "pgtunnel" service on a remote host via SSH,
# and ensures it's torn down when:
#   1. The SSH session closes (cleanly, Ctrl+C, or dropped connection), OR
#   2. A timeout is reached (backstop, in case disconnect detection is slow)
#
# Usage:
#   ./pgtunnel-up.sh [-i identity-file] <remote-host> <docker-network-id> [published-port] [target-port] [timeout-seconds]
#
# Example:
#   ./pgtunnel-up.sh -i ~/.ssh/id_ed25519_dockerhost dockerhost my-network 15432 5432 3600
#
# Requires SSH keepalives for fast dead-connection detection. Add to ~/.ssh/config:
#   Host dockerhost
#       ServerAliveInterval 15
#       ServerAliveCountMax 3

set -euo pipefail

SSH_KEY=""
while getopts ":i:" opt; do
  case "${opt}" in
    i) SSH_KEY="${OPTARG}" ;;
    \?) echo "Unknown option: -${OPTARG}" >&2; exit 1 ;;
    :) echo "Option -${OPTARG} requires an argument" >&2; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

REMOTE_HOST="${1:?Usage: $0 [-i identity-file] <remote-host> <docker-network-id> [published-port] [target-port] [timeout-seconds]}"
DOCKER_NETWORK="${2:?Missing docker-network-id}"
PUBLISHED_PORT="${3:-15432}"
TARGET_PORT="${4:-5432}"
TIMEOUT_SECONDS="${5:-3600}"

SSH_OPTS=()
if [[ -n "${SSH_KEY}" ]]; then
  SSH_OPTS+=(-i "${SSH_KEY}")
fi

echo "Starting pgtunnel on ${REMOTE_HOST} (published=${PUBLISHED_PORT} -> db:${TARGET_PORT}, timeout=${TIMEOUT_SECONDS}s)"
if [[ -n "${SSH_KEY}" ]]; then
  echo "Using SSH key: ${SSH_KEY}"
fi
echo "Forwarding localhost:${PUBLISHED_PORT} -> ${REMOTE_HOST}:${PUBLISHED_PORT}"
echo "Close this SSH session (or Ctrl+C) to tear the tunnel down immediately."
echo

ssh -t -L "${PUBLISHED_PORT}:localhost:${PUBLISHED_PORT}" "${SSH_OPTS[@]}" "${REMOTE_HOST}" bash -s -- "${DOCKER_NETWORK}" "${PUBLISHED_PORT}" "${TARGET_PORT}" "${TIMEOUT_SECONDS}" <<'REMOTE_SCRIPT'
set -euo pipefail

DOCKER_NETWORK="$1"
PUBLISHED_PORT="$2"
TARGET_PORT="$3"
TIMEOUT_SECONDS="$4"

# Immediate cleanup when this remote shell exits for any reason
# (SSH session closed, Ctrl+C, killed, etc.)
cleanup() {
  docker service rm pgtunnel >/dev/null 2>&1 || true
}
trap cleanup EXIT HUP TERM INT

# If a pgtunnel service is already running (e.g. left over from a
# previous session that didn't clean up), stop it first.
if docker service inspect pgtunnel >/dev/null 2>&1; then
  echo "Existing pgtunnel service found, removing it first..."
  docker service rm pgtunnel >/dev/null 2>&1 || true
  # Give Swarm a moment to fully release the published port before rebinding
  sleep 2
fi

docker service create --name pgtunnel \
  --network "${DOCKER_NETWORK}" \
  --publish mode=host,published="${PUBLISHED_PORT}",target="${TARGET_PORT}" \
  alpine/socat "tcp-listen:${TARGET_PORT},fork,reuseaddr" "tcp-connect:db:${TARGET_PORT}"

# Backstop: if the SSH connection dies silently and this shell never gets
# a signal, this detached job still removes the service after the timeout.
nohup bash -c "sleep ${TIMEOUT_SECONDS} && docker service rm pgtunnel" >/dev/null 2>&1 &
disown

echo "Tunnel is up. Auto-expires in ${TIMEOUT_SECONDS}s if not closed sooner."
sleep infinity
REMOTE_SCRIPT
