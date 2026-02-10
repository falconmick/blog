import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: {
        '@posts': fileURLToPath(new URL('../blog/content/posts', import.meta.url)),
        '@stubs': fileURLToPath(new URL('./src/components/mdx', import.meta.url))
      }
    }
  }
});
