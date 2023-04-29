import { useRef, useEffect, useCallback } from 'react';
import { CanvasElement } from '@/styles/Canvas.styled';
import { tickDraw } from '@/utils/engine';
import { AnimationSettings } from './Canvas';

export default function AnimatedCanvas({
  settings,
  setFrameRate,
}: {
  settings: AnimationSettings;
  setFrameRate: React.Dispatch<React.SetStateAction<number>>;
}) {
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ?Resize the canvas to fill browser window dynamically
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    console.log('resizing');
    canvas.width = bounds.width * dpr;
    canvas.height = bounds.height * dpr;
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ? Tick function (called every frame)
  const tick = useCallback(
    (ctx: CanvasRenderingContext2D, frames: number, timeStamp?: number) => {
      // Draw the frame
      tickDraw(ctx, settings);

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
    [setFrameRate, settings],
  );

  // ? Start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Animation start');
    animationRef.current = requestAnimationFrame(tick.bind(null, ctx, 0));

    return () => {
      if (animationRef.current) {
        console.log('Animation cleanup');
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick]);

  return <CanvasElement ref={canvasRef} />;
}
