<div align="center">
<h1>@arshad/gatsby-theme-phoenix</h1>
</div>
<p align="center">
A Gatsby theme that bundles a blog, portfolio, photography and podcast. It uses <strong>Tailwind CSS</strong> for theming and includes <strong>code highlighting with Prism, RSS feed, a dark mode</strong> and <strong>great typography</strong>. It is <strong>accessible</strong> and <strong>optimized for search engines</strong>.
</p>

<p align="center">
  <a href="https://arshad-gatsby-example-phoenix.netlify.com"><img src="https://img.shields.io/badge/demo-netlify-success" alt="Demo"></a>
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-phoenix"><img src="https://img.shields.io/npm/v/@arshad/gatsby-theme-phoenix.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-phoenix"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-phoenix.svg" alt="License"></a>
  <a href="https://github.com/arshad/gatsby-themes"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
</p>

<p align="center">
  <img src="https://arshad.io/uploads/gatsby-theme-phoenix-screenshot.jpg" alt="Phoenix preview" />
</p>

<h3 align="center"><code>gatsby new site arshad/gatsby-starter-phoenix</code></h3>

## Installation

### Step 1: Run the following command to create a new site

```shell
gatsby new my-site arshad/gatsby-starter-phoenix
```

### Step 2: Configure `.env`

Copy `.env.example` to `.env` and update `SITE_URL`.

### Step 3: Start developing

```shell
cd my-site/
gatsby develop
```

## Adding content

### Page

Place your pages inside `content/pages` as follows:

```
my-site
  ├── content
  │ └── pages
  │     └── about
  │         ├── image.jpg
  │         └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

`content/pages/about/index.mdx:`

```md
title: Hello, I'm Nulla Texier
excerpt: Temporibus tenetur eveniet ipsa. Enim eum consequatur magnam. Nulla quaerat est nam consequatur magnam.
```

### Post

Place your blog posts inside `content/posts` as follows:

```
my-site
  ├── content
  │ └── posts
  │     └── 2019-11-19-slug-for-post
  │         ├── image.jpg
  │         └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

`content/posts/2019-11-19-slug-for-post/index.mdx:`

```md
---
title: Mollitia quaerat perspiciatis eaque vel officiis
date: 2018-09-01
excerpt: Nobis et distinctio ipsam officia rem similique. Ipsa facilis doloremque quos culpa similique quidem autem. Expedita doloribus.
image: ./image.jpg
caption: Illustration by <a href="https://illlustrations.co">illlustrations.co</a>
tags: ["nobis", "animi"]
---

Et aliquip labore id minim adipisicing excepteur labore in ex deserunt duis quis cillum in. Sint enim proident incididunt cillum esse sit sunt laboris dolore. Eu qui proident eu ut eiusmod sunt aliquip ut dolor. Ipsum consequat culpa officia dolor.
```

## Projects

Place your projects inside `content/projects` as follows:

```
my-site
  ├── content
  │ └── projects
  │     └── name-of-project
  │         ├── image.jpg
  │         └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

`content/projects/name-of-project/index.mdx:`

```md
---
title: Aspernatur voluptates
excerpt: Quos totam nihil saepe ipsam incidunt. Quo ipsam soluta sapiente.
url: https://example.com
image: image.jpg
---
```

## Photos

Place your photos inside `content/photos` as follows:

```
site
  ├── content
  │   └── photos
  │       └── photo-1
  │           ├── photo.jpg
  │           └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

`content/photos/photo-1/index.mdx`

```md
---
title: Proident enim aliqua
date: 2019-10-11
excerpt: Consequat consectetur mollit commodo nisi reprehent velit aliqua quis nisi laborum.
image: ./photo.jpg
---

Et aliquip labore id minim adipisicing excepteur labore in ex deserunt duis quis cillum in.
```

## Configuration

The following theme options and configuration is available:

```js
// gatsby-config.js
{
  title: `Phoenix.`,
  description: `Description for your site.`,
  siteUrl: process.env.SITE_URL,
  startUrl: `/`,
  copyright: `© YYYY Phoenix. All rights reserved.`,
  icon: `src/images/icon.png`,
  color: `#3C64F1`,
  menuLinks: [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Projects",
      link: "/projects",
    },
    {
      name: "Portfolio",
      link: "/portfolio",
    },
    {
      name: "Podcast",
      link: "/podcast",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ],
  socialLinks: [
    {
      name: "Twitter",
      url: "https://twitter.com/arshadcn",
      icon: "twitter",
    },
    {
      name: "Github",
      url: "https://github.com/arshad",
      icon: "github",
    },
  ],
}
```

## Customization

Gatsby uses shadowing for theme customization. You can read more about it [here](https://www.gatsbyjs.org/docs/themes/shadowing/).

## Support

Create an issue on the main repo [@arshad/gatsby-themes](https://github.com/arshad/gatsby-themes/issues).

## 👏 Credits

- Illustrations from [illlustrations.co](https://illlustrations.co)
- Icons from [Feather](https://feathericons.com)
