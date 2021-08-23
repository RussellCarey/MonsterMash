import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  border: 3px solid black;
  outline: none;

  cursor: pointer;

  margin: 5px;
  background-color: ${(props) => props.color};

  &:hover {
    filter: brightness(90%);
  }
`;

export default function Swatches({ color, onHandleClick }) {
  return (
    <Container color={color} onClick={() => onHandleClick(color)}></Container>
  );
}
