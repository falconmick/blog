#!/usr/bin/env sh
set -eu

PNPM_CACHE_ROOT="/tmp/node-headless-chrome-shell-pnpm"
NEW_BLOG_NODE_MODULES="$PNPM_CACHE_ROOT/new-blog-node-modules"
CODEX_AUTH_FILE="${HOME}/.codex/auth.json"
CODEX_CONFIG_FILE="${HOME}/.codex/config.toml"

if [ ! -r "$CODEX_AUTH_FILE" ]; then
  echo "Codex auth file not found or unreadable: $CODEX_AUTH_FILE" >&2
  exit 1
fi

if [ ! -r "$CODEX_CONFIG_FILE" ]; then
  echo "Codex config file not found or unreadable: $CODEX_CONFIG_FILE" >&2
  exit 1
fi

mkdir -p \
  "$PNPM_CACHE_ROOT/codex" \
  "$PNPM_CACHE_ROOT/corepack" \
  "$NEW_BLOG_NODE_MODULES" \
  "$PNPM_CACHE_ROOT/npm-cache" \
  "$PNPM_CACHE_ROOT/pnpm-home" \
  "$PNPM_CACHE_ROOT/xdg-config" \
  "$PNPM_CACHE_ROOT/xdg-cache" \
  "$PNPM_CACHE_ROOT/xdg-state"

docker run --rm -it \
  --name node-headless-chrome-shell \
  --init \
  --user 1000:1000 \
  --workdir /code \
  --mount type=bind,src="$(pwd)",target=/code,bind-propagation=rprivate \
  --mount type=bind,src="$NEW_BLOG_NODE_MODULES",target=/code/sites/new-blog/node_modules \
  --mount type=bind,src="$PNPM_CACHE_ROOT/corepack",target=/tmp/corepack \
  --mount type=bind,src="$PNPM_CACHE_ROOT/npm-cache",target=/tmp/npm-cache \
  --mount type=bind,src="$PNPM_CACHE_ROOT/pnpm-home",target=/tmp/pnpm-home \
  --mount type=bind,src="$PNPM_CACHE_ROOT/xdg-config",target=/tmp/xdg-config \
  --mount type=bind,src="$PNPM_CACHE_ROOT/xdg-cache",target=/tmp/xdg-cache \
  --mount type=bind,src="$PNPM_CACHE_ROOT/xdg-state",target=/tmp/xdg-state \
  --mount type=bind,src="$PNPM_CACHE_ROOT/codex",target=/home/node/.codex \
  --mount type=bind,src="$CODEX_AUTH_FILE",target=/home/node/.codex/auth.json,readonly \
  --mount type=bind,src="$CODEX_CONFIG_FILE",target=/home/node/.codex/config.toml,readonly \
  --env ASTRO_TELEMETRY_DISABLED=1 \
  --env COREPACK_HOME=/tmp/corepack \
  --env NPM_CONFIG_CACHE=/tmp/npm-cache \
  --env PNPM_HOME=/tmp/pnpm-home \
  --env XDG_CONFIG_HOME=/tmp/xdg-config \
  --env XDG_CACHE_HOME=/tmp/xdg-cache \
  --env XDG_STATE_HOME=/tmp/xdg-state \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=1g \
  --tmpfs /dev/shm:rw,nosuid,nodev,size=1g \
  --cap-drop=ALL \
  --security-opt no-new-privileges:true \
  --pids-limit=512 \
  --memory=2g \
  --cpus=2 \
  --network=bridge \
  -p 127.0.0.1:3000:3000 \
  -p 127.0.0.1:4321:4321 \
  node-headless-chrome:secure
