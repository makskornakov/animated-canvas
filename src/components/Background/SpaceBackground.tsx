import { useRef, useEffect, useCallback, useState, SetStateAction } from 'react';
import { drawAll, drawSpace } from './render';
import { drawGrid } from './draw';
import { BackCanvas, DevDiv, SettingsSection } from './Back.styled';
import Link from 'next/link';

// * Settings
const drawSettings = {
  starAreaColor: 'rgba(0, 255, 255, 0.5)',
  displayStarCore: false,
  coreColor: 'rgba(255, 255, 255, 1)',
  displayNextSize: true,
  displaySurroundings: true,
  displayGrid: true,
};

export type DrawSettings = typeof drawSettings;

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
  const devDivRef = useRef<HTMLDivElement>(null);
  const devDiv2Ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [starMap, setStarMap] = useState<RenderedStarMap | null>(null);
  const [drawSettingsState, setDrawSettingsState] = useState<DrawSettings>(drawSettings);

  //* render settings
  const [netSize, setNetSize] = useState(30); // * EX: 10 - small, 40 - medium, 100 - large
  const [generationSettings, setGenerationSettings] = useState({
    maxDistanceBetweenStars: 0, // * EX: -1 - overlap, 0 - touching, 1 - gap
    growStep: 1, // * EX: 0.1 - precise, 0.5 - fast, 1 - very fast (cell size)
    wallsExist: true,
  });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGrid(null);
    setStarMap(null);
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
  }, [netSize]);

  useEffect(() => {
    resize();

    // window.addEventListener('resize', resize);
    // return () => {
    //   window.removeEventListener('resize', resize);
    // };
  }, [resize]);

  const render = useCallback(() => {
    if (!grid) return;
    setStarMap(null);
    const { wallsExist, growStep, maxDistanceBetweenStars } = generationSettings;
    const newStarMap = drawSpace(grid, wallsExist, growStep, maxDistanceBetweenStars);
    if (newStarMap) setStarMap(newStarMap);
  }, [grid, generationSettings]);

  const drawEverything = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (!starMap) return;
    if (!grid) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (drawSettingsState.displayGrid)
      requestAnimationFrame(() => {
        drawGrid(grid, ctx);
      });
    drawAll(ctx, grid, grid[0][0].size, starMap, drawSettingsState, generationSettings.growStep);
  }, [drawSettingsState, grid, starMap, generationSettings.growStep]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    drawEverything();
  }, [drawEverything]);

  const rerender = useCallback(() => {
    console.log('rerender');

    render();
  }, [render]);

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
    const devDiv2 = devDiv2Ref.current;
    if (!devDiv || !devDiv2) return;

    const mouseMoveHandler = (e: MouseEvent, div: HTMLDivElement, right: boolean = true) => {
      const devDivBounds = div.getBoundingClientRect();
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
        if (right) div.style.right = '1em';
        else div.style.left = '1em';
      } else {
        if (right) div.style.right = '-14.5em';
        else div.style.left = '-14.5em';
      }
    };
    const rightDivHandler = (e: MouseEvent) => {
      mouseMoveHandler(e, devDiv);
    };
    const leftDivHandler = (e: MouseEvent) => {
      mouseMoveHandler(e, devDiv2, false);
    };

    window.addEventListener('mousemove', rightDivHandler);
    window.addEventListener('mousemove', leftDivHandler);
    return () => {
      window.removeEventListener('mousemove', rightDivHandler);
      window.removeEventListener('mousemove', leftDivHandler);
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
      <DevDiv ref={devDiv2Ref} right={false}>
        <h3>Render Settings</h3>
        <h4
          style={{
            fontWeight: '400',
            color: '#f6ff00',
          }}
        >
          [Requires rerender]
        </h4>
        <span>
          <button onClick={render}>Rerender</button> [R]
        </span>
        <SettingsSection>
          <label>
            Net size: {netSize}
            {/* uses a lot of resources */}
            <h5 style={netSize < 10 ? { color: 'red' } : {}}>Smaller net is resource intensive</h5>
            <input
              type="range"
              min="1"
              step={1}
              max="100"
              value={netSize}
              onChange={(e) => {
                setNetSize(+e.target.value);
              }}
            />
          </label>
          <label>
            Max star distance: {generationSettings.maxDistanceBetweenStars}
            <h5>Negative - overlap | Positive - space</h5>
            <input
              type="range"
              min="-10"
              step={1}
              max="10"
              value={generationSettings.maxDistanceBetweenStars}
              onChange={(e) => {
                setGenerationSettings({
                  ...generationSettings,
                  maxDistanceBetweenStars: +e.target.value,
                });
              }}
            />
          </label>
          <label>
            Grow step: {generationSettings.growStep}
            <h5>Smaller step is more precise</h5>
            <h5 style={generationSettings.growStep < 0.5 ? { color: 'red' } : {}}>
              Smaller step is resource intensive
            </h5>
            <input
              type="range"
              min="0.1"
              step={0.01}
              max="5"
              value={generationSettings.growStep}
              onChange={(e) => {
                setGenerationSettings({
                  ...generationSettings,
                  growStep: +e.target.value,
                });
              }}
            />
          </label>
          <label>
            Walls exist:
            <input
              type="checkbox"
              checked={generationSettings.wallsExist}
              onChange={(e) => {
                setGenerationSettings({
                  ...generationSettings,
                  wallsExist: e.target.checked,
                });
              }}
            />
            <h5>Allow growing over the walls</h5>
          </label>
        </SettingsSection>
      </DevDiv>
      <DevDiv ref={devDivRef} right>
        {/* <Link href="/play">Play</Link> */}
        <h3>Visual Settings</h3>
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
