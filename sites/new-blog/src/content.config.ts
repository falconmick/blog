import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.mdx',
    base: '../blog/content/posts'
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    socialImage: z.string().optional(),
    caption: z.string().optional(),
    tags: z.array(z.string()).optional(),
    videoSrcURL: z.string().optional(),
    videoTitle: z.string().optional(),
    embeddedImagesLocal: z.array(z.string()).optional()
  })
});

export const collections = { posts };
