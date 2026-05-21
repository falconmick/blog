export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: https://www.mcrook.com/sitemap/sitemap-index.xml\nHost: https://www.mcrook.com\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
