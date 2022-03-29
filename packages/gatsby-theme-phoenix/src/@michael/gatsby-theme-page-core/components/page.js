import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../../../components/layout"

const Page = ({ title, excerpt, body, children }) => (
  <Layout pageTitle={title} pageExcerpt={excerpt}>
    <article>
      <div className="lg:w-4/5 my-6 mx-auto content">
        {body && <MDXRenderer>{body}</MDXRenderer>}
        {children}
      </div>
    </article>
  </Layout>
);

export default Page
