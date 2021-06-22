<div align="center">
<h1>@arshad/gatsby-theme-core</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-core"><img src="https://img.shields.io/npm/v/@arshad/gatsby-theme-core.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@arshad/gatsby-theme-core"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-core.svg" alt="License"></a>
  <a href="https://github.com/arshad/gatsby-themes"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
</p>

<p align="center">
This core theme includes shared functionality and helpers for <a href="https://github.com/arshad/gatsby-themes">@arshad/gatsby-themes</a>.
</p>

## Installation

### Step 1: In the root of your Gatsby site, run the following command:

```shell
yarn add @michael/gatsby-theme-core
```

### Step 2: Enable it in `gatsby-config.js`

```js
// gatsby-config.js
...
  plugins: [
    `@arshad/gatsby-theme-core`
  ]
...
```

## Theme options

| Key          | Default value    | Description             |
| ------------ | ---------------- | ----------------------- |
| `imagesPath` | `/content/posts` | Location of your images |

### Example usage

```js
// gatsby-config.js
...
  plugins: [
    {
      resolve: `@arshad/gatsby-theme-core`,
      options: {
        imagesPath: `assets/images`,
      }
    }
  ]
...
```

## Support

Create an issue on the main repo [@arshad/gatsby-themes](https://github.com/arshad/gatsby-themes/issues).
