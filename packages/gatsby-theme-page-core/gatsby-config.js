const withDefaults = require(`./theme-options`)
const remarkSlug = require(`remark-slug`)

module.exports = themeOptions => {
  const { contentPath } = withDefaults(themeOptions)
  return {
    plugins: [
      `@michael/gatsby-theme-core`,
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      `gatsby-transformer-remark`,
      `gatsby-image`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `page`,
          path: contentPath,
        },
      },
      {
        resolve: `gatsby-plugin-mdx`,
        options: {
          gatsbyRemarkPlugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                linkImagesToOriginal: false,
                quality: 100,
                withWebp: true,
              },
            },
          ],
          remarkPlugins: [remarkSlug],
        },
      },
    ],
  }
}
