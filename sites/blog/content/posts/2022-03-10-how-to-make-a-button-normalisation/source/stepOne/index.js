import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import useDarkModeContext from "@michael/gatsby-theme-phoenix/src/context/darkMode";
import { CodeExample } from "../../../../../src/codeExample";
import { convertToShadowStyle, ShadowRoot } from "../../../../../src/shadowRoot";
// eslint-disable-next-line import/no-webpack-loader-syntax
const style = require("!!raw-loader!./index.css");

const stepOneCss = style.default.toString();

const StepOneStyle = () => (
  <style>
    {convertToShadowStyle(stepOneCss)}
  </style>
);

// I have to manually set color to support my theme's dark/light modes
const StepOneComponent = () => {
  const { isDark } = useDarkModeContext();
  const color = isDark ? 'white' : 'black';

  return (
    <div style={{ padding: '16px 0', '--btn-color': color }}>
      <button className="button-btn btn">&lt;button /&gt;</button>
      <span style={{ color }}>&lt;span /&gt;</span>
      <a href="?click" onClick={(e) => e.preventDefault()} className="anchor-btn btn">&lt;a /&gt;</a>
    </div>
  );
}

const StepOnePrism = () => (
  <CodeBlock className="css" preStyle={{ marginBottom: '0' }}>
    {stepOneCss}
  </CodeBlock>
);

const StepOneDemo = () => (
  <CodeExample>
    <StepOnePrism />
    <ShadowRoot renderStyle={() => <StepOneStyle />}>
      <StepOneComponent />
    </ShadowRoot>
  </CodeExample>
);

export default StepOneDemo;