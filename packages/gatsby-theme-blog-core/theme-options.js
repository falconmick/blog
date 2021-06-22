module.exports = themeOptions => ({
  contentPath: `content/posts`,
  basePath: `/blog`,
  postsPerPage: 3,
  pageTitle: `Blog`,
  pageExcerpt: null,
  ...themeOptions,
})
