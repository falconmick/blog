import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import clsx from 'clsx';

const CodeBlock = ({ theme, children, className, preClassName, preStyle }) => {
  const language = className.replace(/language-/, "")
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={clsx(className, preClassName)} style={{ ...style, ...preStyle }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
};

export default CodeBlock;
