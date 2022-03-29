import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"

import Icon from "./icon"
import Button from "./button"
import { CodeBlock } from "@michael/gatsby-theme-blog-core"
import { DarkModeProvider } from "../context/darkMode";

// Components available in MDX files.
const mdxComponents = {
  Link,
  Button,
  Icon,
  code: CodeBlock,
}

const Layout = (props) => {
  const { pageTitle, pageTitleSeo, pageExcerpt, pageExcerptSeo, image, imageSeo, children } = props;

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
    <DarkModeProvider>
      <Seo
        title={pageTitleSeo || pageTitle || title}
        description={pageExcerptSeo || pageExcerpt || description}
        image={imageSeo || image}
        bodyAttributes={{
          class: "antialiased bg-white dark:bg-dark",
        }}
      />

      <Header
        siteName={title}
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
    </DarkModeProvider>
  )
};

export default Layout;
