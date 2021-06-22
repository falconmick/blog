import React from "react"
import Layout from "../../../components/layout"
import Img from "gatsby-image"
import { MDXRenderer } from "gatsby-plugin-mdx"

export default ({ title, excerpt, date, image, body }) => (
  <Layout pageTitle={title} pageExcerpt={excerpt}>
    <article>
      <div className="lg:w-4/5 my-6 mx-auto content">
        {image && <Img fluid={image.full.fluid} className="rounded-sm" />}
        {date && <p className="text-sm text-center mt-4">{date}</p>}

        <div className="lg:w-4/5 my-6 mx-auto content">
          {body && <MDXRenderer>{body}</MDXRenderer>}
        </div>
      </div>
    </article>
  </Layout>
)
