import React from "react"
import Layout from "../../../components/layout"
import PostTeaser from "./post-teaser"
import Pager from "../../../components/pager"

const Posts = ({
  posts,
  previousPagePath,
  nextPagePath,
  pageTitle,
  pageExcerpt,
}) => (
  <Layout pageTitle={pageTitle} pageExcerpt={pageExcerpt}>
    {posts && posts.map(post => <PostTeaser {...post} key={post.id} />)}
    <Pager {...{ previousPagePath, nextPagePath }} />
  </Layout>
);

export default Posts;
