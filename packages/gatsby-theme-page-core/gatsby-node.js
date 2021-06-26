const { slugify } = require("@michael/gatsby-theme-core/utils")
const fs = require("fs")
const withDefaults = require(`./theme-options`)

exports.onPreBootstrap = ({ reporter }, themeOptions) => {
  const { contentPath } = withDefaults(themeOptions)

  // Check if pages directory exists.
  if (!fs.existsSync(contentPath)) {
    reporter.warn(`The ${contentPath} directory is missing. Creating it now...`)
    fs.mkdirSync(contentPath, { recursive: true })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type Page implements Node @dontInfer {
      id: ID!
      title: String!
      excerpt: String
      description: String
      image: File @fileByRelativePath
      slug: String!
      body: String!
      is_front: Boolean!
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
    Page: {
      body: {
        resolve: mdxResolverPassthrough(`body`),
      },
    },
  })
}

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type !== "Mdx") {
    return
  }

  const parent = getNode(node.parent)
  if (parent.sourceInstanceName !== "page") {
    return
  }

  const nodeType = `Page`

  // Create Post nodes from Mdx nodes.
  if (nodeType) {
    actions.createNode({
      id: createNodeId(`${nodeType}-${node.id}`),
      title: node.frontmatter.title,
      excerpt: node.frontmatter.excerpt,
      description: node.frontmatter.description,
      slug: node.frontmatter.slug || slugify(parent.relativeDirectory),
      image: node.frontmatter.image,
      is_front: node.frontmatter.is_front || false,
      parent: node.id,
      internal: {
        type: nodeType,
        contentDigest: createContentDigest(node.internal.contentDigest),
      },
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query {
      allPage {
        pages: nodes {
          id
          slug
          is_front
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic(`There was an error fetching pages.`, result.errors)
  }

  const { pages } = result.data.allPage

  // Create pages.
  pages.forEach(page => {
    actions.createPage({
      path: page.is_front ? "/" : page.slug + "/",
      component: require.resolve(`./src/templates/page-query.js`),
      context: {
        id: page.id,
      },
    })
  })
}
