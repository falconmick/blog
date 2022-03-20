import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import { CodeExample } from "../preview/codeExample";
import { ShadowRoot } from "../preview/shadowRoot";
import useDarkModeContext from "@michael/gatsby-theme-phoenix/src/context/darkMode";
const style = require("!!raw-loader!./index.css");

const stepOneCss = style.default.toString();

const StepOneStyle = () => (
  <style>
    {stepOneCss}
  </style>
);

// I have to manually set color to support my theme's dark/light modes
const StepOneComponent = () => {
  const { isDark } = useDarkModeContext();
  const color = isDark ? 'white' : 'black';

  return (
    <div style={{ padding: '16px 0' }}>
      <button style={{ '--btn-color': color }} className="button-btn btn">&lt;button /&gt;</button>
      <span style={{ color }}>&lt;span /&gt;</span>
      <a style={{ '--btn-color': color }} href="" className="anchor-btn btn">&lt;a href /&gt;</a>
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