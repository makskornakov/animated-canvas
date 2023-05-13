import styled from 'styled-components';
import Link from 'next/link';

export const LandingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export const CentralContainer = styled.div`
  /* outline: 1px solid red; */
  width: 80%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  border-bottom: 1.5px solid grey;

  div {
    /* outline: 1px solid blue; */
    width: 42%;
    height: 100%;
    padding-top: 2em;
    box-sizing: border-box;
    display: flex;
    gap: 1em;
    flex-direction: column;
    align-items: center;
  }
  p a {
    text-decoration: underline;
    color: #f15025;
    font-weight: 400;
    transition: color 0.3s;

    &:hover {
      color: inherit;
    }
  }
`;

export const CustomLink = styled(Link)<{ size?: string }>`
  font-size: ${(props) => props.size || '1rem'};
  text-decoration: none;
  color: inherit;
  padding: 0.5em 1em;
  border-radius: 0.25em;
  border: 1.5px solid #f15025;
  transition-property: background-color, color;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #f15025;
    color: #090909;
  }
`;

export const FooterContainer = styled.div`
  /* outline: 1px solid red; */
  width: 70%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;

  p {
    font-size: 0.9rem;
  }
  a {
    text-decoration: underline;
    color: inherit;
  }
`;
