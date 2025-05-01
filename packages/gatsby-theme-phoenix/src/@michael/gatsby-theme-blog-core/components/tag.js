import React from "react"
import PostTeaser from "./post-teaser"
import Layout from "../../../components/layout"

function getPageTitle(name) {
  return name === "conference-talk" ? "See me Speak" : name;
}

const Tag = ({ name, posts }) => (
  <Layout
    pageTitle={getPageTitle(name)}
    pageExcerpt={`${posts.length} post${
      posts.length === 1 ? `` : `s`
    } tagged with "${name}"`}
  >
    {posts && posts.map(post => <PostTeaser {...post} key={post.id} />)}
  </Layout>
);

export default Tag;
