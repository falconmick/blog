import React from "react"
import Img from "gatsby-image"

export default ({ name, description, image, social }) => (
  <section className="shadow p-4 md:p-8 md:flex rounded">
    <div className="md:w-1/3 md:pr-8 mb-6 md:mb-0">
      {image && <Img fluid={{ ...image.full.fluid }} className="rounded-sm" />}
    </div>
    <div className="md:w-2/3">
      <h1>
        <span>{name}</span>
      </h1>
      <p className="lead mt-4">{description}</p>
      {social && (
        <p className="font-bold mt-4 leading-tight">
          <small className="font-normal">
            Listen on <br />
          </small>
          {social.map(({ name, url }, index) => (
            <span key={name}>
              <a href={url} className="hover:text-primary">
                {name}
              </a>
              {index !== social.length - 1 && ` / `}
            </span>
          ))}
        </p>
      )}
    </div>
  </section>
)
