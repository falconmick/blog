import React from "react"
import { Link } from "gatsby"
import Icon from "./icon"

const Pager = ({ previousPagePath, nextPagePath }) => {
  return (
    <div className="flex items-center justify-between mt-16 md:w-4/5 mx-auto">
      {previousPagePath && (
        <Link to={previousPagePath} className="button">
          <Icon name="arrow-left" />
          Previous
        </Link>
      )}
      {nextPagePath && (
        <Link to={nextPagePath} className="button ml-auto">
          Next
          <Icon name="arrow-right" />
        </Link>
      )}
    </div>
  )
};

export default Pager;
