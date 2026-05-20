import { expect, test, type Browser, type Page } from '@playwright/test';

const legacyBaseUrl = process.env.LEGACY_BLOG_BASE_URL ?? 'https://www.mcrook.com';
const astroBaseUrl = process.env.ASTRO_BLOG_BASE_URL ?? 'https://astro.mcrook.com';
const sitemapUrl = process.env.PERF_SITEMAP_URL ?? 'https://www.mcrook.com/sitemap/sitemap-0.xml';
const allowedRatio = Number(process.env.PERF_ALLOWED_RATIO ?? '1.2');
const defaultPaths = ['/blog/', '/blog/2022/03/how-to-make-a-button-customisation/'];

interface PageMetrics {
  url: string;
  bytes: number;
  lcp: number;
}

async function fetchSitemapUrls() {
  const response = await fetch(sitemapUrl);
  expect(response.ok, `Unable to fetch ${sitemapUrl}`).toBe(true);

  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  expect(urls.length, `No URLs found in ${sitemapUrl}`).toBeGreaterThan(0);

  return urls;
}

async function comparisonUrls() {
  if (process.env.PERF_USE_SITEMAP === '1') {
    return fetchSitemapUrls();
  }

  const paths = process.env.PERF_PATHS?.split(',')
    .map((path) => path.trim())
    .filter(Boolean) ?? defaultPaths;

  return paths.map((path) => new URL(path, legacyBaseUrl).toString());
}

function samePathUrl(baseUrl: string, sourceUrl: string) {
  const source = new URL(sourceUrl);
  return new URL(`${source.pathname}${source.search}${source.hash}`, baseUrl).toString();
}

async function installLcpObserver(page: Page) {
  await page.addInitScript(() => {
    window.__lcpEntries = [];

    const observer = new PerformanceObserver((list) => {
      window.__lcpEntries.push(...(list.getEntries() as LargestContentfulPaintEntry[]));
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

async function measurePage(browser: Browser, url: string): Promise<PageMetrics> {
  const page = await browser.newPage();
  const client = await page.context().newCDPSession(page);
  let encodedBytes = 0;

  await client.send('Network.enable');
  client.on('Network.loadingFinished', (event) => {
    encodedBytes += event.encodedDataLength;
  });

  await installLcpObserver(page);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3_000);

  const lcp = await page.evaluate(() => {
    const entries = window.__lcpEntries;
    const last = entries.at(-1);
    return last ? last.renderTime || last.loadTime || last.startTime : 0;
  });

  await page.close();

  return {
    url,
    bytes: encodedBytes,
    lcp
  };
}

function formatBytes(bytes: number) {
  return `${Math.round(bytes / 1024)} KiB`;
}

declare global {
  interface LargestContentfulPaintEntry extends PerformanceEntry {
    renderTime: number;
    loadTime: number;
  }

  interface Window {
    __lcpEntries: LargestContentfulPaintEntry[];
  }
}

test('Astro deployed pages stay within 20% of legacy download size and LCP', async ({ browser }) => {
  const sourceUrls = await comparisonUrls();
  const failures: string[] = [];

  for (const sourceUrl of sourceUrls) {
    await test.step(sourceUrl, async () => {
      const legacyUrl = samePathUrl(legacyBaseUrl, sourceUrl);
      const astroUrl = samePathUrl(astroBaseUrl, sourceUrl);

      const legacy = await measurePage(browser, legacyUrl);
      const astro = await measurePage(browser, astroUrl);

      if (astro.bytes > legacy.bytes * allowedRatio) {
        failures.push(
          `${astroUrl} downloaded ${formatBytes(astro.bytes)} vs legacy ${formatBytes(legacy.bytes)}`
        );
      }

      if (legacy.lcp <= 0) {
        failures.push(`${legacyUrl} did not report LCP`);
      }

      if (astro.lcp <= 0) {
        failures.push(`${astroUrl} did not report LCP`);
      }

      if (astro.lcp > legacy.lcp * allowedRatio) {
        failures.push(`${astroUrl} LCP ${Math.round(astro.lcp)}ms vs legacy ${Math.round(legacy.lcp)}ms`);
      }
    });
  }

  expect(failures).toEqual([]);
});
