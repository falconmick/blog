const withDefaults = require("./theme-options.js");

module.exports = (themeOptions) => {
  const { imagesPath } = withDefaults(themeOptions)

  return {
    plugins: [
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `image`,
          path: imagesPath,
        },
      },
    ],
  }
};
