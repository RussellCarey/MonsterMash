import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";

import { Cross } from "../components/styled/Main.styled";

const Container = styled.div`
  z-index: 200;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;

  background-color: #000000ad;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  position: relative;
  width: 500px;
  background-color: white;
  border: 3px solid black;
  border-radius: 15px;

  color: black;
  font-weight: bold;

  padding: 20px;
`;

export default function BrushSizes({ message, toggleState }) {
  const hideModal = () => {
    toggleState(false);
  };

  return (
    <Container>
      <Modal>
        {" "}
        <Cross
          top={"-15px"}
          right={"-15px"}
          position={"absolute"}
          onClick={hideModal}
        >
          X
        </Cross>
        {!message ? (
          <Fragment>
            {" "}
            <p>
              <u>Controls and tips: </u>
            </p>
            <p>
              You can choose your brush size and colors from the side panel. The
              small brush is for the OUTLINE and details and the big for some
              background color.
            </p>
            <p>
              Be careful on using color, your color may not match the other
              users sections!
            </p>
            <p>You can press Z to undo your last stroke and R to redo.</p>
            <p>
              Make sure to connect the light red markers on the canvas!
            </p>{" "}
          </Fragment>
        ) : (
          message
        )}
      </Modal>
    </Container>
  );
}
