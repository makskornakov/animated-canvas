import { Coordinate, Grid } from './SpaceBackground';
import { Area, StarGridFull } from './render';

export function drawGrid(grid: Grid, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log('drawGrid');

  ctx.strokeStyle = 'lightgray';
  // reset dash
  ctx.setLineDash([]);

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
export function drawSurroundings(
  squares: Map<string, Area>,
  ctx: CanvasRenderingContext2D,
  cell: Coordinate,
) {
  squares.forEach((some) => {
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
}

export function drawBoom(ctx: CanvasRenderingContext2D, cell: Coordinate) {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.beginPath();
  ctx.arc(cell.x, cell.y, cell.size, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(255, 0, 0, 0.4)`;
  ctx.fill();
  ctx.closePath();
}

export function drawStars(
  starGridWithSize: StarGridFull[],
  ctx: CanvasRenderingContext2D,
  cell: Coordinate,
  grid: Grid,
) {
  starGridWithSize.forEach((point, i) => {
    // draw circle
    const { x, y, size } = point;
    const cords = grid[x][y];

    // random color from color array
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.font = `${cell.size / 1.5}px Helvetica, Arial, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(`✱`, cords.x, cords.y);

    ctx.setLineDash([cell.size / 4, cell.size / 4]);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cords.x, cords.y, (size.star + 1) * cell.size + cell.size / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // fill the min circle
    ctx.fillStyle = point.completed ? 'rgba(0, 255, 0, 0.25)' : 'rgba(255, 100, 0, 0.25)';
    ctx.beginPath();
    ctx.arc(cords.x, cords.y, size.star * cell.size + cell.size / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
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
