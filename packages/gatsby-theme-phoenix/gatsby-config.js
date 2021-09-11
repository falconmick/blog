module.exports = {
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Alegreya Sans\:700`,
          `Open Sans\:300,400,600`,
          `Bowlby One SC`,
        ],
        display: 'swap'
      }
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require("tailwindcss")(require("./src/tailwind.config")),
          require("autoprefixer"),
          require("postcss-color-function"),
        ],
      },
    },
  ],
}
