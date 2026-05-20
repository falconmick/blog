import { getAllTags, getSortedPosts, paginatePosts, slugify } from '../../lib/posts';

export async function GET() {
  const posts = await getSortedPosts();
  const pages = paginatePosts(posts);
  const urls = [
    '/blog',
    ...pages.slice(1).map((_, index) => `/blog/page/${index + 2}`),
    ...posts.map((entry) => entry.url),
    ...getAllTags(posts).map((tag) => `/blog/tags/${slugify(tag)}/`)
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      (url) =>
        `<url><loc>https://www.mcrook.com${url}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
    )
    .join('')}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
