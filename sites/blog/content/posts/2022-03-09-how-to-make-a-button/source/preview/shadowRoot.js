import React from 'react';
const ReactShadowRoot = React.lazy(() => import('react-shadow-root'));

export const ShadowRoot = ({children, renderStyle}) => {
  const isSSR = typeof window === "undefined"

  return (
    <div className="shadow-root-container">
      {!isSSR && (
        <React.Suspense fallback={<>{children}</>}>
          <ReactShadowRoot delegatesFocus={true} mode="open">
            {renderStyle?.()}
            <div id="shadow-root"> {/* utilised to mimic :root */}
              {children}
            </div>
          </ReactShadowRoot>
        </React.Suspense>
      )}
    </div>
  );
};

// :root doesn't work inside of shadow dom, so I am creating a synthetic one via #shadow-root
export const convertToShadowStyle = (styleString) => styleString.replace(':root', '#shadow-root');