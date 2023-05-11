import { useRef, useEffect, useCallback, useState } from 'react';
import { drawSpace } from './render';
import { drawGrid } from './draw';
import { BackCanvas, DevDiv } from './Back.styled';
import Link from 'next/link';

// * Settings
const displayGrid = false;
export const wallsExist = true;
export const displaySurroundings = false;
export const displayNextSize = false;
export const displayStarCore = true;
export const coreColor = 'rgba(255, 255, 255, 1)';
export const starAreaColor = 'rgba(0, 255, 255, 0.5)';
const netSize = 30; // * EX: 10 - small, 40 - medium, 100 - large
export const maxDistanceBetweenStars = 0; // * EX: -1 - overlap, 0 - touching, 1 - gap
export const growStep = 1; // * EX: 0.1 - precise, 0.5 - fast, 1 - very fast (cell size)

// * Types
export type Coordinate = {
  x: number;
  y: number;
  size: number;
};
export type Grid = Coordinate[][];

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const devDivRef = useRef<HTMLDivElement>(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    // const dpr = 1;
    const dpr = window.devicePixelRatio || 1;

    console.log('resize');
    const width = bounds.width * dpr;
    const height = bounds.height * dpr;

    canvas.width = width;
    canvas.height = height;

    // generate grid
    const grid = getGrid(netSize * dpr, width, height);
    setGrid(grid);
  }, []);

  useEffect(() => {
    resize();

    // window.addEventListener('resize', resize);
    // return () => {
    //   window.removeEventListener('resize', resize);
    // };
  }, [resize]);

  function render(grid: Grid | null) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (!grid) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (displayGrid)
      requestAnimationFrame(() => {
        drawGrid(grid, ctx);
      });
    requestAnimationFrame(() => {
      drawSpace(grid, ctx);
    });
  }

  useEffect(() => {
    render(grid);
  }, [grid]);

  const rerender = useCallback(() => {
    console.log('rerender');
    render(grid);
  }, [grid]);

  // ? Press r to rerender
  useEffect(() => {
    // add r key listener
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        rerender();
      }
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [rerender]);

  useEffect(() => {
    const devDiv = devDivRef.current;
    if (!devDiv) return;

    const mouseMoveHandler = (e: MouseEvent) => {
      const devDivBounds = devDiv.getBoundingClientRect();
      const devDivCenterX = devDivBounds.left + devDivBounds.width / 2;
      const devDivCenterY = devDivBounds.top + devDivBounds.height / 2;

      const devDivHeight = devDivBounds.height;
      const devDivWidth = devDivBounds.width;
      if (
        e.clientX > devDivCenterX - devDivWidth / 1.3 &&
        e.clientX < devDivCenterX + devDivWidth / 1.3 &&
        e.clientY > devDivCenterY - devDivHeight / 1.5 &&
        e.clientY < devDivCenterY + devDivHeight / 1.5
      ) {
        devDiv.style.right = '1em';
      } else {
        devDiv.style.right = '-9.5em';
      }
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <>
      <DevDiv ref={devDivRef}>
        <span>
          <button onClick={rerender}>Rerender</button> [R]
        </span>
        <Link href="/play">Play</Link>
        <label>Settings</label>
      </DevDiv>
      <BackCanvas ref={canvasRef} />
    </>
  );
}

// Define an array of available colors to choose from

function getGrid(cellSize: number, width: number, height: number) {
  const grid = [] as Grid;
  const squaresInWidth = Math.floor(width / cellSize);
  const squaresInHeight = Math.floor(height / cellSize);

  for (let i = 0; i < squaresInWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < squaresInHeight; j++) {
      grid[i][j] = {
        x: i * cellSize + cellSize / 2 + Math.floor((width - cellSize * squaresInWidth) / 2),
        y: j * cellSize + cellSize / 2 + Math.floor((height - cellSize * squaresInHeight) / 2),
        size: cellSize,
      };
    }
  }

  return grid;
}
