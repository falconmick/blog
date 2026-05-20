import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

import cloudflare from '@astrojs/cloudflare';

const isCloudflareBuild = process.env.CLOUDFLARE_BUILD === "1";

const mdxStubsPath = fileURLToPath(new URL('./src/components/mdx', import.meta.url));

export default defineConfig({
  integrations: [mdx()],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        jpeg: { quality: 100 },
        webp: { quality: 100 }
      }
    },
    layout: 'constrained',
    objectFit: 'contain',
    responsiveStyles: true
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: 'gatsby',
          replacement: fileURLToPath(new URL('./src/components/mdx/gatsby.ts', import.meta.url))
        },
        {
          find: 'gatsby-plugin-image',
          replacement: fileURLToPath(new URL('./src/components/mdx/gatsby-plugin-image.ts', import.meta.url))
        },
        {
          find: "@stubs",
          replacement: mdxStubsPath,
        },
      ],
    },
  },

  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: isCloudflareBuild ? 'workerd' : 'node'
  }),
});
