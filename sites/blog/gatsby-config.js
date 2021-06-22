require(`dotenv`).config()

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
    `@michael/gatsby-theme-blog-core`,
    `@michael/gatsby-theme-page-core`,
    `@michael/gatsby-theme-phoenix`,
  ],
}
