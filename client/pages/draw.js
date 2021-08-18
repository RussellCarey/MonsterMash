import React, {
  Fragment,
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import router, { useRouter } from "next/router";
import axios from "axios";
import Canvas from "../components/canvas";
import styled from "styled-components";

import ColorSwatches from "../components/ColorSwatches";

import { serverAddress, hostAddress } from "../data/env";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='70' height='70' patternTransform='scale(4) rotate(40)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(195,83.1%,16.3%,1)'/><path d='M-4.8 4.44L4 16.59 16.14 7.8M32 30.54l-13.23 7.07 7.06 13.23M-9 38.04l-3.81 14.5 14.5 3.81M65.22 4.44L74 16.59 86.15 7.8M61 38.04l-3.81 14.5 14.5 3.81'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(195,82.6%,38.2%,1)' fill='none'/><path d='M59.71 62.88v3h3M4.84 25.54L2.87 27.8l2.26 1.97m7.65 16.4l-2.21-2.03-2.03 2.21m29.26 7.13l.56 2.95 2.95-.55'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(42,100%,70%,1)' fill='none'/><path d='M58.98 27.57l-2.35-10.74-10.75 2.36M31.98-4.87l2.74 10.65 10.65-2.73M31.98 65.13l2.74 10.66 10.65-2.74'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(346,84%,60.8%,1)' fill='none'/><path d='M8.42 62.57l6.4 2.82 2.82-6.41m33.13-15.24l-4.86-5.03-5.03 4.86m-14-19.64l4.84-5.06-5.06-4.84'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(164,94.5%,43.1%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
`;

const CanvasContainer = styled.div`
  width: 100vw;
  height: min-content;
  padding: 30px;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const MessageWindow = styled.div`
  z-index: 100;
  position: absolute;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.h2`
  color: white;
`;

const Button = styled.button`
  width: max-content;
  height: 20px;

  border: solid 3px black;
  padding: 20px 30px;

  border-radius: 15px;

  color: white;
  background-color: rgb(20, 186, 254);

  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 50px;

  &:hover {
    cursor: pointer;
  }
`;

function Draw({ userData }) {
  const [color, setColor] = useState("black");
  const [brushWidth, setBrushWidth] = useState(4);
  const [sectionType, setSectionType] = useState();
  const [message, setMessage] = useState(true);
  const [loading, setLoading] = useState(false);

  const CanvasRef = useRef();

  const router = useRouter();

  useEffect(() => {
    getRandomSectionType();

    setTimeout(() => {
      setMessage(false);
    }, 3000);
  }, []);

  // CONVERT THE IMAGE TO AN PNG
  const getPNGString = async () => {
    const string = await CanvasRef.current.exportImage("png");
    return string;
  };

  const submitSectionToDatabase = async (
    imageString,
    sectionType,
    username
  ) => {
    const data = {
      imageString,
      submitDate: Date.now(),
      sectionType,
      username: userData.username,
      displayName: userData.displayName,
    };

    const req = await axios.post(`${serverAddress}/api/section/upload`, data);

    return req.data;
  };

  // Uploads the image to the database
  const submitImageToDatabase = async () => {
    setLoading(true);
    const imageString = await getPNGString();

    const submitID = await submitSectionToDatabase(
      imageString,
      sectionType,
      userData.username
    );

    // If there is problem just return to the home page //! Put error pag ehere
    if (submitID.status === "failed")
      return router.push({
        pathname: "/",
      });

    // If all is okay push to the next page to see the creation using the section ID recieved back.
    router.push({
      pathname: "/monstermash",
      query: { drawingID: submitID.data },
    });
  };

  const getRandomSectionType = () => {
    const randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber === 0) setSectionType("head");
    if (randomNumber === 1) setSectionType("body");
    if (randomNumber === 2) setSectionType("legs");
  };

  return (
    <Fragment>
      {message && (
        <MessageWindow>
          <Message>{`You are drawing the ${sectionType}! Make sure to connect the guide lines and draw away!`}</Message>
        </MessageWindow>
      )}
      {loading && (
        <MessageWindow>
          <Message>{`Submiting and loading your monster!`}</Message>
        </MessageWindow>
      )}
      <Container>
        <CanvasContainer>
          <Canvas
            strokeWidth={brushWidth}
            strokeColor={color}
            canvasRef={CanvasRef}
            sectionType={sectionType}
          />
          <ColorSwatches onHandleClick={setColor}>
            <Button onClick={submitImageToDatabase}>Submit Drawing</Button>
          </ColorSwatches>
        </CanvasContainer>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps({ res, req, params }) {
  const jwt = req.cookies.token;

  // Redirect the user back to the home page if there is no login
  if (!jwt) {
    res.setHeader("location", `${hostAddress}`);
    res.statusCode = 302;
    res.end();
  }

  let userData;

  try {
    // Send request with the token FROM the cookie in the auth header
    const req = await axios.request({
      method: "GET",
      url: `${serverAddress}/api/auth/twitter/isloggedin`,
      headers: {
        Authorization: jwt,
      },
    });

    // If we are not okay, redirect back to the home page or create an error page
    if (req.data.status !== "success") {
      userData = null;
      res.setHeader("location", `${hostAddress}`);
      res.statusCode = 302;
      res.end();
    }

    userData = req.data.data;
  } catch (error) {
    console.log(error);
  }

  // Return the user data we gathered to be used.
  return {
    props: {
      userData,
    },
  };
}

export default Draw;
