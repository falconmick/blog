import React from "react"

const Footer = ({ children }) => {
  return (
    <footer className="py-6">
      <div className="container mx-auto">{children}</div>
    </footer>
  )
}

export default Footer
