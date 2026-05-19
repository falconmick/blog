import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro:assets';

export type BlogPost = CollectionEntry<'posts'>;

export interface BlogPostView {
  post: BlogPost;
  slug: string;
  url: string;
  image?: ImageMetadata | string;
  embeddedImages: (ImageMetadata | string)[];
}

const POSTS_PER_PAGE = 5;

const imageModules = import.meta.glob('../../../blog/content/posts/**/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default'
}) as Record<string, ImageMetadata | string>;

export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function postDirectory(post: BlogPost) {
  const sourceDirectory = post.filePath?.match(/(?:^|\/)posts\/(.+)\/index\.mdx$/)?.[1];
  if (sourceDirectory) {
    return sourceDirectory;
  }

  return post.id.replace(/\/index$/, '');
}

export function postSlug(post: BlogPost) {
  return slugify(postDirectory(post).replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\./g, '-'));
}

export function postUrl(post: BlogPost) {
  const year = post.data.date.getFullYear();
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `/blog/${year}/${month}/${postSlug(post)}/`;
}

export function tagUrl(tag: string) {
  return `/blog/tags/${slugify(tag)}/`;
}

function resolvePostAsset(post: BlogPost, assetPath?: string) {
  if (!assetPath) {
    return undefined;
  }

  const cleanPath = assetPath.replace(/^\.\//, '');
  return imageModules[`../../../blog/content/posts/${postDirectory(post)}/${cleanPath}`];
}

export function toPostView(post: BlogPost): BlogPostView {
  return {
    post,
    slug: postSlug(post),
    url: postUrl(post),
    image: resolvePostAsset(post, post.data.image),
    embeddedImages: (post.data.embeddedImagesLocal ?? [])
      .map((imagePath) => resolvePostAsset(post, imagePath))
      .filter((image): image is ImageMetadata | string => Boolean(image))
  };
}

export async function getSortedPosts() {
  const posts = await getCollection('posts');
  return posts.map(toPostView).sort((a, b) => b.post.data.date.getTime() - a.post.data.date.getTime());
}

export function paginatePosts(posts: BlogPostView[]) {
  const pages: BlogPostView[][] = [];

  for (let i = 0; i < posts.length; i += POSTS_PER_PAGE) {
    pages.push(posts.slice(i, i + POSTS_PER_PAGE));
  }

  return pages;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function getAllTags(posts: BlogPostView[]) {
  return [...new Set(posts.flatMap(({ post }) => post.data.tags ?? []))].sort((a, b) =>
    slugify(a).localeCompare(slugify(b))
  );
}

export function tagTitle(tag: string) {
  return slugify(tag) === 'conference-talk' ? 'See me Speak' : tag;
}
