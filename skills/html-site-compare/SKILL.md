---
name: html-site-compare
description: Compare rendered HTML between two websites, especially legacy and migrated versions of the same site, using a manual URL-pair list and a normalized full-DOM diff report that can guide follow-up implementation work.
---

# HTML Site Compare

Use this skill when the user wants to verify that content rendered by a legacy site matches a new site, or when migration work needs concrete HTML diffs before deciding what to fix next.

## Workflow

1. Confirm both sites are reachable. For this repository the usual defaults are:
   - Legacy Gatsby: `http://localhost:8000`
   - New Astro: `http://localhost:4321`
2. Create or update a tab-separated URL-pair file. Use `assets/url-pairs.example.tsv` as the format.
3. Run the bundled script from the repo root:

   ```bash
   node skills/html-site-compare/scripts/compare-html.mjs --pairs path/to/url-pairs.tsv --out /tmp/html-compare.md
   ```

4. Read the Markdown report and use it as evidence for the next migration fixes. Treat mismatches as implementation leads, not automatic proof that the new site is wrong.

## URL Pair Format

Each non-empty, non-comment line has two or three tab-separated fields:

```text
legacy_url	new_url	label
http://localhost:8000/blog/example/	http://localhost:4321/blog/example/	example post
```

The label is optional. A header row beginning with `legacy_url` is ignored.

## Comparison Policy

The script compares normalized full DOM:

- Removes comments, scripts, styles, noscript content, common dev-overlay nodes, and stylesheet/preload links that produce noisy framework differences.
- Removes volatile attributes such as Astro/Gatsby hydration markers, React internals, nonces, integrity hashes, and source-map hints.
- Preserves meaningful structure and attributes including tag order, text, headings, lists, tables, links, images, code blocks, `id`, `class`, `role`, ARIA attributes, `href`, `src`, and `alt`.
- Normalizes whitespace and local absolute URLs so different localhost ports do not create false positives for same-path assets or links.

## Output

The report includes:

- Overall pass/fail counts.
- Fetch or HTTP failures.
- A per-page unified diff for mismatched normalized DOM.
- Lightweight hints for obvious missing links, images, headings, code blocks, and text-size deltas.

If the report is too large, inspect the first failing page and fix the highest-level template or component issue before re-running the full comparison.
