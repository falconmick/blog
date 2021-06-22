import React from "react"

export const ComponentPlaceholder = props => {
  const matches = props.path.match(/(gatsby-theme-[\w\d-]*)\/src\/(.*)/)
  const path = `./src/${props.path.match(/@michael/) ? "@michael/" : ""}${
    matches[1]
  }/${matches[2]}`
  return (
    <div
      style={{
        width: "50%",
        margin: "2rem auto",
      }}
    >
      <h1>This is a placeholder component</h1>
      <p style={{ marginBottom: "2rem" }}>
        To implement this component in your site, create a file at: <br />{" "}
        <code
          style={{
            color: "white",
            background: "black",
            padding: "2px",
          }}
        >
          {path}
        </code>
      </p>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}
