import { useRef, useEffect, useCallback, useState } from 'react';
import { lighten } from 'polished';

//! PLAN
//* 1. Create a type that stores smart points from which points are generated no matter what screen size it is and close results when resizing
//* 2. SO once create randomness and smartly display it on the screen depending on the screen size
//* 3. Create a function that will generate a set of points depending on the screen size
//* 4. Create a function that will render a set of points on the screen
// ! Algorithm for calculating maximum points to be rendered in the most inefficient in terms of space usage way.

type Point = {
  x: number;
  y: number;
};

type Square = {
  color: string;
  size: number;
};

class SparseMatrix {
  public data: Record<string, Square> = {};

  set(point: Point, square: Square) {
    const key = `${point.x},${point.y}`;
    this.data[key] = square;
  }

  get(point: Point): Square | undefined {
    const key = `${point.x},${point.y}`;
    return this.data[key];
  }
}

type Coordinate = {
  x: number;
  y: number;
  size: number;
  color: string;
};

type Grid = Coordinate[][];

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [stars, setStars] = useState<SparseMatrix | null>(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    // const dpr = 1;
    const dpr = window.devicePixelRatio || 1;

    console.log('resize');
    // generate grid
    const width = bounds.width * dpr;
    const height = bounds.height * dpr;

    canvas.width = width;
    canvas.height = height;

    const netSize = 60;
    const grid = getGrid(netSize * dpr, width, height);
    setGrid(grid);
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderSpace(ctx);
  }, []);

  useEffect(() => {
    resize();

    // window.addEventListener('resize', resize);
    // return () => {
    //   window.removeEventListener('resize', resize);
    // };
  }, [resize]);

  // set random points in the grid
  useEffect(() => {
    // choose random point in the grid and set its color to green
    if (!grid) return;

    const islands = generateIslands(grid);

    setStars(islands);
  }, [grid]);

  // create set of points for star generation
  useEffect(() => {
    if (!grid) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('grid', grid);
    drawGrid(grid, ctx);
    if (!stars) return;

    drawStars(stars, ctx);
  }, [grid, stars]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        // backgroundColor: 'red',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

function generateIslands(grid: Grid): SparseMatrix {
  let stars = new SparseMatrix();
  const colorsArray = [] as string[];
  // generate large islands
  let largeIslands = 0;
  for (let i = 0; i < 10; i++) {
    // if we have 3 islands we stop

    // if (largeIslands === 3) break;

    // get random point in the grid
    const randomPoint = getRandomPoint(grid);
    const { row, col } = randomPoint;
    const { x, y } = grid[row][col];

    const randomColor = getRandomColor(colorsArray);
    const newStars = setNLevelNeighbors(3, grid, stars, row, col, randomColor);
    if (!newStars) continue;
    stars = newStars;
    largeIslands++;
    colorsArray.push(randomColor);
    stars.set({ x, y }, { color: randomColor, size: 10 });
  }

  return stars;
}

// Define an array of available colors to choose from
const colors = [
  '#FF6633',
  '#FF33FF',
  '#00B3E6',
  '#99FF99',
  '#CCFF1A',
  '#FF1A66',
  '#33FFCC',
  '#991AFF',
  '#1AB399',
  '#1AFF33',
  '#FF4D4D',
  '#6666FF',
];

// Define a function to generate a random color from the array, while keeping track of previously generated colors
function getRandomColor(prevColors: string[]): string {
  // Filter out previously generated colors from the array
  const availableColors = colors.filter((color) => !prevColors.includes(color));

  // If all colors have been generated, reset the list of previously generated colors
  if (availableColors.length === 0) {
    prevColors.length = 0;
    return getRandomColor(prevColors);
  }

  // Generate a random index and return the corresponding color
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomIndex];

  // Add the generated color to the list of previously generated colors
  prevColors.push(color);

  return color;
}

function getRandomPoint(grid: Grid): { row: number; col: number } {
  const row = Math.floor(Math.random() * grid.length);
  const col = Math.floor(Math.random() * grid[0].length);
  return { row, col };
}

