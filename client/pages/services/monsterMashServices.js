import axios from "axios";
import { hostAddress, serverAddress } from "../../data/env";

// Get a random type of image
export const getTypeImage = async (data, type) => {
  if (data.sectionType !== type || !data) {
    const req = await axios.get(`${serverAddress}/api/section/get/${type}`);
    return req.data.data;
  } else {
    return data;
  }
};

// Create an image object from the data
export const createFullImage = (head, body, legs) => {
  return {
    head: head.imageString,
    body: body.imageString,
    legs: legs.imageString,
    headID: head.sectionID,
    bodyID: body.sectionID,
    legsID: legs.sectionID,
    headUsername: head.username,
    bodyUsername: body.username,
    legsUsername: legs.username,
  };
};

// If we have a query - then start the process on the databse of checking for a unique 3 nad uplaoding it to twitter
export const createCombinationToTwitter = async (query, fullImage) => {
  if (Object.keys(query).length > 0) {
    const imageUpload = await axios.post(
      `http://localhost:2222/api/section/get/combineSections`,
      fullImage
    );
  }
};

// Get the users drawing string to show
export const getUsersDrawing = async (query, drawingID) => {
  if (Object.keys(query).length > 0) {
    const res = await axios.get(
      `http://localhost:2222/api/section/get/section/${query.drawingID}`
    );

    if (res.data.status === "failed" || res === null) {
      return res.data;
    }

    return res.data;
  }
};
