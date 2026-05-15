import { getSortedPosts } from '../../../lib/posts';

const SITE_URL = 'https://www.mcrook.com';
const SITE_DESCRIPTION = "Michael's personal site and blog";

function cdata(value = '') {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export async function GET() {
  const posts = await getSortedPosts();
  const lastBuildDate = new Date().toUTCString();
  const items = posts
    .map(({ post, url }) => {
      const absoluteUrl = `${SITE_URL}${url}`;
      return `<item><title>${cdata(post.data.title)}</title><description>${cdata(
        post.data.excerpt
      )}</description><link>${absoluteUrl}</link><guid isPermaLink="false">${absoluteUrl}</guid><pubDate>${post.data.date.toUTCString()}</pubDate></item>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title>${cdata(
    'RSS Feed'
  )}</title><description>${cdata(
    SITE_DESCRIPTION
  )}</description><link>${SITE_URL}</link><generator>GatsbyJS</generator><lastBuildDate>${lastBuildDate}</lastBuildDate>${items}</channel></rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(new TextEncoder().encode(body).length),
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
