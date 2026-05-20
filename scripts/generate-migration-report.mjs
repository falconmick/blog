import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const legacyBaseUrl = process.env.LEGACY_BLOG_BASE_URL ?? 'https://www.mcrook.com';
const astroBaseUrl = process.env.ASTRO_BLOG_BASE_URL ?? 'https://astro.mcrook.com';
const sitemapUrl = process.env.MIGRATION_SITEMAP_URL ?? `${legacyBaseUrl}/sitemap/sitemap-0.xml`;
const repoRoot = path.resolve(process.cwd(), '../..');
const reportPath = path.join(repoRoot, 'migration-report.md');
const artifactRoot = path.join(repoRoot, 'migration-report-artifacts');
const screenshotRoot = path.join(artifactRoot, 'screenshots');
const diffRoot = path.join(artifactRoot, 'diffs');
const viewport = { width: 1280, height: 900 };
const pixelThreshold = 32;

function samePathUrl(baseUrl, sourceUrl) {
  const source = new URL(sourceUrl);
  return new URL(`${source.pathname}${source.search}${source.hash}`, baseUrl).toString();
}

function slugForUrl(url) {
  const parsed = new URL(url);
  const slug = parsed.pathname.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  return slug || 'root';
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'n/a';
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatDelta(bytes) {
  if (!Number.isFinite(bytes)) return 'n/a';
  const prefix = bytes > 0 ? '+' : '';
  return `${prefix}${formatBytes(bytes)}`;
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function escapeMarkdown(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchSitemapUrls() {
  const xml = await fetchText(sitemapUrl);
  await writeFile(path.join(artifactRoot, 'sitemap-0.xml'), xml);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    throw new Error(`No URLs found in ${sitemapUrl}`);
  }
  return urls;
}

function normalizeHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '<style></style>')
    .replace(/\b(src|href|srcset)="[^"]+"/gi, '$1=""')
    .replace(/\b(?:nonce|integrity|crossorigin|data-astro-cid-[a-z0-9_-]+)="[^"]*"/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenSimilarity(leftHtml, rightHtml) {
  const left = normalizeHtml(leftHtml).match(/<\/?[a-z0-9-]+(?:\s+[a-z0-9:-]+(?:="")?)*\s*\/?>/g) ?? [];
  const right = normalizeHtml(rightHtml).match(/<\/?[a-z0-9-]+(?:\s+[a-z0-9:-]+(?:="")?)*\s*\/?>/g) ?? [];
  const leftCounts = new Map();
  const rightCounts = new Map();

  for (const token of left) leftCounts.set(token, (leftCounts.get(token) ?? 0) + 1);
  for (const token of right) rightCounts.set(token, (rightCounts.get(token) ?? 0) + 1);

  let shared = 0;
  for (const [token, count] of leftCounts) {
    shared += Math.min(count, rightCounts.get(token) ?? 0);
  }

  return {
    similarity: left.length + right.length === 0 ? 1 : (2 * shared) / (left.length + right.length),
    legacyTokens: left.length,
    astroTokens: right.length
  };
}

