import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import { CodeExample } from "../preview/codeExample";
import { ShadowRoot } from "../preview/shadowRoot";
const style = require("!!raw-loader!./index.css");

const finalCss = style.default.toString();

const FinalStyle = () => (
  <style>
    {finalCss}
  </style>
);

const FinalComponent = () => (
  <div style={{ display: 'flex', marginLeft: '-8px', padding: '16px 0' }}>
    <button style={{ marginLeft: '8px' }} className="button-btn btn">&lt;button /&gt;</button>
    <a style={{ marginLeft: '8px' }} href="#" className="anchor-btn btn">&lt;a href /&gt;</a>
    <a style={{ marginLeft: '8px' }} href="#" className="anchor-btn btn btn-green">&lt;a href class="className" /&gt;</a>
    <a style={{ marginLeft: '8px', '--background-color': '#ff0021' }} href="#"  className="anchor-btn btn">&lt;a href style="--background-color: #ff0021" /&gt;</a>
  </div>
);

const FinalPrism = () => (
  <CodeBlock className="css" preStyle={{ marginBottom: '0' }}>
    {finalCss}
  </CodeBlock>
);

const FinalDemo = () => (
  <CodeExample>
    <FinalPrism />
    <ShadowRoot renderStyle={() => <FinalStyle />}>
      <FinalComponent />
    </ShadowRoot>
  </CodeExample>
);

export default FinalDemo;