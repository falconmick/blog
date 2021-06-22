import React from "react"
import { graphql } from "gatsby"
import Page from "../components/page"

export default ({ data }) => <Page {...data.page} />

export const query = graphql`
  query($id: String) {
    page(id: { eq: $id }) {
      ...PageFragment
    }
  }
`
