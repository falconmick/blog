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
        width: 736
        height: 540
        quality: 70
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
