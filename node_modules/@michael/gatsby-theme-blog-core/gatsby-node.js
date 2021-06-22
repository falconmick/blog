const { paginate } = require("gatsby-awesome-pagination")
const { slugify } = require("@michael/gatsby-theme-core/utils")
const fs = require("fs")
const withDefaults = require(`./theme-options`)

exports.onPreBootstrap = ({ reporter }, themeOptions) => {
  const { contentPath } = withDefaults(themeOptions)
  // Check if posts directory exists.
  if (!fs.existsSync(contentPath)) {
    reporter.warn(`The ${contentPath} directory is missing. Creating it now...`)
    fs.mkdirSync(contentPath, { recursive: true })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type Post implements Node @dontInfer {
      id: ID!
      title: String!
      date: Date! @dateformat
      excerpt(pruneLength: Int = 150): String
      slug: String!
      body: String!
      image: File @fileByRelativePath
      caption: String
      tags: [String]
    }
  `)
}

// Helper to resolve mdx fields.
const mdxResolverPassthrough = fieldName => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType(`Mdx`)
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  })
  const resolver = type.getFields()[fieldName].resolve
  return await resolver(mdxNode, args, context, {
    fieldName,
  })
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Post: {
      body: {
        resolve: mdxResolverPassthrough(`body`),
      },
    },
  })
}

exports.onCreateNode = async (
  { node, actions, getNode, createNodeId, createContentDigest },
  themeOptions
) => {
  if (node.internal.type !== `Mdx`) {
    return
  }

  const parent = getNode(node.parent)
  if (parent.sourceInstanceName !== `post`) {
    return
  }

  const { basePath } = withDefaults(themeOptions)
  const nodeType = `Post`

  let slug = `${basePath}/${
    node.frontmatter.slug || slugify(parent.relativeDirectory)
  }`

  // Allow theme consumer to customize the slug.
  if (themeOptions.slugResolver) {
    slug = themeOptions.slugResolver(node, parent)
  }

  // Create Post nodes from Mdx nodes.
  if (nodeType) {
    actions.createNode({
      id: createNodeId(`${nodeType}-${node.id}`),
      title: node.frontmatter.title,
      date: node.frontmatter.date,
      excerpt: node.frontmatter.excerpt,
      slug,
      image: node.frontmatter.image,
      caption: node.frontmatter.caption,
      tags: node.frontmatter.tags,
      url: node.frontmatter.url,
      parent: node.id,
      internal: {
        type: nodeType,
        contentDigest: createContentDigest(node.internal.contentDigest),
      },
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }, themeOptions) => {
  const { createPage } = actions
  const { basePath, postsPerPage, pageTitle, pageExcerpt } = withDefaults(
    themeOptions
  )

  const result = await graphql(`
    query {
      allPost(sort: { fields: date, order: DESC }) {
        posts: nodes {
          id
          slug
        }
      }
      allTag: allMdx {
        tags: group(field: frontmatter___tags) {
          name: fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic(`There was an error fetching blog posts.`, result.errors)
  }

  const { posts } = result.data.allPost
  const { tags } = result.data.allTag

  // Create paginated blog pages
  paginate({
    createPage,
    items: posts,
    itemsPerPage: postsPerPage,
    pathPrefix: ({ pageNumber }) =>
      pageNumber === 0 ? basePath : `${basePath}/page`,
    component: require.resolve(`./src/templates/posts-query.js`),
    context: {
      total: posts.length,
      pageTitle,
      pageExcerpt,
    },
  })

  // Create post pages.
  posts.forEach(node => {
    actions.createPage({
      path: node.slug,
      component: require.resolve(`./src/templates/post-query.js`),
      context: {
        id: node.id,
      },
    })
  })

  // Create tag pages.
  tags.forEach(tag => {
    actions.createPage({
      path: `${basePath}/tags/${slugify(tag.name.toLowerCase())}`,
      component: require.resolve(`./src/templates/tag-query.js`),
      context: {
        ...tag,
      },
    })
  })
}
