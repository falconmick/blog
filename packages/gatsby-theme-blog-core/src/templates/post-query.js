import React from "react"
import { graphql } from "gatsby"
import Post from "../components/post"

const PostQuery = ({ data }) => <Post {...data.post} />;

export default PostQuery;

export const query = graphql`
  query($id: String) {
    post(id: { eq: $id }) {
      ...PostFragment
    }
  }
`
