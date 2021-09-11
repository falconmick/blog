import { graphql } from "gatsby"

export const fragment = graphql`fragment PageFragment on Page {
  id
  title
  slug
  excerpt
  description
  is_front
  body
  image {
    full: childImageSharp {
      gatsbyImageData(
        width: 960
        height: 540
        quality: 100
        placeholder: BLURRED
        transformOptions: {cropFocus: CENTER}
        layout: CONSTRAINED
      )
    }
    thumbnail: childImageSharp {
      fluid(maxWidth: 456, maxHeight: 325, cropFocus: CENTER, quality: 100) {
        base64
        aspectRatio
        src
        srcSet
        srcWebp
        srcSetWebp
        sizes
      }
    }
    fixed: childImageSharp {
      fixed(width: 960, quality: 100) {
        src
      }
    }
    extension
    publicURL
  }
}
`
