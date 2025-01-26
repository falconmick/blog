const { slugify } = require("@michael/gatsby-theme-core/utils");
require(`dotenv`).config()

const slugWithoutDate = (relativeDirectory) => {
  const relativeDirectoryWithoutDate = relativeDirectory.replace(/\d{4}-\d{1,2}-\d{1,2}-/, '');

  return slugify(relativeDirectoryWithoutDate);
};

module.exports = {
  siteMetadata: {
    title: `My Coding Life`,
    description: `Michael's personal site and blog`,
    siteUrl: process.env.SITE_URL || `http://localhost:8000`,
    startUrl: `/`,
    copyright: ``,
    icon: `assets/images/icon.png`,
    color: `#3C64F1`,
    menuLinks: [
      {
        name: `Home`,
        link: `/blog?coming=soon`,
      },
      {
        name: `Blog`,
        link: `/blog`,
      },
    ],
    socialLinks: [
      {
        name: `Github`,
        url: `https://github.com/falconmick/`,
        icon: `github`,
      },
      {
        name: `Twitter`,
        url: `https://twitter.com/falconmick`,
        icon: `twitter`,
      },
      {
        name: `Email`,
        url: `mailto:contact@mcrook.com`,
        icon: `mail`,
      },
    ],
  },
  plugins: [
    // This is a list of all themes that this starter is using.
    // To disable a theme, remove it here and run `yarn remove @michael/gatsby-theme-NAME`.
    {
      resolve: `@michael/gatsby-theme-blog-core`,
      options: {
        slugResolver: (node, parentNode) => slugWithoutDate(parentNode.relativeDirectory),
        repoBaseUrl: "https://github.com/falconmick/blog",
        repoDefaultBranch: "main",
        pageTitle: "Michael's Coding Blog",
        postsPerPage: 5
      }
    },
    `@michael/gatsby-theme-page-core`,
    `@michael/gatsby-theme-phoenix`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {},
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `My Coding Life`,
        short_name: `My Coding Life`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `assets/images/icon.png`
      },
    },
    { // we have added gatsby-ssr to serve this up as we are using no-javascript
      resolve: `gatsby-plugin-goatcounter`,
      options: {
        code: 'mcrook',
        head: false,
        allowLocal: false,
        pixel: true
      },
    },
    // 'gatsby-plugin-no-javascript' // disabled while we fix iOS
  ],
}
