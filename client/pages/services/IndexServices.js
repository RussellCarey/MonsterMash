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

  return req;
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

  return req;
};

export const returnProps = (data, userData, images) => {
  return {
    props: {
      data: data,
      userData: userData,
      images: images,
    },
  };
};
