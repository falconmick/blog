import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"

import Icon from "./icon"
import Button from "./button"
import { CodeBlock } from "@michael/gatsby-theme-blog-core"

// Components available in MDX files.
const mdxComponents = {
  Link,
  Button,
  Icon,
  code: CodeBlock,
}

export default ({ pageTitle, pageExcerpt, children }) => {
  const [mode, setMode] = useState(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("mode") || "light"
      : "light"
  )

  React.useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mode", mode)
    }
  }, [mode])

  const data = useStaticQuery(graphql`
    {
      allSite {
        nodes {
          siteMetadata {
            title
            description
            copyright
            menuLinks {
              name
              link
            }
            socialLinks {
              icon
              name
              url
            }
          }
        }
      }
    }
  `)

  const {
    title,
    description,
    copyright,
    socialLinks,
    menuLinks,
  } = data.allSite.nodes[0].siteMetadata

  return (
    <>
      <Seo
        title={pageTitle || title}
        description={pageExcerpt || description}
        htmlAttributes={{
          class: mode === "dark" ? "mode-dark" : "",
        }}
        bodyAttributes={{
          class: "antialiased bg-white dark:bg-dark px-4",
        }}
      />

      <Header
        siteName={title}
        mode={mode}
        setMode={setMode}
        socialLinks={socialLinks}
        menuLinks={menuLinks}
      />

      <main className="py-6 md:py-12">
        <div className="container mx-auto">
          {(pageTitle || pageExcerpt) && (
            <div className="text-center md:w-4/5 mb-12 mx-auto">
              {pageTitle && (
                <h1 dangerouslySetInnerHTML={{ __html: pageTitle }} />
              )}
              {pageExcerpt && (
                <p
                  className="lead mt-4"
                  dangerouslySetInnerHTML={{ __html: pageExcerpt }}
                />
              )}
            </div>
          )}

          <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </div>
      </main>

      <Footer>
        <p className="small text-center">
          {copyright.replace(/(Y{4})/, new Date().getFullYear())}
        </p>
      </Footer>
    </>
  )
}
