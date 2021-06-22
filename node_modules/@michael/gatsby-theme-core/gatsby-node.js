const fs = require("fs")
const withDefaults = require(`./theme-options`)

exports.onPreBootstrap = ({ reporter }, themeOptions) => {
  const { imagesPath } = withDefaults(themeOptions)

  // Check if images directory exists.
  if (!fs.existsSync(imagesPath)) {
    reporter.warn(`The ${imagesPath} directory is missing. Creating it now...`)
    fs.mkdirSync(imagesPath, { recursive: true })
  }
}
