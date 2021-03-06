import React, { useState, Fragment } from "react";
import { hostAddress, serverAddress } from "../data/env";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import UserDrawingList from "./UserDrawingList";

const Container = styled.nav`
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 80px;
  background-color: white;

  padding: 0 50px;

  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.159);

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: solid 3px black;

  @media (max-width: 700px) {
    padding: 20px;
    height: min-content;
    flex-direction: column;
  }
`;

const Button = styled.button`
  width: max-content;
  height: 20px;

  border: solid 3px black;
  padding: 20px 30px;
  margin-left: 10px;

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

  @media (max-width: 700px) {
    margin-bottom: 10px;
  }
`;

const Name = styled.p`
  font-weight: bold;
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

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  margin-right: 30px;

  border: solid 3px black;
`;

const LogoArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  flex-direction: row;

  cursor: pointer;
`;

const ButtonsArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  flex-direction: row;

  cursor: pointer;

  @media (max-width: 700px) {
    height: min-content;
    flex-direction: column;
  }
`;

export default function Navbar({ children, userData, drawings }) {
  const [showUserImages, setShowUserImages] = useState(false);
  console.log(userData);
  const clickHandler = () => {
    setShowUserImages(!showUserImages);
  };

  return (
    <Container>
      {userData ? (
        <LogoArea>
          <ProfileImage onClick={clickHandler} src={userData.profileImage} />
          <Name>Hi {userData.displayName}!</Name>
        </LogoArea>
      ) : (
        <Text>Monster Mash</Text>
      )}

      {!userData ? (
        <a href={`${serverAddress}/api/auth/twitter`}>
          <Button>
            <Icon icon={faTwitter} />
            Login with twitter
          </Button>
        </a>
      ) : (
        <ButtonsArea>
          <a href={`${hostAddress}/draw`}>
            <Button>Let's Draw!</Button>
          </a>
          <a href={`${hostAddress}/monstermash`}>
            <Button>View Random!</Button>
          </a>
          <a href={`${serverAddress}/api/auth/logout`}>
            <Button>
              <Icon icon={faTwitter} />
              Logout
            </Button>
          </a>
        </ButtonsArea>
      )}

      {showUserImages && <UserDrawingList drawings={drawings} />}
    </Container>
  );
}
