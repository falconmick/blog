import React from "react"
import icons from "../images/icons.svg"

const Icon = ({ name, color = `currentColor`, size = 24, ...restProps }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...restProps}
  >
    <use xlinkHref={`${icons}#${name}`} />
  </svg>
);

export default Icon;
