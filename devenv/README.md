# Rewrite Container

Build the headless Chrome Node image from the repo root:

```sh
docker build -f rewrite/Dockerfile -t node-headless-chrome:secure .
```

Run the container with persistent pnpm cache mounts:

```sh
./rewrite/run.sh
```

The run script keeps pnpm's store, cache, and state under:

```sh
/tmp/node-headless-chrome-shell-pnpm
```

Inside the container, pnpm's store resolves to:

```sh
/tmp/pnpm-home/store/v11
```

`./rewrite/run.sh` mounts `/tmp/pnpm-home` from `/tmp/node-headless-chrome-shell-pnpm/home`, so installs can reuse the store without writing it into the repo.

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
