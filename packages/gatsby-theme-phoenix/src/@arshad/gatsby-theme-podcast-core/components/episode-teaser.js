import React from "react"
import { Link } from "gatsby"
import Icon from "../../../components/icon"
import { formatDuration, formatDate } from "../utils"

export default ({ title, summary, slug, date, duration }) => (
  <Link
    to={slug}
    className="hover:no-underline group rounded md:-mx-8 md:p-8 block hover:bg-eggshell dark-hover:bg-text"
    title={`Go to the "${title}" episode`}
  >
    <article>
      <h3 className="text-text dark:text-white">{title}</h3>
      <p className="mt-2 block text-gray font-bold">
        {formatDate(date)} • {formatDuration(duration)}
      </p>
      {summary && (
        <p
          className="mt-5 text-text dark:text-white"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
      <span className="button button-primary mt-6">
        View Episode <Icon name="arrow-right" />
      </span>
    </article>
  </Link>
)
