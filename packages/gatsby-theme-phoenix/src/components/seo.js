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
      <link rel="preload" href="https://fonts.googleapis.com/css?family=Alegreya+Sans:700|Open+Sans:300,400,600|Bowlby+One+SC&amp;display=swap" as="style" crossOrigin />
      <link rel="preload" href="https://fonts.gstatic.com/s/bowlbyonesc/v12/DtVlJxerQqQm37tzN3wMug9P_g_2og.woff2" as="font" type="font/woff2" crossOrigin />
      <link rel="preload" href="https://fonts.gstatic.com/s/opensans/v23/mem8YaGs126MiZpBA-UFVZ0b.woff2" as="font" type="font/woff2" crossOrigin />
      <link rel="preload" href="https://fonts.gstatic.com/s/opensans/v23/mem5YaGs126MiZpBA-UNirkOUuhp.woff2" as="font" type="font/woff2" crossOrigin />
      <link rel="preload" href="https://fonts.gstatic.com/s/alegreyasans/v14/5aUu9_-1phKLFgshYDvh6Vwt5eFIqEp2iw.woff2" as="font" type="font/woff2" crossOrigin />
    </Helmet>
  );
}
