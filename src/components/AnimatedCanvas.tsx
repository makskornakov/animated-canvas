import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { CanvasElement, CanvasOverlay } from '@/styles/Canvas.styled';
import {
  overlayCircleDraw,
  overlaySquareDraw,
  tickCircleDraw,
  tickSquareDraw,
} from '@/utils/engine';
import { AnimationName, SettingList, Settings } from './Canvas';

type Animations = {
  [key in AnimationName]: {
    tick: (ctx: CanvasRenderingContext2D, settings: Settings) => void;
    overlay: (ctx: CanvasRenderingContext2D, settings: Settings) => void;
  };
};

const animations: Animations = {
  ball: {
    tick: tickCircleDraw,
    overlay: overlayCircleDraw,
  },
  square: {
    tick: tickSquareDraw,
    overlay: overlaySquareDraw,
  },
};

export default function AnimatedCanvas({
  animationName,
  allAnimationSettings,
  generalSettings,
  setFrameRate,
}: {
  animationName: AnimationName;
  allAnimationSettings: SettingList;
  generalSettings: Settings;
  setFrameRate: React.Dispatch<React.SetStateAction<number>>;
}) {
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvas = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // ?Resize the canvas to fill browser window dynamically
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    console.log('resizeRef');

    setCanvasSize({
      width: bounds.width * dpr,
      height: bounds.height * dpr,
    });
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  // ? Tick function (called every frame)
  const tick = useCallback(
    (ctx: CanvasRenderingContext2D, frames: number, timeStamp?: number) => {
      // Draw the frame
      console.log('drawTickRef');
      // tickDraw(ctx, settings);
      animations[animationName].tick(ctx, allAnimationSettings[animationName]);

      // Update frame rate
      frames++;
      const lastTimeStamp = performance.now();
      if (timeStamp && lastTimeStamp > timeStamp + 1000) {
        setFrameRate(frames);
        frames = 0;
        timeStamp = lastTimeStamp;
      }

      // Handle next frame
      animationRef.current = requestAnimationFrame(
        tick.bind(null, ctx, frames, timeStamp || lastTimeStamp),
      );
    },
    [animationName, setFrameRate, allAnimationSettings],
  );

  const overlayFunc = useCallback(() => {
    const overlay = overlayCanvas.current;
    if (!overlay || !generalSettings.canvasOverlay.value) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    console.log('overlayDrawRef');
    // overlayDraw(ctx, settings);
    animations[animationName].overlay(ctx, allAnimationSettings[animationName]);
  }, [animationName, generalSettings.canvasOverlay.value, allAnimationSettings]);

  useEffect(() => {
    overlayFunc();
  }, [
    overlayFunc,
    canvasSize, // ? For the first render and resize rerender
  ]);

  // ? Start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('animationStartRef');
    animationRef.current = requestAnimationFrame(tick.bind(null, ctx, 0));
    return () => {
      if (animationRef.current) {
        console.log('animationCleanRef');
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick]);

  const behind = generalSettings.canvasOverlayBehind.value as boolean;
  const shown = generalSettings.canvasOverlay.value as boolean;
  const opacity = generalSettings.overlayOpacity.value as number;

  return (
    <>
      <CanvasElement ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
      <CanvasOverlay
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          zIndex: behind ? -1 : 1,
          display: shown ? 'block' : 'none',
          opacity,
        }}
        ref={overlayCanvas}
      />
    </>
  );
}
