import React from 'react';
import styled from "styled-components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { getAlt } from "./util.js"

const GalleryDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #66666650;
  padding: 1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  margin-bottom: 16px;
  
  .flex-1, & > *:not(.flex-2) {
    flex: 1 0 100px;
  }
  .flex-2 {
    flex: 2 0 200px;
  }
`;

export const Gallery = ({ localImages }) => (
  <GalleryDiv>
    {localImages.slice(0, 8).map((image, index) => {
      return image && image.extension === "svg" ? (
        <img
          key={`image-${index}`}
          style={{maxHeight: "120px"}}
          src={image.publicURL}
          alt={getAlt(index)}
        />
      ) : (
        <GatsbyImage
          key={`image-${index}`}
          imgStyle={{objectFit: "contain"}}
          style={{maxHeight: "120px", maxWidth: "default"}}
          image={getImage(image)}
          alt={getAlt(index)}
        />
      );
    })}
  </GalleryDiv>
)