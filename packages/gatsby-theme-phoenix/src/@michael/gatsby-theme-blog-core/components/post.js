import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Img from "gatsby-image"
import slugify from "slugify"
import { Link } from "gatsby"
import Layout from "../../../components/layout"

export default (props) => {
  const { title, excerpt, image, tags, caption, date, body } = props;
  const tagLinks = tags
    ? tags.map((tag, i) => {
        const divider = i < tags.length - 1 && <span>{`, `}</span>
        return (
          <span key={`tag-${i}`}>
            <Link
              to={`/blog/tags/${slugify(tag.toLowerCase())}/`}
              className="text-dark font-bold underline dark:text-white"
            >
              {tag}
            </Link>
            {divider}
          </span>
        )
      })
    : null

  return (
    <Layout pageTitleSeo={title} pageExcerptSeo={excerpt}>
      <article className="post mb-12 md:mb-24">
        <div className="text-center lg:w-4/5 mx-auto px-4">
          <p className="small">{date}</p>
          <h1 className="mt-2">
            <span>{title}</span>
          </h1>
          {excerpt && <p className="lead mt-4">{excerpt}</p>}
        </div>

        {image.publicURL && (
          <figure className="mt-8 mb-10 md:mt-16 mt:mb-20 post-image">
            {image.extension === "svg" ? (
              <img
                src={image.publicURL}
                className="rounded-sm svg-img"
                title={title}
                alt={caption || title}
              />
            ) : (
              <Img
                fluid={image.full.fluid}
                className="rounded-sm"
                style={{ height: "100%", width: "100%" }}
                imgStyle={{ objectFit: "contain" }}
                title={title}
                alt={caption || title}
              />
            )}
            {caption && (
              <figcaption dangerouslySetInnerHTML={{ __html: caption }} />
            )}
          </figure>
        )}

        <div className="lg:w-4/5 my-6 mx-auto content px-4 prism-code-px-4">
          {body && <MDXRenderer>{body}</MDXRenderer>}
        </div>

        <div className="lg:w-4/5 mx-auto px-4">
          {tags && (
            <div className="text-sm mt-8 pt-8 md:mt-16 md:pt-16 border-t border-offwhite dark:border-text text-text dark:text-white">
              Tagged with {tagLinks}
            </div>
          )}
        </div>
      </article>
    </Layout>
  )
}
