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
    // To disable a theme, remove it here and run `yarn remove @arshad/gatsby-theme-NAME`.
    `@arshad/gatsby-theme-blog-core`,
    `@arshad/gatsby-theme-page-core`,
    `@arshad/gatsby-theme-phoenix`,
  ],
}
