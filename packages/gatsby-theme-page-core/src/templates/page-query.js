import React from "react"
import { graphql } from "gatsby"
import Page from "../components/page"

const PageQuery = ({ data }) => <Page {...data.page} />;

export default PageQuery;

export const query = graphql`
  query($id: String) {
    page(id: { eq: $id }) {
      ...PageFragment
    }
  }
`
