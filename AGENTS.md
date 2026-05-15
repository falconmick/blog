# Repository Guidelines

## Project Structure & Module Organization

This is a JavaScript blog workspace. The production Gatsby v4 site is in `sites/blog`, with MDX posts in `sites/blog/content/posts/*`, MDX pages in `sites/blog/content/pages/*`, and static assets in `sites/blog/assets/*`.

Shared Gatsby behavior lives in `packages/*`: `gatsby-theme-blog-core`, `gatsby-theme-page-core`, `gatsby-theme-core`, and `gatsby-theme-phoenix`. The Astro migration is isolated in `sites/new-blog` with source files under `sites/new-blog/src`, generated output in `sites/new-blog/dist`, and its own package manager setup. Development container files are in `devenv/`.

## Build, Test, and Development Commands

Run legacy Gatsby workspace commands from the repository root:

```sh
yarn start      # start Gatsby develop for sites/blog
yarn build      # clean and build the Gatsby site
yarn clean      # clear Gatsby caches
yarn lint       # run ESLint over JavaScript files
yarn lint:fix   # apply ESLint fixes where possible
```

Run Astro migration commands directly from `sites/new-blog`; do not use pnpm workspace commands:

```sh
corepack pnpm install
corepack pnpm run dev --host 0.0.0.0
corepack pnpm run check
corepack pnpm run build
```

## Coding Style & Naming Conventions

Match the style of the package you edit. Use two-space indentation for JSON, JavaScript, TypeScript, Astro, and MDX frontmatter. Gatsby theme packages are mostly CommonJS; `sites/new-blog` is ESM with Astro and TypeScript.

Name post directories with the existing date-slug pattern, for example `2025-05-01-watch-me-talk-again`. Keep component names descriptive and PascalCase where the surrounding code does so.

## Testing Guidelines

There is no dedicated unit test suite configured. For Gatsby changes, run `yarn lint` and `yarn build`. For Astro changes, run `corepack pnpm run check` and `corepack pnpm run build` from `sites/new-blog`. For visual or content changes, preview the affected pages locally with `corepack pnpm run dev --host 0.0.0.0` from `sites/new-blog` so the developer can access the server from their machine, and include the URL or screenshots in review notes.

## Commit & Pull Request Guidelines

Recent local history includes short messages such as `more prep` and `updated agents`; prefer a clearer imperative form before review, such as `Update Astro migration guide` or `Fix Gatsby pagination`. Pull requests should summarize the change, list validation commands, link related issues, and include screenshots for UI or rendered-content changes.

## Agent-Specific Instructions

Do not mix package managers. Use Yarn for the root workspace and legacy Gatsby site. Use Corepack-managed pnpm only inside `sites/new-blog`, and run commands from that directory because it is not using pnpm for monorepo workspace behavior. When starting the Astro dev server for the developer to test, always include the `--host` flag, preferably as `corepack pnpm run dev --host 0.0.0.0`.
