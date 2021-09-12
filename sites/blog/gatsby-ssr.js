const React = require("react");
const Gatsby = require("gatsby");

const HeadComponents = [
  <script
    key="lazy-ios-poly-js"
    async
    src={Gatsby.withPrefix("loading-attribute-polyfill.umd.js")}
  />,
  <script
    key="lazy-ios-poly-css"
    async
    src={Gatsby.withPrefix("loading-attribute-polyfill.css")}
  />,
];

const PostBodyComponents = [
  <script
    key="goat-counter"
    data-goatcounter="https://mcrook.goatcounter.com/count"
    async
    src="https://gc.zgo.at/count.js"
  />
];

exports.onRenderBody = ({
                          setHeadComponents,
                          setPostBodyComponents
                        }, pluginOptions) => {
  setHeadComponents(HeadComponents);
  setPostBodyComponents(PostBodyComponents);
}