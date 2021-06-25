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
    siteUrl: process.env.SITE_URL || `http://localhost`,
    startUrl: `/`,
    copyright: ``,
    icon: `assets/images/icon.png`,
    color: `#3C64F1`,
    menuLinks: [
      {
        name: `Home`,
        link: `/`,
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
      }
    ],
  },
  plugins: [
    // This is a list of all themes that this starter is using.
    // To disable a theme, remove it here and run `yarn remove @michael/gatsby-theme-NAME`.
    {
      resolve: `@michael/gatsby-theme-blog-core`,
      options: {
        slugResolver: (node, parentNode) => slugWithoutDate(parentNode.relativeDirectory)
      }
    },
    `@michael/gatsby-theme-page-core`,
    `@michael/gatsby-theme-phoenix`,
    `gatsby-plugin-netlify`
  ],
}
