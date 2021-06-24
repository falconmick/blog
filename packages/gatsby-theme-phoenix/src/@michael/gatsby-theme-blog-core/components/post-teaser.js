import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

export default ({ title, slug, image, date, excerpt }) => {
  excerpt = excerpt.length > 150 ? excerpt.substr(0, 150) + "..." : excerpt
  return (
    <Link
      to={slug}
      className="hover:no-underline group rounded md:-mx-8 md:p-8 block hover:bg-eggshell dark-hover:bg-text"
      title={`Go to the "${title}" post`}
    >
      <article className="flex-col md:flex md:flex-row justify-between">
        <div className="md:w-1/2 md:pr-4 lg:pr-10">
          {image && (
            <Img
              fluid={image.thumbnail.fluid}
              className="rounded-sm"
              alt={`Image for ${title}`}
              title={title}
            />
          )}
        </div>
        <div className="mx-4 md:mx-0 md:w-1/2 py-4 md:py-0 lg:py-6 md:pl-4 lg:pl-2">
          <h2 className="text-text dark:text-white">{title}</h2>
          <small className="mt-2 block">{date}</small>

          {excerpt && (
            <p
              className="mt-5 text-text dark:text-white"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          )}
        </div>
      </article>
    </Link>
  )
}
