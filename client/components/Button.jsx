import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.button`
  width: min-content;
  height: min-content;
  background-color: white;
  margin: 10px;
`;

export default function Button({ text, onHandleClick, data }) {
  return <Container onClick={() => onHandleClick(data)}>{text}</Container>;
}
