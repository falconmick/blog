const React = require("react");

const PostBodyComponents = [
  <script
    key="goat-counter"
    data-goatcounter="https://mcrook.goatcounter.com/count"
    async
    src="https://gc.zgo.at/count.js"
  />
]

exports.onRenderBody = ({
                          setPostBodyComponents
                        }, pluginOptions) => {
  setPostBodyComponents(PostBodyComponents)
}