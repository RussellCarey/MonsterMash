import React, { useState, useEffect, Fragment } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};

  overflow: hidden;

  outline: solid 3px black;
`;

const Marker = styled.div`
  z-index: 100;
  position: absolute;

  top: ${(props) => props.top || null};
  left: ${(props) => props.right || null};
  bottom: ${(props) => props.bottom || null};
  right: ${(props) => props.left || null};

  width: 0.5vw;
  height: 3vw;
  background-color: #eb282865;
  pointer-events: none;
`;

//https://www.npmjs.com/package/react-sketch-canvas
export default function Canvas({
  strokeColor,
  strokeWidth,
  canvasRef,
  sectionType,
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const markerPositions = {
    headleft: dimensions.width / 2.5 + "px",
    headRight: dimensions.width / 2.5 + "px",
    bodyLeft: dimensions.width / 3 + "px",
    bodyRight: dimensions.width / 3 + "px",
    bottom: "-5%",
    top: "-5%",
  };

  const setWindow = () => {
    const padding = window.innerWidth / 10;
    setDimensions({
      width: window.innerWidth - padding * 2,
      height: ((window.innerWidth - padding * 2) / 16) * 9,
    });
  };

  const undoLastAction = () => {
    canvasRef.current.undo();
  };

  const redoLastAction = () => {
    canvasRef.current.redo();
  };

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
  };

  const getTotalSketchingTime = async () => {
    const time = await canvasRef.current.getSketchingTime();
    console.log(time);
  };

  useEffect(() => {
    setWindow();

    window.addEventListener("resize", setWindow);
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") undoLastAction();
      if (e.key === "r") redoLastAction();
      if (e.key === "c") clearCanvas();
      if (e.key === "t") getTotalSketchingTime();
    });
  }, []);

  const styles = {
    borderRadius: "5px",
    width: dimensions.width,
    height: dimensions.height,
    justifySelf: "center",
  };

  return (
    <Container width={dimensions.width} height={dimensions.height}>
      <ReactSketchCanvas
        ref={canvasRef}
        style={styles}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        withTimestamp={true}
      />

      {sectionType === "head" && (
        <Fragment>
          <Marker
            bottom={markerPositions.bottom}
            left={markerPositions.headleft}
          />
          <Marker
            bottom={markerPositions.bottom}
            right={markerPositions.headRight}
          />
        </Fragment>
      )}

      {sectionType === "body" && (
        <Fragment>
          <Marker top={markerPositions.top} left={markerPositions.headleft} />
          <Marker top={markerPositions.top} right={markerPositions.headRight} />

          <Marker
            bottom={markerPositions.bottom}
            left={markerPositions.bodyLeft}
          />
          <Marker
            bottom={markerPositions.bottom}
            right={markerPositions.bodyRight}
          />
        </Fragment>
      )}

      {sectionType === "legs" && (
        <Fragment>
          <Marker top={markerPositions.top} left={markerPositions.bodyLeft} />
          <Marker top={markerPositions.top} right={markerPositions.bodyRight} />
        </Fragment>
      )}
    </Container>
  );
}
