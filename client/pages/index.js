import React, { Fragment, useState, useEffect } from "react";
import styled from "styled-components";

import Navbar from "../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import axios from "axios";

import { hostAddress, serverAddress } from "../data/env";

const Container = styled.div`
  padding-top: ${(props) => props.mt};

  width: 100vw;
  height: 100vh;

  overflow: hidden !important;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='70' height='70' patternTransform='scale(4) rotate(40)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(195,83.1%,16.3%,1)'/><path d='M-4.8 4.44L4 16.59 16.14 7.8M32 30.54l-13.23 7.07 7.06 13.23M-9 38.04l-3.81 14.5 14.5 3.81M65.22 4.44L74 16.59 86.15 7.8M61 38.04l-3.81 14.5 14.5 3.81'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(195,82.6%,38.2%,1)' fill='none'/><path d='M59.71 62.88v3h3M4.84 25.54L2.87 27.8l2.26 1.97m7.65 16.4l-2.21-2.03-2.03 2.21m29.26 7.13l.56 2.95 2.95-.55'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(42,100%,70%,1)' fill='none'/><path d='M58.98 27.57l-2.35-10.74-10.75 2.36M31.98-4.87l2.74 10.65 10.65-2.73M31.98 65.13l2.74 10.66 10.65-2.74'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(346,84%,60.8%,1)' fill='none'/><path d='M8.42 62.57l6.4 2.82 2.82-6.41m33.13-15.24l-4.86-5.03-5.03 4.86m-14-19.64l4.84-5.06-5.06-4.84'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(164,94.5%,43.1%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
`;

const MainArea = styled.div`
  width: 70%;
  height: 70%;

  background-color: white;
  border-radius: 15px;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;

  border: solid 3px black;
`;

const Section = styled.div`
  width: 100%;
  padding: 50px 100px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  text-align: center;
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

  margin-bottom: ${(props) => props.mb};

  &:hover {
    cursor: pointer;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: white;
  margin-right: 10px;
`;

const Text = styled.p`
  margin-bottom: 40px;
  line-height: 20px;
`;

function Home({ userData, images }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (userData !== null) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Container mt={loggedIn ? "40px" : 0}>
      {loggedIn && <Navbar userData={userData} drawings={images} />}

      <MainArea>
        <Section>
          <h1>Welcome to Monster Mash!</h1>
          <Text>
            Draw one section of a monster and join it with those that somone
            else has already created! If you dont want to draw then just be a
            guest and view other peopls randomly joined monster creations!
          </Text>
          <Text>
            Press you profile image on the top left to see your last 3 drawings.
            Click the drawings to randomly pair with with some more body parts!
          </Text>

          {!loggedIn ? (
            <a href={`${serverAddress}/api/auth/twitter`}>
              <Button mb={"10px"}>
                <Icon icon={faTwitter} />
                Login with twitter
              </Button>
            </a>
          ) : (
            <a href={`${hostAddress}/draw`}>
              <Button mb={"10px"}>Let's Draw!</Button>
            </a>
          )}

          <a href={`${hostAddress}/monstermash`}>
            <Button mb={"10px"}>View Random!</Button>
          </a>
        </Section>
      </MainArea>
    </Container>
  );
}

export async function getServerSideProps({ res, req, params }) {
  // If no cookie, then stop proceeding...
  if (!req.cookies.token) {
    return {
      props: {
        userData: null,
      },
    };
  }

  const jwt = req.cookies.token;

  let userData;
  let imagesReq;

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
    if (!req || req.data.status !== "success") {
      return {
        props: {
          userData: null,
        },
      };
    }

    userData = req.data.data;

    imagesReq = await axios.request({
      method: "POST",
      url: `${serverAddress}/api/section/get/usersections`,
      data: {
        data: userData.username,
      },
      headers: {
        Authorization: jwt,
      },
    });

    if (!imagesReq) {
      return {
        props: {
          userData: null,
        },
      };
    }

    return {
      props: {
        userData,
        images: imagesReq.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        userData: null,
        images: null,
      },
    };
  }
}

export default Home;
