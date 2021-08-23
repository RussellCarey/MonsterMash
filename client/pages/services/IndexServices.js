import axios from "axios";
import { hostAddress, serverAddress } from "../../data/env";

export const checkLoggedIn = async (jwt) => {
  const req = await axios.request({
    method: "GET",
    url: `${serverAddress}/api/auth/twitter/isloggedin`,
    headers: {
      Authorization: jwt,
    },
  });

  return req.data.data;
};

export const getUsersImages = async (jwt, data) => {
  const req = await axios.request({
    method: "POST",
    url: `${serverAddress}/api/section/get/usersections`,
    data: {
      data: data.username,
    },
    headers: {
      Authorization: jwt,
    },
  });

  return req.data.data;
};

export const getRecentImages = async () => {
  try {
    const req = await axios.request({
      method: "POST",
      url: `${serverAddress}/api/section/get/recentUploads`,
    });

    return req.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const returnProps = (data, userData, images, recentImages) => {
  return {
    props: {
      data: data,
      userData: userData,
      images: images,
      recentImages: recentImages,
    },
  };
};
