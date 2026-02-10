# Astro Migration Plan (High Level)

1. **Assess the legacy blog setup**
   - Identify where post content lives and how the Gatsby theme packages power rendering.
   - Capture a short legacy architecture note for future contributors.

2. **Bootstrap a new Astro app in `sites/new-blog`**
   - Create an Astro project without `npx`.
   - Keep only the minimum files needed for a basic static site.

3. **Implement minimal HTML structure matching `www.mcrook.com`**
   - Recreate only structural HTML with Astro templating.
   - Avoid React, utility frameworks, classes, and custom styling.

4. **Wire up legacy posts using Astro content + MDX**
   - Configure Astro’s MDX integration.
   - Add TypeScript path alias `@posts/*` that resolves to `sites/blog/content/posts/*`.
   - Build post listing + post pages with basic semantic HTML.

5. **Handle MDX component compatibility**
   - Stub JS/JSX components currently used by legacy MDX posts with Astro component stand-ins.
   - Keep behavior minimal and focus on preventing render failures.

6. **Validate and document**
   - Run install/build checks and sanity-run the site.
   - Record Astro setup notes and any troubleshooting outcomes in `AGENTS.md` for the repo scope.
   - Add uncertain or deferred items to `FEEDBACK.md`.
