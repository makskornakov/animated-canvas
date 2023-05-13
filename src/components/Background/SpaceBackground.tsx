import { useRef, useEffect, useCallback, useState, useTransition } from 'react';
import { drawAll, generateSpace, getGrid } from './render';
import { drawGrid } from './draw';
import { BackCanvas, DevDiv, SettingsSection } from './Back.styled';
import type { Grid, RenderedStarMap } from './types';
import Link from 'next/link';
import RenderedRenderSettings from './RenderSettings';
import { useEventCallback, useEventListener } from 'usehooks-ts';

// * Settings
const baseDrawSettings = {
  starAreaColor: 'rgba(0, 255, 255, 0.5)',
  displayStarCore: true,
  coreColor: 'rgba(255, 255, 255, 1)',
  displayNextSize: false,
  displaySurroundings: false,
  displayGrid: false,
};
const baseGenerationSettings = {
  maxDistanceBetweenStars: 0, // * EX: -1 - overlap, 0 - touching, 1 - gap
  growStep: 1, // * EX: 0.1 - precise, 0.5 - fast, 1 - very fast (cell size)
  wallsExist: true,
};
const baseNetSize = 30; // * EX: 10 - small, 40 - medium, 100 - large

export type DrawSettings = typeof baseDrawSettings;
export type GenerationSettings = typeof baseGenerationSettings;

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const devDivRef = useRef<HTMLDivElement>(null);
  const devDiv2Ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [starMap, setStarMap] = useState<RenderedStarMap | null>(null);
  const [drawSettingsState, setDrawSettingsState] = useState<DrawSettings>(baseDrawSettings);

  //* render settings
  const [netSize, setNetSize] = useState(baseNetSize);
  const [generationSettings, setGenerationSettings] =
    useState<GenerationSettings>(baseGenerationSettings);

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
    const newStarMap = generateSpace(grid, wallsExist, growStep, maxDistanceBetweenStars);
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
  const keydownCallback = useCallback(
    (event: KeyboardEvent) => {
      if (document.activeElement !== document.body) return;
      if (event.key === 'r') {
        rerender();
      }
    },
    [rerender],
  );

  useEventListener('keydown', keydownCallback);

  useEffect(() => {
    const devDiv = devDivRef.current;
    const devDiv2 = devDiv2Ref.current;
    if (!devDiv || !devDiv2) return;

    const mouseMoveHandler = (e: MouseEvent, div: HTMLDivElement, right: boolean = true) => {
      const devDivBounds = div.getBoundingClientRect();
      const devDivCenterX = devDivBounds.left + devDivBounds.width / 2;
      const devDivCenterY = devDivBounds.top + devDivBounds.height / 2;

      const triggerWidthArea = devDivBounds.width / 2 + devDivBounds.width / 6;
      const triggerHeightArea = devDivBounds.height / 2 + devDivBounds.height / 20;
      if (
        e.clientX > devDivCenterX - triggerWidthArea &&
        e.clientX < devDivCenterX + triggerWidthArea &&
        e.clientY > devDivCenterY - triggerHeightArea &&
        e.clientY < devDivCenterY + triggerHeightArea
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
        <RenderedRenderSettings
          {...{
            netSize,
            setNetSize,
            generationSettings,
            setGenerationSettings,
            baseGenerationSettings,
            baseNetSize,
          }}
        />
      </DevDiv>
      <DevDiv ref={devDivRef} right>
        {/* <Link href="/play">Play</Link> */}
        <h3>Visual Settings</h3>
        <RenderedSettings
          {...{ settingsState: drawSettingsState, setSettingsState: setDrawSettingsState }}
        />
      </DevDiv>
      <BackCanvas ref={canvasRef} />
    </div>
  );
}

function RenderedSettings({
  settingsState,
  setSettingsState,
}: {
  settingsState: DrawSettings;
  setSettingsState: React.Dispatch<React.SetStateAction<DrawSettings>>;
}) {
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
              type={
                typeof value === 'boolean'
                  ? 'checkbox'
                  : typeof value === 'number'
                  ? 'number'
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
