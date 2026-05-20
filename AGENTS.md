# Repository Guidelines

## Project Structure & Module Organization

This is an Astro blog project. Source files live at the repository root, with MDX posts in `content/posts/*`, application code in `src/*`, public static assets in `public/*`, and generated output in `dist/*`.

Development container files are in `devenv/`. Migration notes and artifacts are kept in `migration-report.md` and `migration-report-artifacts/`.

## Build, Test, and Development Commands

Run Astro commands from the repository root with Corepack-managed pnpm:

```sh
corepack pnpm install                  # install dependencies
corepack pnpm run dev --host 0.0.0.0   # start Astro dev server
corepack pnpm run check                # run Astro/TypeScript checks
corepack pnpm run build                # build the site
corepack pnpm run build:ci             # run Cloudflare-style check and build
corepack pnpm run test:perf            # run Playwright performance tests
```

## Coding Style & Naming Conventions

Match the style of the file you edit. Use two-space indentation for JSON, JavaScript, TypeScript, Astro, and MDX frontmatter. The project is ESM with Astro and TypeScript.

Name post directories with the existing date-slug pattern, for example `2025-05-01-watch-me-talk-again`. Keep component names descriptive and PascalCase where the surrounding code does so.

## Testing Guidelines

There is no dedicated unit test suite configured. For code, content, or styling changes, run `corepack pnpm run check` and `corepack pnpm run build` from the repository root. For performance-sensitive changes, run `corepack pnpm run test:perf`.

For visual or content changes, preview the affected pages locally with `corepack pnpm run dev --host 0.0.0.0` so the developer can access the server from their machine, and include the URL or screenshots in review notes.

## Commit & Pull Request Guidelines

Recent local history includes short messages such as `more prep` and `updated agents`; prefer a clearer imperative form before review, such as `Update Astro migration guide` or `Fix blog pagination`. Pull requests should summarize the change, list validation commands, link related issues, and include screenshots for UI or rendered-content changes.

## Agent-Specific Instructions

Do not mix package managers. Use Corepack-managed pnpm from the repository root. `pnpm-workspace.yaml` is present for pnpm build-script approvals, not for monorepo workspace package layout. When starting the Astro dev server for the developer to test, always include the `--host` flag, preferably as `corepack pnpm run dev --host 0.0.0.0`.