function setNLevelNeighbors(
  num: number,
  grid: Grid,
  stars: SparseMatrix,
  row: number,
  col: number,
  randomColor: string,
): SparseMatrix | false {
  // const { color } = grid[row][col];
  // console.log('color', randomColor);

  let starsCopy = new SparseMatrix();
  starsCopy.data = { ...stars.data };
  for (let i = row - num; i <= row + num; i++) {
    if (i < 0 || i >= grid.length) continue;
    for (let j = col - num; j <= col + num; j++) {
      if (j < 0 || j >= grid[0].length) continue;
      if (i === row && j === col) continue;
      const { x, y } = grid[i][j];
      // if (stars.has({ x, y })) continue;
      const existing = starsCopy.get({ x, y });
      if (existing) {
        // break and return false
        return false;
      }
      // higher in the center
      const sizeLevel = Math.max(Math.abs(row - i), Math.abs(col - j));
      const size = num - sizeLevel + 1;

      starsCopy.set({ x, y }, { color: lighten(0.2, randomColor), size });
    }
  }
  return starsCopy;
}

function getGrid(cellSize: number, width: number, height: number) {
  const grid = [] as Grid;
  const squaresInWidth = Math.floor(width / cellSize);
  const squaresInHeight = Math.floor(height / cellSize);

  const xStart = Math.floor((width - cellSize * squaresInWidth) / 2);
  const yStart = Math.floor((height - cellSize * squaresInHeight) / 2);
  // fill grid with coordinates in the middle of the square
  for (let i = 0; i < squaresInWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < squaresInHeight; j++) {
      grid[i][j] = {
        x: i * cellSize + cellSize / 2 + xStart,
        y: j * cellSize + cellSize / 2 + yStart,
        size: cellSize,
        color: 'red',
      };
    }
  }

  return grid;
}

function drawStars(stars: SparseMatrix, ctx: CanvasRenderingContext2D) {
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('drawStars');
  // get distance between two first stars
  const firstStar = stars.data[Object.keys(stars.data)[0]];
  const secondStar = stars.data[Object.keys(stars.data)[1]];

  const [x1, y1] = Object.keys(stars.data)[0]
    .split(',')
    .map((n) => parseInt(n, 10));
  const [x2, y2] = Object.keys(stars.data)[1]
    .split(',')
    .map((n) => parseInt(n, 10));
  const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  console.log('distance', distance);
  // draw stars
  for (const key in stars.data) {
    // x and y are strings like '100,100'
    const square = stars.data[key];
    const { size, color } = square;
    const [x, y] = key.split(',').map((n) => parseInt(n, 10));
    // console.log('x, y', x, y);
    ctx.fillStyle = color;
    // draw circle
    ctx.beginPath();
    ctx.arc(x, y, (distance / 100) * size * 3, 0, 2 * Math.PI);
    // ctx.arc(x, y, (distance / 100) * 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('drawGrid');

  // draw grid
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const square = row[j];

      // console.log('point', square);
      // points is a string like '100,100'
      const { x, y } = square;
      // console.log('x, y', x, y);
      // const square = grid.get({ x, y });
      if (!square) continue;
      const { color, size } = square;
      ctx.strokeStyle = 'white';

      // fill rect with color 10% opacity
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.1;
      // ctx.fillRect(x - size / 2, y - size / 2, size, size);
      ctx.globalAlpha = 1;

      ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      // ctx.beginPath();
      // ctx.fillStyle = 'cyan';
      // draw dot on cords
      // ctx.arc(x, y, size / 20, 0, 2 * Math.PI);
      // ctx.fill();
    }
  }
}
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderSpace(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('renderSpace');

  // ctx.fillStyle = 'lightblue';
  // ctx.strokeStyle = 'red';

  const canvas = ctx.canvas;

  const bounds = canvas.getBoundingClientRect();
  // draw a net of 50x50 canvas pixels in the center of the screen of maximum size
  const netSize = 100;
  // const net = getNet(netSize, bounds.width, bounds.height);

  // const { squaresInWidth, squaresInHeight } = net;

  // const netWidth = Math.floor(canvas.width / squaresInWidth);
  // const netHeight = Math.floor(canvas.height / squaresInHeight);

  // const startX = Math.floor((canvas.width - netWidth * squaresInWidth) / 2);
  // const startY = Math.floor((canvas.height - netHeight * squaresInHeight) / 2);

  // for (let i = 0; i < squaresInWidth; i++) {
  //   for (let j = 0; j < squaresInHeight; j++) {
  //     const x = startX + i * netWidth;
  //     const y = startY + j * netHeight;

  //     ctx.strokeRect(x, y, netWidth, netHeight);

  //     // draw circle in the center of the square
  //     ctx.beginPath();
  //     ctx.arc(x + netWidth / 2, y + netHeight / 2, netWidth / 4, 0, 2 * Math.PI);
  //     ctx.fill();
  //   }
  // }
}
