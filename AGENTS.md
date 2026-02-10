# Agent Working Notes (Repo Scope)

## Legacy Solution Snapshot
- The current live blog is a **Gatsby v4** site under `sites/blog`.
- Content is file-based MDX in `sites/blog/content/posts/*` (and pages in `sites/blog/content/pages/*`).
- Rendering and page generation behavior is mostly provided by local workspace theme packages in `packages/*`:
  - `gatsby-theme-blog-core`
  - `gatsby-theme-page-core`
  - `gatsby-theme-phoenix`
- The workspace root uses Yarn workspaces to combine `sites/*` and `packages/*`.

## Astro Migration Notes
- (To be expanded while implementing `sites/new-blog`.)

## Troubleshooting Notes
- (Add issue/fix notes here if dev server or rendering problems are encountered.)

## Astro Setup Findings (from docs)
- Astro can be initialized via `create-astro`, but if template fetching is blocked, a minimal project can be created manually with:
  - `astro` dependency + scripts in `package.json`
  - `astro.config.mjs`
  - `src/pages/*` entrypoints
- MDX support in Astro is enabled by adding `@astrojs/mdx` and registering `mdx()` in `astro.config.mjs` integrations.
- TypeScript path aliases can be set in `tsconfig.json` (`compilerOptions.paths`) and mirrored in Vite aliases for runtime resolution.
- MDX files in Astro support top-level `import`/`export`; non-export variable declarations at the top level cause compile failures.

## Troubleshooting Notes
- `yarn create astro ...` failed in this environment with `ENETUNREACH` reaching the GitHub template endpoint.
  - Fix: manually scaffolded the Astro app files in `sites/new-blog`.
- Initial Astro build failed because MDX files contained top-level `const` declarations.
  - Fix: removed those declarations and simplified usages directly in MDX.
- Astro build then failed with `Named export 'clsx' not found` due to workspace hoisting an older CommonJS `clsx`.
  - Fix: added `clsx@^2` as a direct dependency in `sites/new-blog`.