async function capturePage(browser, url, screenshotPath) {
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    serviceWorkers: 'block',
    viewport,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  const requestTypes = new Map();
  let pageBytes = 0;
  let imageBytes = 0;
  let status = 0;

  await client.send('Network.enable');
  client.on('Network.responseReceived', (event) => {
    requestTypes.set(event.requestId, {
      type: event.type,
      mimeType: event.response.mimeType
    });
  });
  client.on('Network.loadingFinished', (event) => {
    const bytes = event.encodedDataLength ?? 0;
    const request = requestTypes.get(event.requestId);
    pageBytes += bytes;
    if (request?.type === 'Image' || request?.mimeType?.startsWith('image/')) {
      imageBytes += bytes;
    }
  });

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    status = response?.status() ?? 0;
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
      `
    }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
  } finally {
    await context.close();
  }

  return { status, pageBytes, imageBytes };
}

async function imageDiff(legacyPath, astroPath, diffPath) {
  const [legacyMeta, astroMeta] = await Promise.all([
    sharp(legacyPath).metadata(),
    sharp(astroPath).metadata()
  ]);
  const width = Math.max(legacyMeta.width ?? 0, astroMeta.width ?? 0);
  const height = Math.max(legacyMeta.height ?? 0, astroMeta.height ?? 0);
  const channels = 4;

  const [legacyRaw, astroRaw] = await Promise.all([
    sharp(legacyPath)
      .resize({ width, height, fit: 'contain', background: '#ffffff' })
      .ensureAlpha()
      .raw()
      .toBuffer(),
    sharp(astroPath)
      .resize({ width, height, fit: 'contain', background: '#ffffff' })
      .ensureAlpha()
      .raw()
      .toBuffer()
  ]);

  const diffRaw = Buffer.alloc(width * height * channels, 255);
  let changed = 0;

  for (let i = 0; i < legacyRaw.length; i += channels) {
    const delta =
      Math.abs(legacyRaw[i] - astroRaw[i]) +
      Math.abs(legacyRaw[i + 1] - astroRaw[i + 1]) +
      Math.abs(legacyRaw[i + 2] - astroRaw[i + 2]) +
      Math.abs(legacyRaw[i + 3] - astroRaw[i + 3]);

    if (delta > pixelThreshold) {
      changed += 1;
      diffRaw[i] = 255;
      diffRaw[i + 1] = 0;
      diffRaw[i + 2] = 0;
      diffRaw[i + 3] = 255;
    }
  }

  await sharp(diffRaw, { raw: { width, height, channels } }).png().toFile(diffPath);

  return {
    width,
    height,
    changedPixels: changed,
    totalPixels: width * height,
    diffRatio: width * height === 0 ? 0 : changed / (width * height)
  };
}

async function comparePage(browser, sourceUrl, index, total) {
  const legacyUrl = samePathUrl(legacyBaseUrl, sourceUrl);
  const astroUrl = samePathUrl(astroBaseUrl, sourceUrl);
  const slug = slugForUrl(sourceUrl);
  const legacyScreenshot = path.join(screenshotRoot, `${slug}-legacy.png`);
  const astroScreenshot = path.join(screenshotRoot, `${slug}-astro.png`);
  const diffScreenshot = path.join(diffRoot, `${slug}-diff.png`);

  console.log(`[${index}/${total}] ${new URL(sourceUrl).pathname}`);

  const [legacyHtml, astroHtml, legacyMetrics, astroMetrics] = await Promise.all([
    fetchText(legacyUrl).catch((error) => `FETCH_ERROR: ${error.message}`),
    fetchText(astroUrl).catch((error) => `FETCH_ERROR: ${error.message}`),
    capturePage(browser, legacyUrl, legacyScreenshot),
    capturePage(browser, astroUrl, astroScreenshot)
  ]);
  const markup = tokenSimilarity(legacyHtml, astroHtml);
  const visual = await imageDiff(legacyScreenshot, astroScreenshot, diffScreenshot);

  return {
    path: new URL(sourceUrl).pathname,
    legacyUrl,
    astroUrl,
    legacyStatus: legacyMetrics.status,
    astroStatus: astroMetrics.status,
    markupSimilarity: markup.similarity,
    legacyMarkupTokens: markup.legacyTokens,
    astroMarkupTokens: markup.astroTokens,
    visualDiffRatio: visual.diffRatio,
    changedPixels: visual.changedPixels,
    totalPixels: visual.totalPixels,
    legacyPageBytes: legacyMetrics.pageBytes,
    astroPageBytes: astroMetrics.pageBytes,
    legacyImageBytes: legacyMetrics.imageBytes,
    astroImageBytes: astroMetrics.imageBytes,
    legacyScreenshot: path.relative(repoRoot, legacyScreenshot),
    astroScreenshot: path.relative(repoRoot, astroScreenshot),
    diffScreenshot: path.relative(repoRoot, diffScreenshot)
  };
}

function reportMarkdown(rows) {
  const generatedAt = new Date().toISOString();
  const statusMismatches = rows.filter((row) => row.legacyStatus !== row.astroStatus);
  const highestVisualDiff = [...rows].sort((a, b) => b.visualDiffRatio - a.visualDiffRatio).slice(0, 5);
  const lowestMarkup = [...rows].sort((a, b) => a.markupSimilarity - b.markupSimilarity).slice(0, 5);

  const lines = [
    '# Blog Migration Report',
    '',
    `Generated: ${generatedAt}`,
    '',
    `Compared ${rows.length} sitemap URLs from ${sitemapUrl}. Legacy base: ${legacyBaseUrl}. Astro base: ${astroBaseUrl}.`,
    '',
    `URL mapping is host-only: each legacy \`${legacyBaseUrl}{path}\` sitemap URL was compared with \`${astroBaseUrl}{path}\`. The live legacy sitemap does not include Astro-only migration content that exists outside this comparison set.`,
    '',
    'Visual screenshots were captured full-page at 1280x900 viewport with animations disabled. Visual diff percentage is the share of pixels whose RGBA delta exceeded the threshold after both screenshots were padded to the same dimensions. Page and image byte counts come from Chrome DevTools Protocol encoded network byte counts during page load.',
    '',
    '## Summary',
    '',
    `- Status mismatches: ${statusMismatches.length}`,
    `- Average markup similarity: ${percent(rows.reduce((sum, row) => sum + row.markupSimilarity, 0) / rows.length)}`,
    `- Average visual diff: ${percent(rows.reduce((sum, row) => sum + row.visualDiffRatio, 0) / rows.length)}`,
    `- Total legacy page bytes: ${formatBytes(rows.reduce((sum, row) => sum + row.legacyPageBytes, 0))}`,
    `- Total Astro page bytes: ${formatBytes(rows.reduce((sum, row) => sum + row.astroPageBytes, 0))}`,
    `- Total legacy image bytes: ${formatBytes(rows.reduce((sum, row) => sum + row.legacyImageBytes, 0))}`,
    `- Total Astro image bytes: ${formatBytes(rows.reduce((sum, row) => sum + row.astroImageBytes, 0))}`,
    '',
    '## Largest Visual Diffs',
    '',
    '| Path | Visual diff | Markup similarity |',
    '| --- | ---: | ---: |',
    ...highestVisualDiff.map((row) => `| ${escapeMarkdown(row.path)} | ${percent(row.visualDiffRatio)} | ${percent(row.markupSimilarity)} |`),
    '',
    '## Lowest Markup Similarity',
    '',
    '| Path | Markup similarity | Visual diff |',
    '| --- | ---: | ---: |',
    ...lowestMarkup.map((row) => `| ${escapeMarkdown(row.path)} | ${percent(row.markupSimilarity)} | ${percent(row.visualDiffRatio)} |`),
    '',
    '## Page-by-page Results',
    '',
    '| Path | Status old/new | Markup similarity | Visual diff | Page bytes old | Page bytes Astro | Page delta | Image bytes old | Image bytes Astro | Image delta | Screenshots | Diff |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |',
    ...rows.map((row) => {
      const pageDelta = row.astroPageBytes - row.legacyPageBytes;
      const imageDelta = row.astroImageBytes - row.legacyImageBytes;
      return [
        escapeMarkdown(row.path),
        `${row.legacyStatus}/${row.astroStatus}`,
        `${percent(row.markupSimilarity)} (${row.legacyMarkupTokens}/${row.astroMarkupTokens} tokens)`,
        `${percent(row.visualDiffRatio)} (${row.changedPixels}/${row.totalPixels})`,
        formatBytes(row.legacyPageBytes),
        formatBytes(row.astroPageBytes),
        formatDelta(pageDelta),
        formatBytes(row.legacyImageBytes),
        formatBytes(row.astroImageBytes),
        formatDelta(imageDelta),
        `[old](${row.legacyScreenshot}) / [astro](${row.astroScreenshot})`,
        `[diff](${row.diffScreenshot})`
      ].join(' | ');
    }).map((line) => `| ${line} |`),
    '',
    '## Notes',
    '',
    '- Markup similarity is structural, not exact byte equality. It ignores script/style bodies, asset URL hashes, and whitespace so generated asset names do not dominate the score.',
    '- Visual diff images mark changed pixels in red on white. Large diffs can be caused by real layout changes, missing images, different ad/script behavior, or content differences.',
    '- Byte counts are captured from browser network loading for each page, so cache state, third-party availability, and responsive image selection can affect exact numbers.'
  ];

  return `${lines.join('\n')}\n`;
}

async function main() {
  await rm(artifactRoot, { recursive: true, force: true });
  await mkdir(screenshotRoot, { recursive: true });
  await mkdir(diffRoot, { recursive: true });

  const sourceUrls = await fetchSitemapUrls();
  const browser = await chromium.launch();
  const rows = [];

  try {
    for (let index = 0; index < sourceUrls.length; index += 1) {
      rows.push(await comparePage(browser, sourceUrls[index], index + 1, sourceUrls.length));
    }
  } finally {
    await browser.close();
  }

  await writeFile(path.join(artifactRoot, 'results.json'), `${JSON.stringify(rows, null, 2)}\n`);
  await writeFile(reportPath, reportMarkdown(rows));

  const writtenReport = await readFile(reportPath, 'utf8');
  if (!writtenReport.includes('## Page-by-page Results') || rows.length === 0) {
    throw new Error('Report verification failed');
  }

  console.log(`Wrote ${reportPath}`);
  console.log(`Wrote ${artifactRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
