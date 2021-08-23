import React, {
  Fragment,
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import Canvas from "../components/canvas";
import { useRouter } from "next/dist/client/router";
import ColorSwatches from "../components/ColorSwatches";

// U  tilities
import { serverAddress, hostAddress } from "../data/env";
import { checkLoggedIn, returnProps } from "./services/IndexServices";

// Style components
import {
  Container,
  CanvasContainer,
  CanvasArea,
  MessageWindow,
  Message,
  Button,
  Toolbar,
  InfoButton,
} from "../components/styled/Draw.styled";

// Imported componenents
import { Cross } from "../components/styled/Main.styled";
import BrushSizes from "../components/brushSizes";
import InfoModal from "../components/InfoModal";

// Service functions
import {
  submitImageToDatabase,
  getRandomSectionType,
  returnHome,
} from "./services/DrawServices";

// Main
function Draw({ userData }) {
  const [color, setColor] = useState("black");
  const [brushWidth, setBrushWidth] = useState(4);
  const [sectionType, setSectionType] = useState();
  const [message, setMessage] = useState(true);
  const [infoMessage, setInfoMessage] = useState(true);
  const [warningMessage, setWarningMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const CanvasRef = useRef();
  const router = useRouter();

  useEffect(() => {
    getRandomSectionType(setSectionType);

    setTimeout(() => {
      setMessage(false);
    }, 3000);
  }, []);

  return (
    <Fragment>
      {message && (
        <MessageWindow>
          <Message>{`You are drawing the  ${sectionType} ...  Make sure to connect the red guide lines!`}</Message>
        </MessageWindow>
      )}

      {loading && (
        <MessageWindow>
          <Message>{`Submiting and loading your monster!`}</Message>
        </MessageWindow>
      )}

      {infoMessage && <InfoModal toggleState={setInfoMessage} />}

      {warningMessage && (
        <InfoModal
          toggleState={setWarningMessage}
          message={
            "Maybe spend a little more time drawing before you submit? ... Rome wasnt built in a day.. Or something.."
          }
        />
      )}

      <Container>
        <CanvasContainer>
          <CanvasArea>
            <Cross
              position={"absolute"}
              top={"-15px"}
              right={"-15px"}
              onClick={() => returnHome(router)}
            >
              X
            </Cross>
            <Cross
              position={"absolute"}
              top={"-15px"}
              right={"20px"}
              onClick={() => setInfoMessage(true)}
            >
              i
            </Cross>
            <Canvas
              strokeWidth={brushWidth}
              strokeColor={color}
              canvasRef={CanvasRef}
              sectionType={sectionType}
            />
          </CanvasArea>
          <Toolbar>
            <ColorSwatches
              onHandleClick={setColor}
              setBrushWidth={setBrushWidth}
            >
              <Button
                onClick={() =>
                  submitImageToDatabase(
                    userData,
                    setLoading,
                    CanvasRef,
                    sectionType,
                    router,
                    setWarningMessage
                  )
                }
              >
                Submit Drawing
              </Button>
            </ColorSwatches>
          </Toolbar>
        </CanvasContainer>
      </Container>
    </Fragment>
  );
}

export async function getServerSideProps({ res, req, params }) {
  let userData;

  // Redirect the user back to the home page if there is no login
  const jwt = req.cookies.token;
  if (!jwt) {
    res.setHeader("location", `${hostAddress}`);
    res.statusCode = 302;
    res.end();
  }

  try {
    // Send request with the token FROM the cookie in the auth header and get user data
    userData = await checkLoggedIn(jwt);

    // If we are not okay, redirect back to the home page or create an error page
    if (req.data.status !== "success") {
      res.setHeader("location", `${hostAddress}`);
      res.end();
    }

    // If all is okay return the user data to start drawing..
    return returnProps(null, userData, null, null);
  } catch (error) {
    return returnProps(null, userData, null, null);
  }
}

export default Draw;
