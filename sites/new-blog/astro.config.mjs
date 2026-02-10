import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

const blogPostsPath = fileURLToPath(new URL('../blog/content/posts', import.meta.url));
const mdxStubsPath = fileURLToPath(new URL('./src/components/mdx', import.meta.url));

export default defineConfig({
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: [
        {
          find: '@posts',
          replacement: blogPostsPath
        },
        {
          find: 'gatsby',
          replacement: fileURLToPath(new URL('./src/components/mdx/gatsby.ts', import.meta.url))
        },
        {
          find: 'gatsby-plugin-image',
          replacement: fileURLToPath(new URL('./src/components/mdx/gatsby-plugin-image.ts', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/src/buttonSeriesNavigation.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/ButtonSeriesNavigation.astro', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2022-03-09-how-to-make-a-button-intro/source/final/index.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-09-how-to-make-a-button-intro/final.astro', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2022-03-10-how-to-make-a-button-normalisation/source/stepOne/index.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-10-how-to-make-a-button-normalisation/stepOne.astro', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2022-03-11-how-to-make-a-button-styling/source/stepTwo/index.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-11-how-to-make-a-button-styling/stepTwo.astro', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2022-03-12-how-to-make-a-button-customisation/source/stepThree/index.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-12-how-to-make-a-button-customisation/stepThree.astro', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2021-06-28-hello-new-world/gallery.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2021-06-28-hello-new-world/gallery.ts', import.meta.url))
        },
        {
          find: fileURLToPath(new URL('../blog/content/posts/2021-06-28-hello-new-world/util.js', import.meta.url)),
          replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2021-06-28-hello-new-world/util.js', import.meta.url))
        },
        {
          find: '@stubs',
          replacement: mdxStubsPath
        }
      ]
    }
  }
});
