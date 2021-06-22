import React from "react"
import Layout from "../../../components/layout"
import PhotoTeaser from "./photo-teaser"
import Pager from "../../../components/pager"

export default ({
  photos,
  previousPagePath,
  nextPagePath,
  pageTitle,
  pageExcerpt,
}) => (
  <Layout pageTitle={pageTitle} pageExcerpt={pageExcerpt}>
    <div className="md:flex md:flex-wrap md:-mx-4">
      {photos &&
        photos.map(photo => (
          <div className="md:w-1/3 md:px-4 mb-8" key={photo.id}>
            <PhotoTeaser {...photo} />
          </div>
        ))}
    </div>
    <Pager {...{ previousPagePath, nextPagePath }}></Pager>
  </Layout>
)
