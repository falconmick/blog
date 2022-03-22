import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import { CodeExample } from "../preview/codeExample";
import { convertToShadowStyle, ShadowRoot } from "../preview/shadowRoot";
const style = require("!!raw-loader!./index.css");

const stepTwoCss = style.default.toString();

const StepTwoStyle = () => (
  <style>
    {convertToShadowStyle(stepTwoCss)}
  </style>
);

// I have to manually set color to support my theme's dark/light modes
const StepTwoComponent = () => {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '-8px -8px 0', padding: '16px 0' }}>
      <button style={{ margin: '8px 8px 0' }} className="button-btn btn">&lt;button /&gt;</button>
      <a style={{ margin: '8px 8px 0' }} href="" className="anchor-btn btn">&lt;a /&gt;</a>
    </div>
  );
}

const StepTwoPrism = () => (
  <CodeBlock className="css" preStyle={{ marginBottom: '0' }}>
    {stepTwoCss}
  </CodeBlock>
);

const StepTwoDemo = () => (
  <CodeExample>
    <StepTwoPrism />
    <ShadowRoot renderStyle={() => <StepTwoStyle />}>
      <StepTwoComponent />
    </ShadowRoot>
  </CodeExample>
);

export default StepTwoDemo;
