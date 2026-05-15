# Dev Container

Build the headless Chrome Node image from the repo root:

```sh
docker build -f devenv/Dockerfile -t node-headless-chrome:secure .
```

Run the container with persistent tool caches:

```sh
./devenv/run.sh
```

The run script keeps pnpm, npm, Corepack, XDG, and Codex runtime state under:

```sh
/tmp/node-headless-chrome-shell-pnpm
```

These host-backed mounts keep the container read-only while still giving common tools writable state directories:

```sh
/code/sites/new-blog/node_modules
/tmp/corepack
/tmp/npm-cache
/tmp/pnpm-home
/tmp/xdg-config
/tmp/xdg-cache
/tmp/xdg-state
/home/node/.codex
```

The `sites/new-blog/node_modules` mount is backed by:

```sh
/tmp/node-headless-chrome-shell-pnpm/new-blog-node-modules
```

This hides any macOS-installed packages from the Ubuntu container while keeping pnpm's `.pnpm` store writable by the non-root `node` user.

Inside the container, run the Astro migration app commands directly from `sites/new-blog`; do not use pnpm workspace commands from the repo root:

```sh
cd sites/new-blog
corepack pnpm install
corepack pnpm run check
corepack pnpm run build
corepack pnpm run dev --host 0.0.0.0
```

Astro's default dev server port is exposed on the host:

```sh
http://127.0.0.1:4321/
```

Port `3000` is also exposed for other app workflows.

Astro telemetry is disabled by the container environment with `ASTRO_TELEMETRY_DISABLED=1`, so package scripts can stay as plain Astro commands.

`sites/new-blog/pnpm-workspace.yaml` is present only for pnpm 11 build-script approvals:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

It is not used to declare pnpm workspace packages.

The image also installs Codex CLI. The run script mounts your host Codex login token from:

```sh
~/.codex/auth.json
```

into the container at:

```sh
/home/node/.codex/auth.json
```

The token mount is read-only; other Codex runtime files are written under `/tmp/node-headless-chrome-shell-pnpm/codex`.

The run script also mounts your host Codex config from:

```sh
~/.codex/config.toml
```

into the container at:

```sh
/home/node/.codex/config.toml
```

This passes through settings such as:

```toml
[features]
goals = true
```
