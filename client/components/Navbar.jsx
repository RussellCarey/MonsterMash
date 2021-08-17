import React, { useState } from "react";
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

const Name = styled.p`
  font-weight: bold;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: white;
  margin-right: 10px;
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

export default function Navbar({ children, userData, drawings }) {
  const [showUserImages, setShowUserImages] = useState(false);

  const clickHandler = () => {
    setShowUserImages(!showUserImages);
  };

  return (
    <Container>
      <LogoArea>
        <ProfileImage onClick={clickHandler} src={userData.profileImage} />
        <Name>Hi {userData.displayName}!</Name>
      </LogoArea>
      <a href={`${serverAddress}/api/auth/logout`}>
        <Button>
          <Icon icon={faTwitter} />
          Logout
        </Button>
      </a>
      {showUserImages && <UserDrawingList drawings={drawings} />}
    </Container>
  );
}
