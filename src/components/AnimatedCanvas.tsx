import { useRef, useEffect, useCallback } from 'react';
import { CanvasElement, CanvasOverlay } from '@/styles/Canvas.styled';
import { overlayDraw, tickDraw } from '@/utils/engine';
import { AnimationSettings, GeneralSettingsType } from './Canvas';

export default function AnimatedCanvas({
  settings,
  generalSettings,
  setFrameRate,
}: {
  settings: AnimationSettings;
  generalSettings: GeneralSettingsType;
  setFrameRate: React.Dispatch<React.SetStateAction<number>>;
}) {
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvas = useRef<HTMLCanvasElement>(null);

  // ?Resize the canvas to fill browser window dynamically
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayCanvas.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    console.log('resizeRef');

    canvas.width = bounds.width * dpr;
    canvas.height = bounds.height * dpr;

    if (overlay) {
      overlay.width = bounds.width * dpr;
      overlay.height = bounds.height * dpr;
    }
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

    console.log('animationStartRef');
    animationRef.current = requestAnimationFrame(tick.bind(null, ctx, 0));

    return () => {
      if (animationRef.current) {
        console.log('animationCleanRef');
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick]);

  const overlayFunc = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      overlayDraw(ctx, settings);
    },
    [settings],
  );

  // ? Handle overlay
  useEffect(() => {
    const overlay = overlayCanvas.current;
    if (!overlay || !generalSettings.canvasOverlay) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    overlayFunc(ctx);
  }, [generalSettings.canvasOverlay, overlayFunc]);

  return (
    <>
      <CanvasElement ref={canvasRef} />
      <CanvasOverlay
        style={{
          zIndex: generalSettings.canvasOverlayPosition,
          display: generalSettings.canvasOverlay ? 'block' : 'none',
          opacity: generalSettings.overlayOpacity,
        }}
        ref={overlayCanvas}
      />
    </>
  );
}
