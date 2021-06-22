import React from "react"
import Layout from "../../../components/layout"
import ProjectTeaser from "./project-teaser"

export default ({ projects, pageTitle, pageExcerpt }) => (
  <Layout pageTitle={pageTitle} pageExcerpt={pageExcerpt}>
    <div className="md:flex flex-wrap md:-mx-8">
      {projects.map(project => (
        <div className="md:w-1/2 md:px-8 mb-8 md:mb-12" key={project.id}>
          <ProjectTeaser {...project} />
        </div>
      ))}
    </div>
  </Layout>
)
