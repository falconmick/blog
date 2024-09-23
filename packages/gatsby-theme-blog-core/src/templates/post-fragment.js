import { graphql } from "gatsby"

export const fragment = graphql`fragment PostFragment on Post {
  id
  title
  date(formatString: "MMMM DD, YYYY")
  excerpt
  body
  slug
  tags
  caption
  videoSrcURL
  videoTitle
  githubEditPath
  embeddedImagesLocal {
    childImageSharp {
      gatsbyImageData(
        width: 736
        quality: 70
        placeholder: NONE
        layout: CONSTRAINED
      )
    }
    extension
    publicURL
  }
  image {
    childImageSharp {
      gatsbyImageData(
        quality: 70
        placeholder: BLURRED
        transformOptions: {cropFocus: CENTER}
        layout: FULL_WIDTH
      )
    }
    extension
    publicURL
  }
  socialImage {
    extension
    publicURL
  }
}
`
