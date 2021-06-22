import React from "react"
import Layout from "../../../components/layout"
import { formatDuration, formatDate } from "../utils"

export default ({ title, summary, date, duration, podcast }) => (
  <Layout
    pageTitle={title}
    pageExcerpt={`${formatDate(date)} • ${formatDuration(duration)}`}
  >
    <article>
      <div className="lg:w-4/5 my-6 mx-auto content">
        {summary && (
          <p
            className="mt-5 text-text text-center dark:text-white"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        )}

        {podcast.social && (
          <p className="font-bold mt-4 leading-tight text-center">
            <small className="font-normal">
              Listen on <br />
            </small>
            {podcast.social.map(({ name, url }, index) => (
              <span key={name}>
                <a href={url} className="hover:text-primary">
                  {name}
                </a>
                {index !== podcast.social.length - 1 && ` / `}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  </Layout>
)
