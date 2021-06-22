<div align="center">
<h1>@arshad/gatsby-theme-page-core</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-page-core"><img src="https://img.shields.io/npm/v/@arshad/gatsby-theme-page-core.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-page-core"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-page-core.svg" alt="License"></a>
  <a href="https://github.com/arshad/gatsby-themes"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
</p>

<p align="center">
This core theme includes a <code>Page</code> type that you can use to build MDX pages. It includes <strong>no styles</strong>.
</p>

## Installation

### Step 1: In the root of your Gatsby site, run the following command:

```shell
yarn add @arshad/gatsby-theme-page-core
```

### Step 2: Enable it in `gatsby-config.js`

```js
// gatsby-config.js
...
  plugins: [
    `@arshad/gatsby-theme-page-core`
  ]
...
```

## Theme options

| Key           | Default value   | Description            |
| ------------- | --------------- | ---------------------- |
| `contentPath` | `content/pages` | Location of your pages |

### Example usage

```js
// gatsby-config.js
...
  plugins: [
    {
      resolve: `@arshad/gatsby-theme-page-core`,
      options: {
        contentPath: `content/pages`,
      }
    }
  ]
...
```

## Data models

### Post

```js
type Page implements Node @dontInfer {
  id: ID!
  title: String!
  excerpt: String
  slug: String!
  body: String!
  is_front: Boolean!
}
```

### Example

Place your pages inside `content/pages` as follows:

```
site
  ├── content
  │   └── pages
  │       └── about-us
  │           ├── image.jpg
  │           └── index.mdx
  ├── node_modules
  ├── gatsby-config.js
  └── package.json
```

```md
# site/content/pages/about-us/index.mdx

---

title: About Us
excerpt: Temporibus tenetur eveniet ipsa. Enim eum consequatur magnam.

---

![Picture](image.jpg)

Quos totam nihil saepe ipsam incidunt. Quo ipsam soluta sapiente.
```

## Customization

Create the following components in your site to shadow and customize the core components:

```
src
└── @arshad
    └── gatsby-theme-page-core
        └── components
            └── page.js
```

To learn more about component shadowing, check out the [official theme docs](https://www.gatsbyjs.org/docs/themes/shadowing).

## Support

Create an issue on the main repo [@arshad/gatsby-themes](https://github.com/arshad/gatsby-themes/issues).
