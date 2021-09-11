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
    childImageSharp {
      gatsbyImageData(
        width: 960
        height: 540
        quality: 100
        placeholder: BLURRED
        transformOptions: {cropFocus: CENTER}
        layout: CONSTRAINED
      )
    }
    extension
    publicURL
  }
}
`
