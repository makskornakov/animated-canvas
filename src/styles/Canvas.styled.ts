import styled from 'styled-components';

export const FpsSpan = styled.span<{ fps: number }>`
  position: absolute;
  top: 0.4rem;
  left: 0.5rem;
  font-size: 1rem;
  font-weight: 200;

  color: ${({ fps }) =>
    fps > 55 ? '#8bf125' : fps > 30 ? '#eef125' : fps > 15 ? '#f19225' : '#f12525'};

  span {
    color: lightgray;
    font-size: 0.6rem;
    vertical-align: top;
  }
`;

export const PageContainer = styled.div`
  /* outline: 1px solid red; */

  margin-top: 1em;
  width: 92vw;
  height: 85vh;
  min-height: 400px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > div {
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    display: flex;
  }

  & > div:nth-child(2) {
    width: 65%;
    height: 100%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    width: 85vw;
    margin-bottom: 1em;

    & > div:nth-child(2) {
      width: 100%;
      height: 90vh;
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
  /* outline: 1px solid blue; */

  align-items: flex-start;
  justify-content: space-between !important;
  gap: 2em;

  width: 15%;
  height: 92%;

  @media (max-width: 1024px) {
    flex-direction: row !important;
    gap: 0;
    width: 100%;
    height: 20vh;
  }
`;

export const DetailCard = styled.div`
  width: 100%;
  height: 48%;

  background-color: var(--platinum);
  border-radius: 0.5em;

  @media (max-width: 1024px) {
    width: 48%;
    height: 100%;
  }
`;

export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 73%;
`;

export const CanvasElement = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: black;
  border-radius: 0.5em;
  box-sizing: border-box;
  border: 0.1em solid var(--timberwolf);
`;

export const SettingsContainer = styled.div`
  /* outline: 1px solid #f15025; */

  width: 100%;
  height: 15%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & > div {
    width: 48%;
    height: 100%;
    background-color: var(--platinum);
    border-radius: 0.5em;
  }
`;
