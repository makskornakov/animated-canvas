// import { growStep, maxDistanceBetweenStars, wallsExist } from './SpaceBackground';
import type { DrawSettings } from './SpacePlayground';
import { drawBoom, drawStars, drawSurroundings } from './draw';
import type { Grid, Surroundings, RenderedStarMap, Area, Point, StarGridFull } from './types';

export function getGrid(cellSize: number, width: number, height: number) {
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

function getSurroundings(grid: Grid, boomX: number, boomY: number): Surroundings {
  return {
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
}

export function generateSpace(
  grid: Grid,
  wallsExist: boolean,
  growStep: number,
  maxDistanceBetweenStars: number,
): RenderedStarMap | false {
  if (!grid.length) return false;
  console.log('render space');

  const boomX = Math.floor(Math.random() * grid.length);
  const boomY = Math.floor(Math.random() * grid[0].length);
  const cell = grid[boomX][boomY];

  const surroundings = getSurroundings(grid, boomX, boomY);
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
  squares.forEach((some, key) => {
    const area = some.cells;
    const starsAmount = 0.3 * Math.sqrt(area);
    const starsNum = Math.round(starsAmount);
    stars.set(key, starsNum);
  });

  // in the middle of teach area write its area

  // * Consoles
  // console.log(stars);
  // console.log(squares);

  const starGridCords = new Map<string, Point[]>();
  const MAX_ATTEMPTS = 100; // * Usually max attempts 2 is enough (amount of stars is controlled)

  stars.forEach((amount, key) => {
    const quadrant = surroundings[key];
    if (!quadrant || !amount) return;

    const xRange = Math.abs(quadrant[0].x - quadrant[1].x);
    const yRange = Math.abs(quadrant[0].y - quadrant[1].y);

    while (starGridCords.get(key)?.length !== amount) {
      let randomPoint: Point | null = null;
      let attempts = 0;
      do {
        const x = Math.floor(Math.random() * xRange + Math.min(quadrant[0].x, quadrant[1].x));
        const y = Math.floor(Math.random() * yRange + Math.min(quadrant[0].y, quadrant[1].y));
        const newPoint = { x, y };

        if (
          !starGridCords.get(key)?.some((point) => point.x === newPoint.x && point.y === newPoint.y)
        ) {
          randomPoint = newPoint;
        }

        attempts++;
      } while (attempts < MAX_ATTEMPTS && !randomPoint);

      if (randomPoint) {
        starGridCords.set(key, [...(starGridCords.get(key) || []), randomPoint]);
      } else {
        console.warn(`Could not generate a unique point after ${MAX_ATTEMPTS} attempts.`);
      }
    }
  });

  const starGridWithSize = Array.from(starGridCords.values())
    .flat()
    .map((point) => {
      return {
        ...point,
        size: {
          wall: 0,
          star: 0,
        },
        completed: false,
      };
    }) as StarGridFull[];

  // ? Set the Wall Distance
  starGridWithSize.forEach((point, i) => {
    const { x, y } = point;
    const xWall = Math.min(x, grid.length - x - 1);
    const yWall = Math.min(y, grid[0].length - y - 1);
    const minWall = Math.min(xWall, yWall);

    starGridWithSize[i].size.wall = minWall;
    if (minWall === 0 && wallsExist) starGridWithSize[i].completed = true;
  });

  // ? Set the Star Distance
  while (starGridWithSize.some((point) => !point.completed)) {
    starGridWithSize.forEach((point, i) => {
      if (point.completed) return;
      const { x, y } = point;

      const oneLarger = point.size.star + growStep;
      if (oneLarger > point.size.wall && wallsExist) {
        starGridWithSize[i].completed = true;
        // console.log(`don't hit the wall`);
        return;
      }

      let allowedToGrow = true;
      starGridWithSize.forEach((otherPoint, j) => {
        if (i === j) return;

        const { x: otherX, y: otherY } = otherPoint;

        const xLegDistance = Math.max(Math.abs(x - otherX), 0);
        const yLegDistance = Math.max(Math.abs(y - otherY), 0);
        const xyDistance = Math.sqrt(xLegDistance ** 2 + yLegDistance ** 2) - 1;
        const sizes = oneLarger + starGridWithSize[j].size.star;

        if (sizes > xyDistance - maxDistanceBetweenStars) {
          allowedToGrow = false;
        }
      });
      if (allowedToGrow) {
        starGridWithSize[i].size.star = oneLarger;
      } else if (!allowedToGrow) {
        starGridWithSize[i].completed = true;
      }
    });
  }
  return { starGridWithSize, squares, boomX, boomY };
}

export function drawAll(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  cellSize: number,
  starMap: RenderedStarMap,
  settings: DrawSettings,
  growStep: number,
) {
  console.log('draw space');

  const { starGridWithSize, squares, boomX, boomY } = starMap;
  const { displaySurroundings, starAreaColor, displayStarCore, coreColor, displayNextSize } =
    settings;

  const { x, y } = grid[boomX][boomY];
  if (displaySurroundings) drawBoom(ctx, x, y, cellSize);

  if (displaySurroundings) drawSurroundings(squares, ctx, cellSize);

  drawStars(starGridWithSize, ctx, cellSize, grid, growStep, settings);
}
