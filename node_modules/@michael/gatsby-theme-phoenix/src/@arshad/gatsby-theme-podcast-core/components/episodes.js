import React from "react"
import Layout from "../../../components/layout"
import EpisodeTeaser from "./episode-teaser"
import Podcast from "./podcast"
import Pager from "../../../components/pager"

export default ({ episodes, previousPagePath, nextPagePath, podcast }) => (
  <Layout>
    {podcast && !previousPagePath && <Podcast {...podcast} />}

    <h2 className="mt-12 mb-6 text-center">Latest episodes</h2>
    <div className="px-4 md:px-0 md:w-4/5 mx-auto">
      {episodes &&
        episodes.map(episode => (
          <div key={episode.id} className="mb-10">
            <EpisodeTeaser {...episode} />
          </div>
        ))}
    </div>
    <Pager {...{ previousPagePath, nextPagePath }}></Pager>
  </Layout>
)
