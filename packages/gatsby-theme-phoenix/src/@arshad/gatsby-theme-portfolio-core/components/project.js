import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../../../components/layout"
import Icon from "../../../components/icon"
import Img from "gatsby-image"

export default ({ title, excerpt, url, image, body }) => (
  <Layout pageTitle={title} pageExcerpt={excerpt}>
    <article>
      <div className="text-center md:w-4/5 mb-12 mx-auto">
        <a
          href={url}
          className="inline-flex items-center hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url} <Icon name="arrow-right" size="20" className="ml-2" />
        </a>
      </div>

      {image && (
        <Img fluid={image.full.fluid} className="rounded-sm" alt={title} />
      )}

      <div className="lg:w-4/5 my-6 mx-auto content">
        {body && <MDXRenderer>{body}</MDXRenderer>}
      </div>
    </article>
  </Layout>
)
