import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Swatch from "./Swatch";
import { colors } from "../data/colorPallette";
import { Cross } from "../components/styled/Main.styled";

const Container = styled.div`
  width: max-content;
  height: min-content;

  padding: 20px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  background-color: white;
  border-radius: 10px;

  border: none;

  margin-top: 30px;
`;

export default function ColorSwatches({
  onHandleClick,
  children,
  setBrushWidth,
}) {
  const smallBrush = () => {
    console.log("small brush");
    setBrushWidth(3);
  };

  const bigBrush = () => {
    console.log("big brush");
    setBrushWidth(20);
  };

  return (
    <Container>
      <Cross position={"relative"} onClick={smallBrush}>
        S{" "}
      </Cross>
      <Cross position={"relative"} onClick={bigBrush}>
        L
      </Cross>
      {colors.map((col) => {
        return <Swatch key={col} color={col} onHandleClick={onHandleClick} />;
      })}

      {children}
    </Container>
  );
}
