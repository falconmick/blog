import styled from "styled-components";

export const Gallery = styled.div`
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