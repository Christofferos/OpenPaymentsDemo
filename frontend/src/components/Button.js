import styled from "styled-components";

export const ButtonContainer = styled.button`
  text-transform: capitalize;
  font-size: 1.4rem;
  background: transparent;
  border: 0.1rem solid var(--lightBlue);
  border-color: ${(props) => (props.cart ? "var(--mainYellow)" : "var(--lightBlue)")};
  color: ${(prop) => (prop.cart ? "var(--mainYellow)" : "var(--lightBlue)")};
  border-radius: 1rem;
  padding: 0.2rem 0.5rem 0.4rem 0.5rem;
  cursor: pointer;
  margin: 0.2rem 0.5rem 0.2rem 0;
  transition: all 0.5s ease-in-out;
  &:hover {
    background: ${(prop) => (prop.cart ? "var(--mainYellow)" : "var(--lightBlue)")};
    color: var(--mainBlue);
  }
  &:focus {
    outline: none;
  }
`;

export const ButtonContainerNav = styled.button`
  text-transform: capitalize;
  font-size: 1.4rem;
  background: transparent;
  border: 0.1rem solid var(--lightBlue);
  border-color: ${(props) => (props.cart ? "var(--secondaryYellow)" : "var(--mainYellow)")};
  color: ${(prop) => (prop.cart ? "var(--mainYellow)" : "var(--mainYellow)")};
  border-radius: 1rem;
  padding: 0.2rem 0.5rem 0.4rem 0.5rem;
  cursor: pointer;
  margin: 0.2rem 0.5rem 0.2rem 0;
  transition: all 0.5s ease-in-out;
  &:hover {
    background: ${(prop) => (prop.cart ? "var(--mainYellow)" : "transparent")};
    background: var(--secondaryYellow);
    color: var(--mainWhite);
    border-color: var(--mainWhite);
  }
  &:focus {
    outline: none;
  }
`;
