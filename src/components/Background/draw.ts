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
      ctx.fillStyle = 'lightgray';
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

interface Star {
  x: number;
  y: number;
  color: string;
  size?: number;
}

export function drawSpace(grid: Grid, ctx: CanvasRenderingContext2D) {
  // 1. choose a random cell in the grid
  if (!grid.length) return;
  const boomX = Math.floor(Math.random() * grid.length);
  const boomY = Math.floor(Math.random() * grid[0].length);
  const cell = grid[boomX][boomY];

  // draw a circle in the center of the cell
  ctx.globalCompositeOperation = 'destination-over';
  ctx.beginPath();
  ctx.arc(cell.x, cell.y, cell.size, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(255, 0, 0, 0.4)`;
  ctx.fill();
  ctx.closePath();

  //? has one point that is opposite to the corner that the key is named
  const surroundings: { [key: string]: [Point, Point] | false } = {
    topLeft: boomX > 0 &&
      boomY > 0 && [
        {
          x: 0,
          y: 0,
        },
        {
          x: boomX - 1,
          y: boomY - 1,
        },
      ],
    topRight: boomX < grid.length - 1 &&
      boomY > 0 && [
        {
          x: boomX + 1,
          y: 0,
        },
        {
          x: grid.length - 1,
          y: boomY - 1,
        },
      ],
    bottomRight: boomX < grid.length - 1 &&
      boomY < grid[0].length - 1 && [
        {
          x: boomX + 1,
          y: boomY + 1,
        },
        {
          x: grid.length - 1,
          y: grid[0].length - 1,
        },
      ],
    bottomLeft: boomX > 0 &&
      boomY < grid[0].length - 1 && [
        {
          x: 0,
          y: boomY + 1,
        },
        {
          x: boomX - 1,
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

    ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
    ctx.globalCompositeOperation = 'destination-over';

    ctx.fillRect(quadrant.x1, quadrant.y1, quadrant.x2 - quadrant.x1, quadrant.y2 - quadrant.y1);
    ctx.globalCompositeOperation = 'source-over';

    const symbols = ['┌', '┐', '└', '┘'];
    ctx.fillStyle = 'lime';

    for (let i = 0; i < 4; i++) {
      const x = i % 2 ? some.cords.x2 : some.cords.x1;
      const y = i < 2 ? some.cords.y1 : some.cords.y2;

      ctx.font = ` ${cell.size / 1.5}px Helvetica, Arial, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const fontX = x + (i % 2 ? cell.size / 2.5 : -cell.size / 2.5);
      const fontY = y + (i < 2 ? -cell.size / 2.5 : cell.size / 2.5);

      ctx.fillText(symbols[i], fontX, fontY);
    }
  });
  console.log(stars);
  console.log(squares);

  // for each star generate amount of stars in the relevant square

  const starGridCords = new Map<string, Point[]>();

  stars.forEach((amount, key) => {
    const quadrant = surroundings[key];
    if (!quadrant) return;
    const xRange = Math.abs(quadrant[0].x - quadrant[1].x);
    const yRange = Math.abs(quadrant[0].y - quadrant[1].y);
    console.log('range', xRange, yRange);

    const x1 = Math.min(quadrant[0].x, quadrant[1].x);
    const y1 = Math.min(quadrant[0].y, quadrant[1].y);

    while (starGridCords.get(key)?.length !== amount) {
      const x = Math.floor(Math.random() * xRange + x1);
      const y = Math.floor(Math.random() * yRange + y1);
      const randomPoint = {
        x,
        y,
      } as Point;
      if (starGridCords.get(key)?.includes(randomPoint)) continue;
      starGridCords.set(key, [...(starGridCords.get(key) || []), randomPoint]);
    }
  });
  console.log(starGridCords);

  // generate coordinates for each star
  const starArray: Star[] = [];
  starGridCords.forEach((points, key) => {
    points.forEach((point) => {
      const { x, y } = point;
      const cords = grid[x][y];
      if (!cords) return;
      starArray.push({
        x: cords.x,
        y: cords.y,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    });
  });

  // for each point draw a star in the center of the x y cell
  ctx.globalCompositeOperation = 'destination-over';

  starArray.forEach((star) => {
    ctx.fillStyle = star.color;
    const { x, y } = star;
    // ✱
    ctx.font = `${cell.size / 1.5}px Helvetica, Arial, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(`✱`, x, y);
  });
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
