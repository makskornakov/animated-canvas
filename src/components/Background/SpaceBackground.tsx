import React, { useRef, useEffect, useCallback, useState } from 'react';
import { drawAll, generateSpace, getGrid } from './render';
import { drawGrid } from './draw';
import { BackCanvas } from './Back.styled';
import type { Grid, RenderedStarMap } from './types';
import { DrawSettings, GenerationSettings } from './SpacePlayground';

export default function SpaceBackground({
  netSize,
  generationSettings,
  drawSettings,
  setRerenderFunc,
}: {
  netSize: number;
  generationSettings: GenerationSettings;
  drawSettings: DrawSettings;
  setRerenderFunc: React.Dispatch<React.SetStateAction<() => void>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [starMap, setStarMap] = useState<RenderedStarMap | null>(null);

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
    if (drawSettings.displayGrid)
      requestAnimationFrame(() => {
        drawGrid(grid, ctx);
      });
    drawAll(ctx, grid, grid[0][0].size, starMap, drawSettings, generationSettings.growStep);
  }, [drawSettings, grid, starMap, generationSettings.growStep]);

  useEffect(() => {
    render();
    setRerenderFunc(() => render);
  }, [render, setRerenderFunc]);

  useEffect(() => {
    drawEverything();
  }, [drawEverything]);

  return <BackCanvas ref={canvasRef} />;
}
