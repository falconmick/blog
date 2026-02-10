import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

const blogPostsPath = fileURLToPath(new URL('../blog/content/posts', import.meta.url));
const mdxStubsPath = fileURLToPath(new URL('./src/components/mdx', import.meta.url));

const legacyMdxStubEntries = [
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-09-how-to-make-a-button-intro/index.mdx', import.meta.url)),
    source: './source/final',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-09-how-to-make-a-button-intro/final.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-10-how-to-make-a-button-normalisation/index.mdx', import.meta.url)),
    source: './source/stepOne',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-10-how-to-make-a-button-normalisation/stepOne.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-11-how-to-make-a-button-styling/index.mdx', import.meta.url)),
    source: './source/stepTwo',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-11-how-to-make-a-button-styling/stepTwo.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-12-how-to-make-a-button-customisation/index.mdx', import.meta.url)),
    source: './source/stepThree',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2022-03-12-how-to-make-a-button-customisation/stepThree.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2021-06-28-hello-new-world/index.mdx', import.meta.url)),
    source: './gallery',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2021-06-28-hello-new-world/gallery.ts', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2021-06-28-hello-new-world/index.mdx', import.meta.url)),
    source: './util.js',
    replacement: fileURLToPath(new URL('./src/components/mdx/stubs/post/2021-06-28-hello-new-world/util.js', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-09-how-to-make-a-button-intro/index.mdx', import.meta.url)),
    source: '../../../src/buttonSeriesNavigation',
    replacement: fileURLToPath(new URL('./src/components/mdx/ButtonSeriesNavigation.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-10-how-to-make-a-button-normalisation/index.mdx', import.meta.url)),
    source: '../../../src/buttonSeriesNavigation',
    replacement: fileURLToPath(new URL('./src/components/mdx/ButtonSeriesNavigation.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-11-how-to-make-a-button-styling/index.mdx', import.meta.url)),
    source: '../../../src/buttonSeriesNavigation',
    replacement: fileURLToPath(new URL('./src/components/mdx/ButtonSeriesNavigation.astro', import.meta.url))
  },
  {
    importer: fileURLToPath(new URL('../blog/content/posts/2022-03-12-how-to-make-a-button-customisation/index.mdx', import.meta.url)),
    source: '../../../src/buttonSeriesNavigation',
    replacement: fileURLToPath(new URL('./src/components/mdx/ButtonSeriesNavigation.astro', import.meta.url))
  }
];

const legacyMdxStubPlugin = {
  name: 'legacy-mdx-stubs',
  enforce: 'pre',
  resolveId(source, importer) {
    const match = legacyMdxStubEntries.find((entry) => entry.source === source && entry.importer === importer);
    if (match) {
      return match.replacement;
    }

    return null;
  }
};

export default defineConfig({
  integrations: [mdx()],
  vite: {
    plugins: [legacyMdxStubPlugin],
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
          find: '@stubs',
          replacement: mdxStubsPath
        }
      ]
    }
  }
});
