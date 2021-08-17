import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { hostAddress, serverAddress } from "../data/env";

const Container = styled.div`
  position: absolute;
  top: 60px;
  left: 60px;
  width: 300px;
  height: min-content;
  padding: 20px;
  background-color: white;

  overflow-y: scroll;
`;

const Thumbnail = styled.img`
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  border: solid 3px black;

  &:hover {
    filter: brightness(90%);
  }
`;

export default function UserDrawingList({ drawings }) {
  return (
    <Container>
      <p>Your last 3 drawings!</p>
      <p>
        Click one of your images to try it out with some other random body
        parts!
      </p>
      {drawings
        ? drawings.map((pic) => {
            return (
              <a href={`${hostAddress}/monstermash?drawingID=${pic.sectionID}`}>
                <Thumbnail src={pic.imageString} alt="" />
              </a>
            );
          })
        : null}
    </Container>
  );
}
