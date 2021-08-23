import Swatch from "./Swatch";
import styled from "styled-components";

const Container = styled.div`
  z-index: 1;
  position: relative;
  width: 250px;

  margin: 10px;

  background-color: white;
  border: solid 3px black;

  border-radius: 15px;

  overflow: hidden;

  &:hover > .hoverContainer {
    opacity: 100%;
  }
`;

const HoverContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 250px;
  height: 100%;
  background-color: #000000d6;

  display: flex;
  flex-direction: column;
  opacity: 0%;

  transition: all 0.5s;

  cursor: pointer;
`;

const NameThird = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: white;
`;

const Name = styled.div`
  background-color: white;
  border: solid 3px black;
  border-radius: 15px;
  color: black;
  font-weight: bold;
  padding: 20px;

  transition: all 0.2s;

  &:hover {
    transform: scale(110%);
    box-shadow: 0 10px 10px rgba(255, 255, 255, 0.05);
  }
`;

const Image = styled.img`
  width: 100%;
  padding: 20px;
  border-radius: 5px;
`;

const Text = styled.p``;

export default function CombinationCard(data) {
  return (
    <Container>
      <HoverContainer className={"hoverContainer"}>
        <NameThird>
          <a
            target="_blank"
            href={`http://twitter.com/${data.data.displayNames[0]}`}
          >
            <Name>@{data.data.displayNames[0]}</Name>
          </a>
        </NameThird>

        <NameThird>
          <a
            target="_blank"
            href={`http://twitter.com/${data.data.displayNames[1]}`}
          ></a>
          <Name>@{data.data.displayNames[0]}</Name>
        </NameThird>

        <NameThird>
          <a
            target="_blank"
            href={`http://twitter.com/${data.data.displayNames[2]}`}
          >
            <Name>@{data.data.displayNames[0]}</Name>
          </a>
        </NameThird>
      </HoverContainer>
      <Image
        src={`https://droppyspace.sgp1.digitaloceanspaces.com/${data.data.imageURL}`}
      />
    </Container>
  );
}
