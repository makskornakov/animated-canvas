import { useRef, useEffect, useCallback, useState } from 'react';
import { CanvasElement, CanvasOverlay } from '@/styles/Canvas.styled';
import { overlayDraw, tickDraw } from '@/utils/engine';
// import { SmartSetting, Setting } from './Canvas';
// import { SmartSettings } from './Canvas';
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
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // ?Resize the canvas to fill browser window dynamically
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    // const overlay = overlayCanvas.current;
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

  const overlayFunc = useCallback(() => {
    const overlay = overlayCanvas.current;
    if (!overlay || !generalSettings.canvasOverlay.value) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    overlayDraw(ctx, settings);
  }, [generalSettings.canvasOverlay.value, settings]);

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

  return (
    <>
      <CanvasElement ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
      <CanvasOverlay
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          zIndex: generalSettings.canvasOverlayBehind.value ? -1 : 0,
          display: generalSettings.canvasOverlay.value ? 'block' : 'none',
          opacity: generalSettings.overlayOpacity.value,
        }}
        ref={overlayCanvas}
      />
    </>
  );
}
