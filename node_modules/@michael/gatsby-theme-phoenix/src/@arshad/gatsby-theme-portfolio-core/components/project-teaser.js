import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import Icon from "../../../components/icon"

export default ({ title, excerpt, slug, image }) => (
  <article className="shadow">
    <Link to={slug} className="group p-4 block">
      {image && (
        <Img fluid={image.full.fluid} alt={title} className="rounded-sm" />
      )}
      <div className="mt-4">
        <h2 className="group-hover:text-primary">{title}</h2>
        {excerpt && <p className="mt-2">{excerpt}</p>}
        <div className="text-sm text-dark mt-2 uppercase font-semibold flex py-2">
          Learn more <Icon name="arrow-right" size="20" className="ml-2" />
        </div>
      </div>
    </Link>
  </article>
)
