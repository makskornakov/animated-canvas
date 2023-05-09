import styled from 'styled-components';

export const DevDiv = styled.div`
  position: absolute;
  width: 10em;
  top: 1em;
  gap: 0.5em;
  padding: 1em 0;
  right: -9.5em;
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1em;
  transition: right 0.4s ease-in-out;

  color: #090909;
  background: rgba(200, 200, 200, 0.8);

  a {
    color: blue;
    transition: color 0.2s;

    &:hover {
      color: red;
    }
  }

  button {
    margin: 0.5em;
    padding: 0.5em;
    font-size: 0.8em;
    border-radius: 0.5em;
    border: none;
    font-weight: 400;
    background: white;
    cursor: pointer;
    transition: background 0.3s ease-in-out;

    &:hover {
      background: #f15025;
    }

    &:active {
      transition-duration: 0.1s;
      background: #8bf125;
    }
  }
`;

export const BackCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;
