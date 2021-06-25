const redirects = require("./redirects.json");

exports.createPages = async ({ actions }) => {
  const { createRedirect } = actions;

  redirects.forEach((redirect) => {
    createRedirect({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
    });
  });
}
