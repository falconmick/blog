import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Icon from "./icon"

const Button = ({ text, url, type, asLink, icon, iconBefore }) => {
  const buttonClasses = `button button-${type}`
  let content = text

  if (icon) {
    content = (
      <>
        {iconBefore && <Icon name={icon} className="mr-2" />}
        {text}
        {!iconBefore && <Icon name={icon} className="ml-2" />}
      </>
    )
  }

  if (asLink) {
    return (
      <Link className={buttonClasses} to={url}>
        {content}
      </Link>
    )
  }

  if (url) {
    return (
      <a href={url} className={buttonClasses}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={buttonClasses}>
      {content}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  type: PropTypes.oneOf(["primary", "link"]),
  asLink: PropTypes.bool,
  icon: PropTypes.string,
  iconBefore: PropTypes.bool,
}

Button.defaultProps = {
  url: null,
  type: "primary",
  asLink: false,
  icon: null,
  iconBefore: false,
}

export default Button
