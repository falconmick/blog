import React from "react"
import { graphql } from "gatsby"
import Posts from "../components/posts"

export default ({ pageContext, data }) => (
  <Posts posts={data.allPost.posts} {...pageContext} />
)

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    allPost(sort: { fields: [date], order: DESC }, skip: $skip, limit: $limit) {
      posts: nodes {
        ...PostFragment
      }
    }
  }
`
