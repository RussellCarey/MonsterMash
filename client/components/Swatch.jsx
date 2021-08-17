import React, { useState, useEffect } from "react";
import styled from "styled-components";

import colorPallette from "../data/colorPallette";

const Container = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  border: none;
  outline: none;

  cursor: pointer;

  margin: 5px;
  background-color: ${(props) => props.color};
`;

export default function Swatches({ color, onHandleClick }) {
  return (
    <Container color={color} onClick={() => onHandleClick(color)}></Container>
  );
}
