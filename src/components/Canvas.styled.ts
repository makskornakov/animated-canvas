import styled from 'styled-components';

export const FpsSpan = styled.span<{ fps: number }>`
  position: absolute;
  top: 0.3rem;
  left: 0.4rem;
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
  width: 70vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
  outline: 1px solid white;
`;

export const CanvasElement = styled.canvas`
  width: 100%;
  height: 100%;
`;

export const SettingsContainer = styled.div`
  width: 100%;
  height: 15%;
  outline: 1px solid #f15025;
`;
