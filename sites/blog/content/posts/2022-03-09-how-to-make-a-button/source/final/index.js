import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import { CodeExample } from "../preview/codeExample";
import { convertToShadowStyle, ShadowRoot } from "../preview/shadowRoot";
const style = require("!!raw-loader!./index.css");

const finalCss = style.default.toString();

const FinalStyle = () => (
  <style>
    {convertToShadowStyle(finalCss)}
  </style>
);

const FinalComponent = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '-8px -8px 0', padding: '16px 0' }}>
    <button style={{ margin: '8px 8px 0' }} className="button-btn btn">&lt;button /&gt;</button>
    <a style={{ margin: '8px 8px 0' }} href="#" className="anchor-btn btn">&lt;a /&gt;</a>
    <a style={{ margin: '8px 8px 0' }} href="#" className="anchor-btn btn btn-green">&lt;a class="anchor-btn btn btn-green" /&gt;</a>
    <a style={{ margin: '8px 8px 0', '--btn-background-color': '#ff0021' }} href=""  className="anchor-btn btn">&lt;a style="--btn-background-color: #ff0021" /&gt;</a>
  </div>
);

const FinalPrism = () => (
  <CodeBlock className="css" preStyle={{ marginBottom: '0' }}>
    {finalCss}
  </CodeBlock>
);

const FinalDemo = ({ id }) => (
  <CodeExample id={id}>
    <FinalPrism />
    <ShadowRoot renderStyle={() => <FinalStyle />}>
      <FinalComponent />
    </ShadowRoot>
  </CodeExample>
);

export default FinalDemo;