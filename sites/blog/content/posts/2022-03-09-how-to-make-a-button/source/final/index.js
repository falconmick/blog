import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
const style = require("!!raw-loader!./index.css");

export const FinalStyle = () => (
  <style>
    {style.default.toString()}
  </style>
);

export const FinalComponent = () => (
  <div style={{ display: 'flex', marginLeft: '-8px', padding: '16px 0' }}>
    <button style={{ marginLeft: '8px' }} className="button-btn btn">&lt;button /&gt;</button>
    <a style={{ marginLeft: '8px' }} href="#" className="anchor-btn btn">&lt;a href /&gt;</a>
  </div>
);

export const FinalPrism = () => (
  <CodeBlock className="css" preStyle={{ marginBottom: '0' }}>
    {style.default.toString()}
  </CodeBlock>
);