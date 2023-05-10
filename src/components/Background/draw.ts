import { Grid } from './SpaceBackground';

export function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('drawGrid');

  ctx.strokeStyle = 'lightgray';

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!grid[i][j]) continue;
      const { size, x, y } = grid[i][j];
      ctx.lineWidth = 1;
      ctx.strokeRect(x - size / 2, y - size / 2, size, size);

      // ? draw a circle in the center of the cell
      // ctx.beginPath();
      // ctx.arc(x, y, size / 2.5, 0, 2 * Math.PI);
      // ctx.stroke();
      // ctx.closePath();

      ctx.font = `${size / 4.5}px Sans-Serif`;
      ctx.fillStyle = 'gray';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}, ${j}`, x, y);
    }
  }
}

interface Area {
  cords: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  cells: number;
}

type Point = {
  x: number;
  y: number;
};

export function drawSpace(grid: Grid, ctx: CanvasRenderingContext2D) {
  // 1. choose a random cell in the grid
  if (!grid.length) return;
  const x = Math.floor(Math.random() * grid.length);
  const y = Math.floor(Math.random() * grid[0].length);
  const cell = grid[x][y];

  // draw a circle in the center of the cell
  ctx.globalCompositeOperation = 'destination-over';
  ctx.beginPath();
  ctx.arc(cell.x, cell.y, cell.size, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(255, 0, 0, 0.4)`;
  ctx.fill();
  ctx.closePath();

  //? has one point that is opposite to the corner that the key is named
  const surroundings: { [key: string]: [Point, Point] | false } = {
    topLeft: x > 0 &&
      y > 0 && [
        {
          x: 0,
          y: 0,
        },
        {
          x: x - 1,
          y: y - 1,
        },
      ],
    topRight: x < grid.length - 1 &&
      y > 0 && [
        {
          x: x + 1,
          y: 0,
        },
        {
          x: grid.length - 1,
          y: y - 1,
        },
      ],
    bottomRight: x < grid.length - 1 &&
      y < grid[0].length - 1 && [
        {
          x: x + 1,
          y: y + 1,
        },
        {
          x: grid.length - 1,
          y: grid[0].length - 1,
        },
      ],
    bottomLeft: x > 0 &&
      y < grid[0].length - 1 && [
        {
          x: 0,
          y: y + 1,
        },
        {
          x: x - 1,
          y: grid[0].length - 1,
        },
      ],
  };

  // generate coordinates from the surroundings
  // map with keys and values of cords+ cells
  const squares: Map<string, Area> = new Map();
  for (const key in surroundings) {
    if (!surroundings[key]) continue;
    const [p1, p2] = surroundings[key] as [Point, Point];
    squares.set(key, {
      cords: {
        x1: grid[p1.x][p1.y].x,
        y1: grid[p1.x][p1.y].y,
        x2: grid[p2.x][p2.y].x,
        y2: grid[p2.x][p2.y].y,
      },
      cells: (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1),
    });
  }

  const stars = new Map<string, number>();

  // in the middle of teach area write its area
  squares.forEach((some, key) => {
    if (!some) return;
    const quadrant = {
      x1: some.cords.x1 - cell.size / 2,
      x2: some.cords.x2 + cell.size / 2,
      y1: some.cords.y1 - cell.size / 2,
      y2: some.cords.y2 + cell.size / 2,
    };

    ctx.font = `${cell.size}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = `rgba(0, 255, 255, 0.6)`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(`${some.cells}`, (quadrant.x1 + quadrant.x2) / 2, (quadrant.y1 + quadrant.y2) / 2);
    const area = some.cells;
    const starsAmount = 0.3 * Math.sqrt(area);
    const starsNum = Math.round(starsAmount);
    stars.set(key, starsNum);
    // fill smaller text underneeth the are text
    ctx.fillStyle = `rgba(255, 150, 0, 0.7)`;

    ctx.font = `400 ${cell.size / 2}px Helvetica, Arial, sans-serif`;
    ctx.fillText(
      `${stars.get(key)} ★`,
      (quadrant.x1 + quadrant.x2) / 2,
      (quadrant.y1 + quadrant.y2) / 2 + cell.size / 2,
    );

    ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
    ctx.globalCompositeOperation = 'destination-over';

    ctx.fillRect(quadrant.x1, quadrant.y1, quadrant.x2 - quadrant.x1, quadrant.y2 - quadrant.y1);
    ctx.globalCompositeOperation = 'source-over';

    const colorsDots = ['lime', 'cyan', 'orange', 'hotpink'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colorsDots[i];
      const x = i % 2 ? some.cords.x2 : some.cords.x1;
      const y = i < 2 ? some.cords.y1 : some.cords.y2;
      ctx.beginPath();
      ctx.arc(x, y, cell.size / 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  });
  console.log(stars);
}

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
