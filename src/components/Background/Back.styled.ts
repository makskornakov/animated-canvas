import styled from 'styled-components';

export const DevDiv = styled.div<{ right: boolean }>`
  position: absolute;
  width: 15em;
  top: 2em;
  /* height:  */
  gap: 0.75em;
  padding: 1em 0;
  /* if right => right: -14.5em else left: -14.5em */
  right: ${({ right }) => (right ? '-14.5em' : 'unset')};
  left: ${({ right }) => (!right ? '-14.5em' : 'unset')};
  box-sizing: border-box;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* if right => border-left else border-right */
  border-right: ${({ right }) => (!right ? '0.5em solid rgba(139, 241, 37, 0.7)' : 'none')};
  border-left: ${({ right }) => (right ? '0.5em solid rgba(139, 241, 37, 0.7)' : 'none')};
  /* border-left: 0.5em solid rgba(139, 241, 37, 0.7); */
  justify-content: center;
  border-radius: 1em;
  transition: ${({ right }) => (right ? 'right' : 'left')} 0.4s ease-in-out;

  color: #090909;
  background: rgba(200, 200, 200, 0.92);

  a {
    padding: 0;
    margin: 0;
    font-weight: 400;
    color: #090909;
    transition: color 0.2s;

    &:hover {
      color: red;
    }
  }
  > span {
    font-size: 0.8em;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75em;
  }

  button {
    padding: 0.5em;
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

export const SettingsSection = styled.div`
  width: 90%;
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;

  label {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 0.9rem;
    column-gap: 0.75em;
    row-gap: 0.25em;
    width: 100%;
  }
  h5 {
    width: 100%;
    text-align: left;
  }
  /* type text */
  input[type='text'] {
    width: 90%;
    outline: none;
    border: 1px solid grey;
    border-radius: 0.25em;
    padding: 0.25em;
  }
  /* type range */
  input[type='range'] {
    width: 100%;
  }
`;

export const BackCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;
