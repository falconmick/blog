#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { createPatch } from 'diff';

const VOLATILE_ATTR_PREFIXES = [
  'data-astro',
  'data-gatsby',
  'data-react',
  'data-rh',
  'data-helmet',
  'data-source'
];

const VOLATILE_ATTRS = new Set([
  'nonce',
  'integrity',
  'crossorigin',
  'fetchpriority',
  'decoding',
  'loading',
  'sizes',
  'srcset'
]);

const NOISY_SELECTORS = [
  'script',
  'style',
  'noscript',
  'link[rel="stylesheet"]',
  'link[rel="modulepreload"]',
  'link[rel="preload"]',
  'link[rel="prefetch"]',
  'gatsby-announcer',
  '#gatsby-focus-wrapper > style',
  '#webpack-dev-server-client-overlay',
  'vite-error-overlay',
  'astro-dev-toolbar'
];

function parseArgs(argv) {
  const args = {
    pairs: null,
    out: null,
    timeout: 20000,
    context: 6
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--pairs') args.pairs = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--timeout') args.timeout = Number(argv[++i]);
    else if (arg === '--context') args.context = Number(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.pairs) throw new Error('Missing required --pairs path');
  return args;
}

function printHelp() {
  console.log(`Usage:
  node skills/html-site-compare/scripts/compare-html.mjs --pairs url-pairs.tsv [--out report.md]

Options:
  --pairs     Tab-separated file with legacy_url, new_url, optional label
  --out       Markdown report path. Defaults to stdout
  --timeout   Fetch timeout in milliseconds. Defaults to 20000
  --context   Diff context lines. Defaults to 6`);
}

async function readPairs(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), index: index + 1 }))
    .filter(({ line }) => line && !line.startsWith('#'))
    .filter(({ line }) => !line.toLowerCase().startsWith('legacy_url\t'))
    .map(({ line, index }) => {
      const [legacyUrl, newUrl, label] = line.split('\t').map((value) => value?.trim());
      if (!legacyUrl || !newUrl) {
        throw new Error(`Invalid URL pair at ${filePath}:${index}`);
      }
      return {
        legacyUrl,
        newUrl,
        label: label || legacyUrl
      };
    });
}

async function fetchHtml(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml'
      }
    });
    const html = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      html
    };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeHtml(html, pageUrl) {
  const $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true
  });

  removeComments($.root()[0]);
  $(NOISY_SELECTORS.join(',')).remove();
  $('*').each((_, element) => normalizeAttributes($, element, pageUrl));

  const lines = [];
  $.root()
    .contents()
    .each((_, node) => serializeNode($, node, lines, 0, pageUrl));

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function removeComments(node) {
  if (!node?.children) return;

  node.children = node.children.filter((child) => child.type !== 'comment');
  for (const child of node.children) removeComments(child);
}

function normalizeAttributes($, element, pageUrl) {
  if (!element.attribs) return;

  const next = {};
  for (const [rawName, rawValue] of Object.entries(element.attribs)) {
    const name = rawName.toLowerCase();
    if (VOLATILE_ATTRS.has(name)) continue;
    if (VOLATILE_ATTR_PREFIXES.some((prefix) => name === prefix || name.startsWith(`${prefix}-`))) {
      continue;
    }
    if (name.startsWith('on')) continue;

    let value = collapseWhitespace(String(rawValue ?? ''));
    if (name === 'href' || name === 'src') value = normalizeUrl(value, pageUrl);
    if (name === 'class') value = value.split(/\s+/).filter(Boolean).sort().join(' ');

    next[name] = value;
  }

  element.attribs = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
}

function serializeNode($, node, lines, depth, pageUrl) {
  if (node.type === 'text') {
    const text = collapseWhitespace(node.data);
    if (text) lines.push(`${indent(depth)}"${text}"`);
    return;
  }

  if (node.type !== 'tag' && node.type !== 'root') return;

  if (node.type === 'root') {
    $(node)
      .contents()
      .each((_, child) => serializeNode($, child, lines, depth, pageUrl));
    return;
  }

  const tag = node.name.toLowerCase();
  const attrs = formatAttributes(node.attribs || {});
  lines.push(`${indent(depth)}<${tag}${attrs}>`);

  $(node)
    .contents()
    .each((_, child) => serializeNode($, child, lines, depth + 1, pageUrl));

  lines.push(`${indent(depth)}</${tag}>`);
}

function formatAttributes(attrs) {
  const entries = Object.entries(attrs);
  if (!entries.length) return '';
  return entries.map(([name, value]) => ` ${name}=${JSON.stringify(value)}`).join('');
}

function collapseWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeUrl(value, pageUrl) {
  if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) {
    return value;
  }

  try {
    const url = new URL(value, pageUrl);
    const base = new URL(pageUrl);
    if (url.origin === base.origin || ['localhost', '127.0.0.1'].includes(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.toString();
  } catch {
    return value;
  }
}

function indent(depth) {
  return '  '.repeat(depth);
}

function buildHints(legacyNormalized, newNormalized) {
  const hints = [];
  const legacyStats = collectStats(legacyNormalized);
  const newStats = collectStats(newNormalized);

  for (const key of ['img', 'a', 'h1', 'h2', 'h3', 'pre', 'code', 'table']) {
    if (legacyStats.tags[key] !== newStats.tags[key]) {
      hints.push(`- \`${key}\` count changed: legacy ${legacyStats.tags[key] || 0}, new ${newStats.tags[key] || 0}`);
    }
  }

  const textDelta = newStats.textChars - legacyStats.textChars;
  const threshold = Math.max(80, Math.round(legacyStats.textChars * 0.05));
  if (Math.abs(textDelta) > threshold) {
    hints.push(`- Text size changed by ${textDelta} normalized characters.`);
  }

  return hints;
}

function collectStats(normalized) {
  const tags = {};
  let textChars = 0;

  for (const line of normalized.split('\n')) {
    const tag = line.match(/^\s*<([a-z0-9-]+)/)?.[1];
    if (tag) tags[tag] = (tags[tag] || 0) + 1;
    const text = line.match(/^\s*"(.+)"$/)?.[1];
    if (text) textChars += text.length;
  }

  return { tags, textChars };
}

function makeDiff(label, legacyNormalized, newNormalized, context) {
  return createPatch(
    label,
    legacyNormalized,
    newNormalized,
    'legacy normalized DOM',
    'new normalized DOM',
    { context }
  )
    .split('\n')
    .slice(4)
    .join('\n')
    .trimEnd();
}

async function comparePair(pair, options) {
  const [legacyResult, nextResult] = await Promise.allSettled([
    fetchHtml(pair.legacyUrl, options.timeout),
    fetchHtml(pair.newUrl, options.timeout)
  ]);

  const errors = [];
  if (legacyResult.status === 'rejected') errors.push(`Legacy fetch failed: ${legacyResult.reason.message}`);
  if (nextResult.status === 'rejected') errors.push(`New fetch failed: ${nextResult.reason.message}`);
  if (errors.length) return { pair, status: 'error', errors };

  const legacy = legacyResult.value;
  const next = nextResult.value;
  if (!legacy.ok) errors.push(`Legacy returned HTTP ${legacy.status} ${legacy.statusText}`);
  if (!next.ok) errors.push(`New returned HTTP ${next.status} ${next.statusText}`);
  if (errors.length) return { pair, status: 'error', errors };

  const legacyNormalized = normalizeHtml(legacy.html, pair.legacyUrl);
  const newNormalized = normalizeHtml(next.html, pair.newUrl);

  if (legacyNormalized === newNormalized) {
    return { pair, status: 'pass' };
  }

  return {
    pair,
    status: 'fail',
    hints: buildHints(legacyNormalized, newNormalized),
    diff: makeDiff(pair.label, legacyNormalized, newNormalized, options.context)
  };
}

function renderReport(results) {
  const passed = results.filter((result) => result.status === 'pass').length;
  const failed = results.filter((result) => result.status === 'fail').length;
  const errored = results.filter((result) => result.status === 'error').length;
  const lines = [
    '# HTML Compare Report',
    '',
    `Compared ${results.length} URL pair(s): ${passed} passed, ${failed} failed, ${errored} errored.`,
    ''
  ];

  for (const result of results) {
    lines.push(`## ${result.status.toUpperCase()}: ${result.pair.label}`);
    lines.push('');
    lines.push(`- Legacy: ${result.pair.legacyUrl}`);
    lines.push(`- New: ${result.pair.newUrl}`);
    lines.push('');

    if (result.status === 'pass') {
      lines.push('Normalized DOM matches.');
      lines.push('');
      continue;
    }

    if (result.status === 'error') {
      lines.push(...result.errors.map((error) => `- ${error}`));
      lines.push('');
      continue;
    }

    if (result.hints.length) {
      lines.push('Likely migration leads:');
      lines.push(...result.hints);
      lines.push('');
    }

    lines.push('```diff');
    lines.push(result.diff);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const pairs = await readPairs(options.pairs);
  if (!pairs.length) throw new Error(`No URL pairs found in ${options.pairs}`);

  const results = [];
  for (const pair of pairs) {
    results.push(await comparePair(pair, options));
  }

  const report = renderReport(results);
  if (options.out) {
    const outPath = path.resolve(options.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, report);
  } else {
    process.stdout.write(report);
  }

  const hasFailures = results.some((result) => result.status !== 'pass');
  process.exit(hasFailures ? 1 : 0);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(2);
});
