import axios from "axios";
import { serverAddress, hostAddress } from "../../data/env";
import { useRouter } from "next/dist/client/router";
import { returnProps } from "./IndexServices";

// CONVERT THE IMAGE TO AN PNG
export const getPNGString = async (CanvasRef) => {
  const string = await CanvasRef.current.exportImage("png");
  return string;
};

export const submitSectionToDatabase = async (
  imageString,
  sectionType,
  userData
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
export const submitImageToDatabase = async (
  userData,
  setLoading,
  CanvasRef,
  sectionType,
  router,
  setWarningMessage
) => {
  const totalUserDrawingTime = await CanvasRef.current.getSketchingTime();

  if (totalUserDrawingTime < 10000) {
    setWarningMessage(true);
    return;
  }

  setLoading(true);
  const imageString = await getPNGString(CanvasRef);

  const submitID = await submitSectionToDatabase(
    imageString,
    sectionType,
    userData
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

export const getRandomSectionType = (setSectionType) => {
  const randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber === 0) setSectionType("head");
  if (randomNumber === 1) setSectionType("body");
  if (randomNumber === 2) setSectionType("legs");
};

export const returnHome = (router) => {
  router.push({
    pathname: "/",
  });
};
