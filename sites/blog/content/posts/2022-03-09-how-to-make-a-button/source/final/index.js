import React from 'react';
const style = require("!!raw-loader!./index.css")

export const FinalStyle = () => (
  <style>
    {style.default.toString()}
  </style>
);

export const FinalComponent = () => (
  <>
    <button className="button-btn btn">Click Me</button>
    <br />
    <a href="#" className="anchor-btn btn">Click Me</a>
  </>
)