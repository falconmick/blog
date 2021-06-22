<div align="center">
<h1>@arshad/gatsby-theme-blog-core</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-blog-core"><img src="https://img.shields.io/npm/v/@arshad/gatsby-theme-blog-core.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-blog-core"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-blog-core.svg" alt="License"></a>
  <a href="https://github.com/arshad/gatsby-themes"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
</p>

<p align="center">
This core theme includes a <code>Post</code> type that you can use to build a Gatsby blog. It has support for <strong>post excerpt, featured image, tags</strong> and <strong>paginated pages</strong>. It includes <strong>no styles</strong>.
</p>

## Installation

### Step 1: In the root of your Gatsby site, run the following command:

```shell
yarn add @michael/gatsby-theme-blog-core
```

### Step 2: Enable it in `gatsby-config.js`

```js
// gatsby-config.js
...
  plugins: [
    `@arshad/gatsby-theme-blog-core`
  ]
...
```

## Theme options

| Key            | Default value   | Description                                               |
| -------------- | --------------- | --------------------------------------------------------- |
| `contentPath`  | `content/posts` | Location of your blog posts                               |
| `basePath`     | `/blog`         | Root url for all blog posts                               |
| `postsPerPage` | `5`             | Number of posts to show per page for pagination           |
| `pageTitle`    | `Blog`          | The title for the blog page. Leave blank for no title     |
| `pageExcerpt`  | `null`          | The excerpt for the blog page. Leave blank for no excerpt |

### Example usage

```js
// gatsby-config.js
...
  plugins: [
    {
      resolve: `@arshad/gatsby-theme-blog-core`,
      options: {
        basePath: `/posts`,
        postsPerPage: 10,
      }
    }
  ]
...
```

## Data models

### Post

```js
type Post implements Node @dontInfer {
  id: ID!
  title: String!
  date: Date! @dateformat
  excerpt(pruneLength: Int = 150): String
  slug: String!
  body: String!
  image: File @fileByRelativePath
  caption: String
  tags: [String]
}
```

### Example

Place your blog posts inside `content/posts` as follows:

```
site
  ├── content
  │   └── posts
  │       └── 2019-11-20-slug-for-post
  │           ├── image.jpg
  │           └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

```md
# site/content/posts/2019-11-30-slug-for-post/index.mdx

---

title: Proident enim aliqua exercitation laborum Dolor
date: 2019-10-11
excerpt: Consequat consectetur mollit commodo nisi reprehent velit aliqua quis nisi laborum.
image: ./image.jpg
caption: Commodo nisi reprehent velit
tags: ["lipsum", "nobis", "animi"]

---

Et aliquip labore id minim adipisicing excepteur labore in ex deserunt duis quis cillum in.
```

## Customization

Create the following components in your site to shadow and customize the core components:

```
src
└── @arshad
    └── gatsby-theme-blog-core
        └── components
            ├── post-teaser.js
            ├── post.js
            ├── posts.js
            └── tag.js
```

To learn more about component shadowing, check out the [official theme docs](https://www.gatsbyjs.org/docs/themes/shadowing).

### Slug

You can provide your own slug resolver as follows:

```
{
  resolve: `@arshad/gatsby-theme-blog-core`,
  options: {
    slugResolver: (node, parentNode) => custom_slug(node.title)
  }
},
```

## Support

Create an issue on the main repo [@arshad/gatsby-themes](https://github.com/arshad/gatsby-themes/issues).
