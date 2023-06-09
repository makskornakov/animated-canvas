import styled, { css } from 'styled-components';

type FpsSpanProps = {
  fps: number;
};

export const FpsSpan = styled.span<FpsSpanProps>`
  position: absolute;
  top: 0.4rem;
  left: 0.5rem;
  font-size: 1rem;
  font-weight: 200;

  color: ${({ fps }) =>
    fps > 55 ? '#8bf125' : fps > 30 ? '#eef125' : fps > 15 ? '#f19225' : '#f12525'};

  & > span {
    color: lightgray;
    font-size: 0.6rem;
    vertical-align: top;
  }
`;

export const PageContainer = styled.div`
  /* outline: 1px solid red; */

  margin-top: 1em;
  width: 92vw;
  min-height: 500px;
  height: 80vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  box-sizing: border-box;

  & > div {
    /* outline: 1px solid blue; */

    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    display: flex;
  }

  & > div:nth-child(2) {
    width: 65%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    width: 85vw;
    margin-bottom: 1em;

    & > div:nth-child(2) {
      gap: 1.5em;
      width: 100%;
    }

    & > div:first-child {
      order: 1;
    }

    & > div:last-child {
      order: 2;
      margin-top: 1.5em;
    }
  }
`;

export const SideBar = styled.div`
  /* outline: 1px solid lime; */

  align-items: flex-start;
  justify-content: space-between !important;
  gap: 2em;

  width: 15%;

  @media (max-width: 1024px) {
    flex-direction: row !important;
    gap: 0;
    width: 100%;
    height: 170px !important;
  }
`;

export const DetailCard = styled.div`
  width: 100%;
  height: 48%;

  box-sizing: border-box;
  overflow-y: scroll;

  background-color: var(--platinum);
  border-radius: 0.5em;

  color: #090909;
  padding: 0.5em 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;

  & span {
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    width: 48%;
    height: 100%;
  }
`;

export const ConsoleContainer = styled.div`
  margin-top: 1em;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;

  & > span {
    /* outline: 1px solid red; */

    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > span:first-child {
      /* outline: 1px solid red; */
      width: 70%;
    }
  }
`;

export const Indicator = styled.span`
  /* outline: 1px solid blue; */

  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  text-align: center;
  font-size: 1.2rem;

  & > div {
    height: 0.65rem;
    aspect-ratio: 1/1;

    border-radius: 50%;
    background: lightgray;
  }
`;

export const CanvasContainer = styled.div`
  user-select: none;
  position: relative;
  width: 100%;
  height: 70%;
`;

const canvasStyles = css`
  width: 100%;
  height: 100%;
  border-radius: 0.5em;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    min-height: calc(100vw / 2);
  }
`;

export const CanvasElement = styled.canvas`
  /* background-color: black; */

  ${canvasStyles}
  border: 0.1em solid var(--timberwolf);
`;

export const CanvasOverlay = styled.canvas`
  /* background-color: red; */

  ${canvasStyles}
  position: absolute;
  top: 0;
  left: 0;
`;

export const SettingsContainer = styled.div`
  /* outline: 1px solid #f15025; */

  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1em;

  color: #090909;

  & > div {
    width: 48%;
    min-height: 120px;

    background-color: var(--platinum);
    border-radius: 0.5em;

    padding: 0.5em;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    gap: 0.5em;

    overflow-y: scroll;
    & > span {
      /* outline: 1px solid red; */

      font-size: 0.9rem;
      display: flex;
      align-items: center;
      max-width: 100%;

      gap: 0.5em;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;

    & > div {
      width: 100%;
      max-height: 120px;
    }
  }
`;
