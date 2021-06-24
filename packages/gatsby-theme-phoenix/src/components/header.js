import React, { useState } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Icon from "./icon"

const Header = ({ siteName, menuLinks, socialLinks, mode, setMode }) => {
  const isDark = mode === "dark"
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header>
      <div className="bg-primary h-2" />
      <div className="container mx-auto px-4 md:px-0 py-2 md:py-6">
        <div className="flex-col md:flex md:flex-row justify-center md:justify-between">
          <div className="flex md:inline-block justify-between">
            <Link
              to="/"
              className="font-branding text-3xl md:text-5xl h-12 md:h-18 text-dark dark:text-white hover:text-primary hover:no-underline dark-hover:no-underline dark-hover:text-primary"
              aria-label={`${siteName}, Back to homepage`}
            >
              {siteName}
            </Link>

            <button
              type="button"
              className="dark:text-white hover:text-primary md:hidden"
              onClick={() => setNavOpen(!navOpen)}
              title="Toggle main navigation"
              aria-label="Toggle main navigation"
            >
              <Icon name={navOpen ? "x" : "menu"} />
            </button>
          </div>

          <nav className="flex justify-center mt-4 md:mt-0">
            <ul className="flex items-center">
              {socialLinks &&
                socialLinks.map(({ name, url, icon }) => (
                  <li key={name} className="ml-6">
                    <a
                      href={url}
                      className="text-dark hover:text-primary dark:text-white dark-hover:text-primary"
                      aria-label={`Follow on ${name}`}
                    >
                      <Icon name={icon} />
                      <span className="hidden">{name}</span>
                    </a>
                  </li>
                ))}

              <li className="ml-6">
                <a
                  href="/rss.xml"
                  className="text-dark hover:text-primary dark:text-white"
                  title="RSS feed"
                  aria-label="RSS feed"
                >
                  <Icon name="rss" />
                </a>
              </li>
              <li className="ml-6">
                <button
                  type="button"
                  title="Toggle dark/light mode"
                  aria-label="Toggle dark/light mode"
                  onClick={() => setMode(isDark ? "light" : "dark")}
                >
                  <Icon
                    name={isDark ? "sun" : "moon"}
                    color={isDark ? "white" : "black"}
                  />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {menuLinks && (
          <nav
            id="nav-main"
            className={`mt-4 md:flex animated ${navOpen ? "block" : "hidden"}`}
          >
            <ul className="md:flex justify-center w-full">
              {menuLinks.map(({ name, link }) => (
                <li key={name} className="mt-4 md:mr-7 md:mt-0">
                  <Link
                    to={link}
                    activeClassName="text-primary md:border-primary"
                    partiallyActive={link !== "/"}
                    title={`Go to ${name}`}
                    className="block uppercase text-dark text-center dark:text-white dark-hover:text-primary font-semibold hover:text-primary hover:no-underline dark-hover:no-underline md:border-b-8 border-transparent py-2 md:pb-3"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  siteName: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  menuLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ),
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
}

Header.defaultProps = {
  socialLinks: null,
  menuLinks: null,
}

export default Header
