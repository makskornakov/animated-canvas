import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-weight: 200;
  }

// root colors
  :root {
    --timberwolf: #CED0CE;
    --eerieBlack: #191919;
    --platinum: #E6E8E6;
    --coquelicot: #F15025;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'montserrat', sans-serif;
    background-color: #090909;
    color: #fff;
  }

  h1, h2, h3, h4, h5, h6 {
    user-select: none;
    text-align: center;
    margin: 0;
  }
  main {
    margin: 1em 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;
