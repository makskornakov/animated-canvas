import type { Settings } from '@/components/Canvas';

// import { BaseSettings } from "@/components/Canvas";

export function tickDraw(ctx: CanvasRenderingContext2D, settings: Settings) {
  console.log('drawTickRef');

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // settings = {
  // size: {
  //   value: 100,
  //   min: 0,
  //   max: 1000,
  //   step: 1,
  // }
  // }

  const size = settings.size.value as number;
  const randomX = settings.randomX.value;
  const randomY = settings.randomY.value;
  const randomSize = settings.randomSize.value;

  // get the value between 0.9 and 1.1

  // ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
  ctx.fillStyle = '#f15025';
  // for (let i = 0; i < 1; i++) {
  const randS = 0.9 + Math.random() * 0.2;
  const updatedSize = size * randS;
  const randomXpos = Math.random() * ctx.canvas.width;
  const randomYpos = Math.random() * ctx.canvas.height;
  ctx.beginPath();
  ctx.arc(
    randomX ? randomXpos : ctx.canvas.width / 2,
    randomY ? randomYpos : ctx.canvas.height / 2,
    randomSize ? updatedSize : size,
    0,
    Math.PI * 2,
  );
  // ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  // }
}

export function overlayDraw(ctx: CanvasRenderingContext2D, settings: Settings) {
  console.log('overlayDrawRef');

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const size = settings.size.value as number;

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, size, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}
