# Repository Guidelines

## Project Structure & Module Organization

This repository is a JavaScript blog workspace. The current Gatsby site lives in `sites/blog`, with MDX content in `sites/blog/content/posts/*` and pages in `sites/blog/content/pages/*`. Shared Gatsby behavior is implemented in local workspace packages under `packages/*`, especially `gatsby-theme-blog-core`, `gatsby-theme-page-core`, and `gatsby-theme-phoenix`.

The Astro migration lives in `sites/new-blog`. Treat it as a standalone pnpm project: run pnpm commands from that directory, not from the repository root. Development container files are in `devenv/`.

## Build, Test, and Development Commands

Root Gatsby workspace commands use Yarn:

```sh
yarn start      # run the legacy Gatsby dev server
yarn build      # clean and build the legacy Gatsby site
yarn clean      # clear Gatsby build caches
yarn lint       # run ESLint over JS files
```

Astro migration commands must be run directly from `sites/new-blog`:

```sh
corepack pnpm install
corepack pnpm run dev --host 0.0.0.0
corepack pnpm run check
corepack pnpm run build
```

Use `./devenv/run.sh` to start the containerized environment after building it with `docker build -f devenv/Dockerfile -t node-headless-chrome:secure .`.

## Coding Style & Naming Conventions

Follow the existing style in the package you edit. Gatsby code is CommonJS-oriented in the theme packages; `sites/new-blog` is ESM and Astro/TypeScript. Use two-space indentation for JSON, JS, TS, Astro, and MDX frontmatter. Name blog post directories with the existing date-slug pattern, for example `2025-05-01-watch-me-talk-again`.

## Testing Guidelines

There is no dedicated unit test suite configured. For Gatsby changes, run `yarn lint` and `yarn build`. For Astro changes, run `corepack pnpm run check` and `corepack pnpm run build` from `sites/new-blog`. Validate content changes by previewing the affected page locally.

## Commit & Pull Request Guidelines

Use concise, imperative commit messages such as `Update Astro image dependencies` or `Fix Gatsby post pagination`. Pull requests should describe the change, list commands run, link relevant issues, and include screenshots for visual or content-rendering changes.

## Agent-Specific Instructions

Do not mix package managers. Keep root and legacy Gatsby work on Yarn; keep `sites/new-blog` on Corepack-managed pnpm. Do not use pnpm workspace commands for `sites/new-blog`; its `pnpm-workspace.yaml` only stores pnpm build-script approvals.
