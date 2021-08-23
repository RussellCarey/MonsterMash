import styled from "styled-components";

export const Cross = styled.div`
  z-index: 100;
  position: ${(props) => props.position};
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 3px solid black;

  top: ${(props) => props.top};
  right: ${(props) => props.right};
  left: ${(props) => props.left};

  color: black;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    background-color: #d9e6ee;
  }
`;
