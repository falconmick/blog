import React from "react"
import PostTeaser from "./post-teaser"
import Layout from "../../../components/layout"

export default ({ name, posts }) => (
  <Layout
    pageTitle={name}
    pageExcerpt={`${posts.length} post${
      posts.length === 1 ? `` : `s`
    } tagged with "${name}"`}
  >
    {posts && posts.map(post => <PostTeaser {...post} key={post.id} />)}
  </Layout>
)
