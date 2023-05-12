import { useRef, useEffect, useCallback, useState, SetStateAction } from 'react';
import { drawAll, drawSpace } from './render';
import { drawGrid } from './draw';
import { BackCanvas, DevDiv, SettingsSection } from './Back.styled';
import Link from 'next/link';

// * Settings
const drawSettings = {
  starAreaColor: 'rgba(0, 255, 255, 0.5)',
  displayStarCore: true,
  coreColor: 'rgba(255, 255, 255, 1)',
  displayNextSize: false,
  displaySurroundings: false,
  displayGrid: false,
};

export type DrawSettings = typeof drawSettings;
export const wallsExist = true;

// const displayGrid = false;
const netSize = 30; // * EX: 10 - small, 40 - medium, 100 - large
export const maxDistanceBetweenStars = 0; // * EX: -1 - overlap, 0 - touching, 1 - gap
export const growStep = 1; // * EX: 0.1 - precise, 0.5 - fast, 1 - very fast (cell size)

// * Types
export interface Area {
  cords: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  cells: number;
}

export type Point = {
  x: number;
  y: number;
};
export interface StarGridFull extends Point {
  size: {
    wall: number;
    star: number;
  };
  completed: boolean;
}
export type RenderedStarMap = {
  starGridWithSize: StarGridFull[];
  squares: Map<string, Area>;
  boomX: number;
  boomY: number;
};
export type Surroundings = { [key: string]: [Point, Point] | false };

export type Coordinate = {
  x: number;
  y: number;
  size: number;
};
export type Grid = Coordinate[][];

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [starMap, setStarMap] = useState<RenderedStarMap | null>(null);
  const devDivRef = useRef<HTMLDivElement>(null);

  // for each key of drawSettings create a state
  const [drawSettingsState, setDrawSettingsState] = useState<DrawSettings>(drawSettings);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    // const dpr = 0.1;
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
    if (!grid) return;

    // requestAnimationFrame(() => {
    //   drawSpace(grid);
    // });
    const starMap = drawSpace(grid);
    if (starMap) setStarMap(starMap);
  }

  useEffect(() => {
    if (!grid) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (!starMap) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (drawSettingsState.displayGrid)
      requestAnimationFrame(() => {
        drawGrid(grid, ctx);
      });
    drawAll(ctx, grid, grid[0][0].size, starMap, drawSettingsState);
  }, [drawSettingsState, grid, starMap]);

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
      // check that no elements are in focus
      if (document.activeElement !== document.body) return;
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
        e.clientX > devDivCenterX - devDivWidth / 1.5 &&
        e.clientX < devDivCenterX + devDivWidth / 1.5 &&
        e.clientY > devDivCenterY - devDivHeight / 1.7 &&
        e.clientY < devDivCenterY + devDivHeight / 1.7
      ) {
        devDiv.style.right = '1em';
      } else {
        devDiv.style.right = '-14.5em';
      }
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DevDiv ref={devDivRef}>
        <span>
          <button onClick={rerender}>Rerender</button> [R]
        </span>
        <Link href="/play">Play</Link>
        <h3>Settings</h3>
        {renderedSettings(drawSettingsState, setDrawSettingsState)}
      </DevDiv>
      <BackCanvas ref={canvasRef} />
    </div>
  );
}

function renderedSettings(
  settingsState: DrawSettings,
  setSettingsState: React.Dispatch<React.SetStateAction<DrawSettings>>,
) {
  return (
    <SettingsSection>
      {Object.entries(settingsState).map(([key, value]) => {
        return (
          <label key={key}>
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}{' '}
            <input
              {...(typeof value === 'boolean'
                ? { checked: value }
                : {
                    value: value,
                  })}
              {...(typeof value === 'number' && {
                // min: setting.min || 0,
                // max: setting.max || 100,
                step: 0.1,
              })}
              type={
                typeof value === 'boolean'
                  ? 'checkbox'
                  : typeof value === 'number'
                  ? 'range'
                  : 'text'
              }
              onChange={(e) =>
                setSettingsState((prev) => {
                  return {
                    ...prev,
                    [key as keyof DrawSettings]:
                      typeof prev[key as keyof DrawSettings] === 'boolean'
                        ? e.target.checked
                        : typeof prev[key as keyof DrawSettings] === 'number'
                        ? e.target.valueAsNumber
                        : e.target.value,
                  };
                })
              }
            />
          </label>
        );
      })}
    </SettingsSection>
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
