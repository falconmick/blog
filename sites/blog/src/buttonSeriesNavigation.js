import React from 'react';
import { Link } from "gatsby";

const ButtonSeriesNavigation = () => {
  return (
    <nav>
      <br />
      <h3>Button Series Navigation</h3>
      <ul>
        <li><Link to="/blog/2022/03/how-to-make-a-button-intro/">Part 1 - Overview</Link></li>
        <li><Link to="/blog/2022/03/how-to-make-a-button-normalisation/">Part 2 - Normalisation</Link></li>
        <li><Link to="/blog/2022/03/how-to-make-a-button-styling/">Part 3 - Styling</Link></li>
        <li><Link to="/blog/2022/03/how-to-make-a-button-customisation/">Part 4 - Customisation</Link></li>
      </ul>
    </nav>
  )
};

export default ButtonSeriesNavigation;