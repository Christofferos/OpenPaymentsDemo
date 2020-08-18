import React from "react";
import spinner from "./spinner.gif";
import styled from "styled-components";

export default () => {
  return (
    <Container>
      <div className="text-center" style={{ width: "100px", margin: "auto", display: "flex" }}>
        Loading bank information...
      </div>
      <br></br>

      <img src={spinner} style={{ width: "100px", margin: "auto", display: "flex" }} alt="Loading..." />
    </Container>
  );
};

export const Container = styled.div`
  justify-content: center;
  align-items: center;
  padding: 30vh 0vh;
`;
