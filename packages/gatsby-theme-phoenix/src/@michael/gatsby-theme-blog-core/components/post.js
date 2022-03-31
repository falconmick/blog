import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from "slugify"
import { Link } from "gatsby"
import Layout from "../../../components/layout"

const Post = (props) => {
  const { title, excerpt, image, socialImage, tags, caption, date, body, embeddedImagesLocal, githubEditPath } = props;
  const tagLinks = tags
    ? tags.map((tag, i) => {
      const divider = i < tags.length - 1 && <span>{`, `}</span>
      return (
        <span key={`tag-${i}`}>
            <Link
              to={`/blog/tags/${slugify(tag.toLowerCase())}/`}
              className="text-dark font-semibold underline dark:text-white"
            >
              {tag}
            </Link>
          {divider}
          </span>
      )
    })
    : null

  return (
    <Layout pageTitleSeo={title} pageExcerptSeo={excerpt} imageSeo={socialImage?.publicURL ?? image?.publicURL}>
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
              <GatsbyImage
                image={image.childImageSharp.gatsbyImageData}
                className="rounded-sm"
                style={{ height: "100%", width: "100%" }}
                imgStyle={{ objectFit: "contain" }}
                title={title}
                alt={caption || title} />
            )}
            {caption && (
              <figcaption dangerouslySetInnerHTML={{ __html: caption }} />
            )}
          </figure>
        )}

        <div className="lg:w-4/5 my-6 mx-auto content px-4 prism-code-px-4">
          {body && <MDXRenderer localImages={embeddedImagesLocal} githubEditPath={githubEditPath}>{body}</MDXRenderer>}
        </div>

        <div className="lg:w-4/5 mx-auto px-4">
          <div className="text-sm mt-8 pt-8 md:mt-16 md:pt-16 border-t border-offwhite dark:border-text text-text dark:text-white">
            {tags && <>Tagged with {tagLinks}</>}
            <br />
            <br />
            something not right?&nbsp;
            <a
              href={githubEditPath}
              rel="noopener noreferrer"
              target="_blank"
              className="text-dark font-semibold underline dark:text-white"
            >
              Open a PR
            </a>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Post;
