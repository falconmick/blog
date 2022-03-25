import React from 'react';
import { CodeBlock } from "@michael/gatsby-theme-blog-core";
import useDarkModeContext from "@michael/gatsby-theme-phoenix/src/context/darkMode";
import { CodeExample } from "../../../../../src/codeExample";
import { convertToShadowStyle, ShadowRoot } from "../../../../../src/shadowRoot";
const style = require("!!raw-loader!./index.css");

const StepThreeCss = style.default.toString();

const StepThreeStyle = () => (
  <style>
    {convertToShadowStyle(StepThreeCss)}
  </style>
);

// I have to manually set color to support my theme's dark/light modes
const StepThreeComponent = ({ demoOne, demoTwo }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '-8px -8px 0', padding: '16px 0' }}>
      {demoOne && <a style={{ margin: '8px 8px 0' }} href="#" className="anchor-btn btn btn-green">&lt;a class="anchor-btn btn btn-green" /&gt;</a>}
      {demoTwo && <a style={{ margin: '8px 8px 0', '--btn-background-color': '#ff0021' }} href=""  className="anchor-btn btn">&lt;a style="--btn-background-color: #ff0021" /&gt;</a>}
    </div>
  );
}

const StepThreePrism = ({ code, className }) => (
  <CodeBlock className={className ?? 'css'} preStyle={{ marginBottom: '0' }}>
    {code ?? '// code missing'}
  </CodeBlock>
);

const StepThreeDemo = ({ code, className, demoOne, demoTwo }) => (
  <CodeExample>
    <StepThreePrism code={code} className={className} />
    <ShadowRoot renderStyle={() => <StepThreeStyle />}>
      <StepThreeComponent demoOne={demoOne} demoTwo={demoTwo} />
    </ShadowRoot>
  </CodeExample>
);

export default StepThreeDemo;