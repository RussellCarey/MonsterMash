import axios from "axios";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='70' height='70' patternTransform='scale(4) rotate(40)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(195,83.1%,16.3%,1)'/><path d='M-4.8 4.44L4 16.59 16.14 7.8M32 30.54l-13.23 7.07 7.06 13.23M-9 38.04l-3.81 14.5 14.5 3.81M65.22 4.44L74 16.59 86.15 7.8M61 38.04l-3.81 14.5 14.5 3.81'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(195,82.6%,38.2%,1)' fill='none'/><path d='M59.71 62.88v3h3M4.84 25.54L2.87 27.8l2.26 1.97m7.65 16.4l-2.21-2.03-2.03 2.21m29.26 7.13l.56 2.95 2.95-.55'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(42,100%,70%,1)' fill='none'/><path d='M58.98 27.57l-2.35-10.74-10.75 2.36M31.98-4.87l2.74 10.65 10.65-2.73M31.98 65.13l2.74 10.66 10.65-2.74'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(346,84%,60.8%,1)' fill='none'/><path d='M8.42 62.57l6.4 2.82 2.82-6.41m33.13-15.24l-4.86-5.03-5.03 4.86m-14-19.64l4.84-5.06-5.06-4.84'  stroke-linejoin='round' stroke-linecap='round' stroke-width='5' stroke='hsla(164,94.5%,43.1%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Image = styled.img`
  width: 24vw;
  border-top: solid ${(props) => props.bt} black;
  border-right: solid ${(props) => props.br} black;
  border-bottom: solid ${(props) => props.bb} black;
  border-left: solid ${(props) => props.bl} black;
  ${(props) =>
    props.boxshadow === true
      ? `box-shadow: 0 15px 10px rgba(255, 255, 255, 0.1)`
      : null}
`;

const TextBox = styled.div`
  display: flex;
  align-items: center;
  padding: 30px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.3);
`;

const Button = styled.button`
  display: inline-block;
  width: max-content;
  height: 20px;

  border: solid 3px black;
  padding: 15px 20px;
  margin: 0 5px;

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

export default function Mash({ data }) {
  return (
    <Container>
      <ImageContainer>
        <Image
          src={data && data.head}
          bt={"3px"}
          br={"3px"}
          bl={"3px"}
          bb={"0px"}
        />
        <Image
          src={data && data.body}
          bt={"0px"}
          br={"3px"}
          bl={"3px"}
          bb={"0px"}
        />
        <Image
          src={data && data.legs}
          bt={"0px"}
          br={"3px"}
          bl={"3px"}
          bb={"3px"}
          boxshadow={true}
        />
      </ImageContainer>
      <TextBox>
        Wow, what creations! What inspiration! -- Head by{" "}
        <a
          target="_blank"
          href={`https://www.twitter.com/${data.headUsername}`}
        >
          <Button>@{data.headUsername}</Button>
        </a>
        body by{"  "}
        <a
          target="_blank"
          href={`https://www.twitter.com/${data.bodyUsername}`}
        >
          <Button>@{data.bodyUsername}</Button>
        </a>
        and legs by{"  "}
        <a
          target="_blank"
          href={`https://www.twitter.com/${data.legsUsername}`}
        >
          <Button>@{data.legsUsername}</Button>
        </a>
      </TextBox>
    </Container>
  );
}

export async function getServerSideProps({ res, req, query }) {
  let fullImage;
  let imageData;

  // Util functions to get random images
  const getTypeImage = async (data, type) => {
    if (data.sectionType !== type || !data) {
      const req = await axios.get(
        `http://localhost:2222/api/section/get/${type}`
      );
      return req.data.data;
    } else {
      return data;
    }
  };

  // Check if we have a query - if we do we need to get that drawing from the DB
  if (Object.keys(query).length > 0) {
    const res = await axios.get(
      `http://localhost:2222/api/section/get/section/${query.drawingID}`
    );

    if (res.data.status === "failed" || res === null)
      return {
        props: {
          data: null,
        },
      };

    imageData = res.data.data;
  }

  const headSectionData = await getTypeImage(imageData, "head");
  const bodySectionData = await getTypeImage(imageData, "body");
  const legsSectionData = await getTypeImage(imageData, "legs");

  fullImage = {
    head: headSectionData.imageString,
    body: bodySectionData.imageString,
    legs: legsSectionData.imageString,
    headID: headSectionData.sectionID,
    bodyID: bodySectionData.sectionID,
    legsID: legsSectionData.sectionID,
    headUsername: headSectionData.username,
    bodyUsername: bodySectionData.username,
    legsUsername: legsSectionData.username,
  };

  // If we have a query - upload 3 parts of the image to the DB to check if it exists and to save / publish to twitter
  //! Add some message incase it fails..
  if (Object.keys(query).length > 0) {
    const imageUpload = await axios.post(
      `http://localhost:2222/api/section//get/combineSections`,
      fullImage
    );
  }

  // Return the user data we gathered to be used.
  return {
    props: {
      data: fullImage,
    },
  };
}
