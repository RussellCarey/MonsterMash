import React, { Fragment, useState, useEffect } from "react";
import styled from "styled-components";

import Navbar from "../components/Navbar";

import { checkLoggedIn, getUsersImages, returnProps, getRecentImages } from "./services/IndexServices";
import CombinationCard from "../components/CombinationCard";

const Container = styled.div`
  width: 100vw;
  height: max-content;
  min-height: 100vh;
  padding-top: ${(props) => props.mt};

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='70' height='70' patternTransform='scale(4) rotate(40)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(195,83.1%,16.3%,1)'/><path d='M-4.8 4.44L4 16.59 16.14 7.8M32 30.54l-13.23 7.07 7.06 13.23M-9 38.04l-3.81 14.5 14.5 3.81M65.22 4.44L74 16.59 86.15 7.8M61 38.04l-3.81 14.5 14.5 3.81'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(195,82.6%,38.2%,1)' fill='none'/><path d='M59.71 62.88v3h3M4.84 25.54L2.87 27.8l2.26 1.97m7.65 16.4l-2.21-2.03-2.03 2.21m29.26 7.13l.56 2.95 2.95-.55'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(42,100%,70%,1)' fill='none'/><path d='M58.98 27.57l-2.35-10.74-10.75 2.36M31.98-4.87l2.74 10.65 10.65-2.73M31.98 65.13l2.74 10.66 10.65-2.74'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(346,84%,60.8%,1)' fill='none'/><path d='M8.42 62.57l6.4 2.82 2.82-6.41m33.13-15.24l-4.86-5.03-5.03 4.86m-14-19.64l4.84-5.06-5.06-4.84'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(164,94.5%,43.1%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");

  @media (max-width: 700px) {
    padding-top: 260px;
  }
`;

const MainArea = styled.div`
  width: 100%;
  height: max-content;

  padding: 30px;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;
`;

const Subtitle = styled.h4`
  background-color: white;
  border: solid 3px black;
  border-radius: 15px;
  padding: 20px;
`;

const Text = styled.p`
  margin-bottom: 40px;
  line-height: 20px;
`;

function Home({ userData, images, recentImages }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (userData !== null) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Container mt={loggedIn ? "100px" : "100px"}>
      <Navbar userData={userData} drawings={images} />
      <Subtitle>Recent monster concoctions!</Subtitle>
      <MainArea>
        {recentImages &&
          recentImages.map((data) => {
            return <CombinationCard data={data} />;
          })}
      </MainArea>
    </Container>
  );
}

export async function getServerSideProps({ res, req, params }) {
  let userData;
  let images;
  let recentImages;

  // Get recent images on the DB
  recentImages = await getRecentImages();

  // Check if we have a JWT token saved
  const jwt = req.cookies.token;

  // If not only return the recent images and not the users information or images
  if (!jwt) return returnProps(null, null, null, recentImages);

  try {
    // Check we are logged in..
    const req = await checkLoggedIn(jwt);
    userData = req;

    // Get users last X amount of images to view
    images = await getUsersImages(jwt, userData);

    return {
      props: {
        userData: userData,
        images: images,
        recentImages: recentImages,
      },
    };
  } catch (error) {
    console.log(error);
    return returnProps(null, null, null, null);
  }
}

export default Home;
