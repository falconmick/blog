import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import striptags from "striptags"

export default ({
  title,
  description,
  image,
  url,
  type = `article`,
  htmlAttributes,
  bodyAttributes,
}) => {
  const data = useStaticQuery(graphql`
    {
      site {
        site: siteMetadata {
          title
          description
          siteUrl
          color
        }
      }
    }
  `)

  const { site } = data.site
  const absoluteUrl = path => (path ? `${site.siteUrl}/${path}` : site.siteUrl)

  return (
    <Helmet
      titleTemplate={`%s | ${site.title}`}
      title={striptags(title || site.title)}
      htmlAttributes={{
        ...htmlAttributes,
        lang: `en`,
      }}
      bodyAttributes={bodyAttributes}
    >
      <link rel="canonical" href={absoluteUrl(url) || site.siteUrl} />
      <meta
        name="description"
        content={striptags(description || site.description)}
      />
      <meta name="og:title" content={striptags(title || site.title)} />
      <meta name="og:type" content={type} />
      <meta name="og:url" content={absoluteUrl(url)} />
      <meta name="og:image" content={absoluteUrl(image)} />
      <meta
        name="og:description"
        content={striptags(description || site.description)}
      />
      <meta name="og:site_name" content={site.title} />
      <meta name="theme-color" content={site.color} />
    </Helmet>
  )
}
