import React from "react"
import { graphql } from "gatsby"
import Tag from "../components/tag"

const TagQuery = ({ pageContext, data }) => (
  <Tag name={pageContext.name} posts={data.allPost.posts} />
);

export default TagQuery;

export const query = graphql`
  query($name: String!) {
    allPost(
      filter: { tags: { eq: $name } }
      sort: { fields: [date], order: DESC }
    ) {
      posts: nodes {
        ...PostFragment
      }
    }
  }
`
