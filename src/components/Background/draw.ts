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
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
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

  const firstQuadrant = x > 0 &&
    y > 0 && {
      x1: grid[0][0].x,
      y1: grid[0][0].y,
      x2: grid[x - 1][y - 1].x,
      y2: grid[x - 1][y - 1].y,
    };

  const area1 = x * y;
  console.log('area 1', area1);

  const secondQuadrant = x < grid.length - 1 &&
    y > 0 && {
      x1: grid[x + 1][0].x,
      y1: grid[x + 1][0].y,
      x2: grid[grid.length - 1][y - 1].x,
      y2: grid[grid.length - 1][y - 1].y,
    };
  const area2 = (grid.length - x - 1) * y;
  console.log('area 2', area2);

  const thirdQuadrant = x < grid.length - 1 &&
    y < grid[0].length - 1 && {
      x1: grid[x + 1][y + 1].x,
      y1: grid[x + 1][y + 1].y,
      x2: grid[grid.length - 1][grid[0].length - 1].x,
      y2: grid[grid.length - 1][grid[0].length - 1].y,
    };

  const area3 = (grid.length - x - 1) * (grid[0].length - y - 1);
  console.log('area 3', area3);

  const fourthQuadrant = x > 0 &&
    y < grid[0].length - 1 && {
      x1: grid[0][y + 1].x,
      y1: grid[0][y + 1].y,
      x2: grid[x - 1][grid[0].length - 1].x,
      y2: grid[x - 1][grid[0].length - 1].y,
    };

  const area4 = x * (grid[0].length - y - 1);
  console.log('area 4', area4);

  const quadrants: Area[] = [
    firstQuadrant as Area,
    secondQuadrant as Area,
    thirdQuadrant as Area,
    fourthQuadrant as Area,
  ];

  // const areas = nmap with increimenting numbers
  const areas = new Map<number, number>();
  areas.set(1, area1);
  areas.set(2, area2);
  areas.set(3, area3);
  areas.set(4, area4);
  const stars = new Map<number, number>();

  // in the middle of teach area write its area
  quadrants.forEach((some, i) => {
    if (!some) return;
    const quadrant = {
      x1: some.x1 - cell.size / 2,
      x2: some.x2 + cell.size / 2,
      y1: some.y1 - cell.size / 2,
      y2: some.y2 + cell.size / 2,
    };

    ctx.font = `${cell.size}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = `rgba(0, 255, 255, 0.6)`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${areas.get(i + 1)}`,
      (quadrant.x1 + quadrant.x2) / 2,
      (quadrant.y1 + quadrant.y2) / 2,
    );
    const starsNum = Math.round(Math.sqrt((areas.get(i + 1) as number) / 4));
    stars.set(i + 1, starsNum);
    // fill smaller text underneeth the are text
    ctx.fillStyle = `rgba(255, 150, 0, 0.7)`;

    ctx.font = `400 ${cell.size / 2}px Helvetica, Arial, sans-serif`;
    ctx.fillText(
      `${stars.get(i + 1)} ★`,
      (quadrant.x1 + quadrant.x2) / 2,
      (quadrant.y1 + quadrant.y2) / 2 + cell.size / 1.4,
    );

    ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
    ctx.globalCompositeOperation = 'destination-over';

    ctx.fillRect(quadrant.x1, quadrant.y1, quadrant.x2 - quadrant.x1, quadrant.y2 - quadrant.y1);
    ctx.globalCompositeOperation = 'source-over';

    const colorsDots = ['lime', 'cyan', 'orange', 'hotpink'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colorsDots[i];
      const x = i % 2 ? some.x2 : some.x1;
      const y = i < 2 ? some.y1 : some.y2;
      ctx.beginPath();
      ctx.arc(x, y, cell.size / 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
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
