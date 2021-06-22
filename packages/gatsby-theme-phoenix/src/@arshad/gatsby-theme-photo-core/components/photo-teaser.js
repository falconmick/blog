import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

export default ({ title, date, image, excerpt, slug }) => {
  return (
    <article className="h-full group">
      <Link to={slug} className="h-full flex flex-col">
        {image && (
          <Img
            fluid={image.thumbnail.fluid}
            className="rounded-sm group-hover:shadow-md animated"
          />
        )}
        <div className="mt-2 text-center flex-1 flex flex-col justify-between p-4">
          <div className="mb-2">
            <h2 className="text-2xl leading-tight">{title}</h2>
            {date && <small>{date}</small>}
          </div>
          {excerpt && <p className="text-sm text-gray mt-auto">{excerpt}</p>}
        </div>
      </Link>
    </article>
  )
}
