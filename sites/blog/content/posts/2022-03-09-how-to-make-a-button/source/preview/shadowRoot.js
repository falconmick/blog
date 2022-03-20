﻿import React from 'react';
const ReactShadowRoot = React.lazy(() => import('react-shadow-root'));

export const ShadowRoot = ({children, renderStyle}) => {
  const isSSR = typeof window === "undefined"

  return (
    <div className="shadow-root-container">
      {!isSSR && (
        <React.Suspense fallback={<>{children}</>}>
          <ReactShadowRoot delegatesFocus={true} mode="open">
            {renderStyle?.()}
            {children}
          </ReactShadowRoot>
        </React.Suspense>
      )}
    </div>
  );
};