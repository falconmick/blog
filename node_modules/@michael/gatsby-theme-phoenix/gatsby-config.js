module.exports = {
  plugins: [
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: [
            "Alegreya Sans:500,700",
            "Open Sans:300,400,600,700",
            "Bowlby One SC",
          ],
        },
      },
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
