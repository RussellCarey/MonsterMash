import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Swatch from "./Swatch";
import { colors } from "../data/colorPallette";

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

export default function ColorSwatches({ onHandleClick, children }) {
  return (
    <Container>
      {colors.map((col) => {
        return <Swatch key={col} color={col} onHandleClick={onHandleClick} />;
      })}

      {children}
    </Container>
  );
}
