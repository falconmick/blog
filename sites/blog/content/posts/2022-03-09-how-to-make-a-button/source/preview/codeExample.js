import styled from "styled-components";

export const CodeExample = styled.section`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 2rem);
    height: 100%;
    margin-left: -1rem;
    margin-right: -1rem;
    border: 1px solid #333;
    pointer-events: none;
  }
`;