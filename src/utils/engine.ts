import type { AnimationSettings } from '@/components/Canvas';

export function tickDraw(ctx: CanvasRenderingContext2D, settings: AnimationSettings) {
  console.log('drawTickRef');

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { size } = settings;
  // get the value between 0.9 and 1.1

  // ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
  ctx.fillStyle = '#f15025';
  // for (let i = 0; i < 1; i++) {
  const randS = 0.9 + Math.random() * 0.2;
  const updatedSize = size * randS;
  const randomX = Math.random() * ctx.canvas.width;
  const randomY = Math.random() * ctx.canvas.height;
  ctx.beginPath();
  // ctx.arc(randomX, randomY, updatedSize, 0, Math.PI * 2);
  ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  // }
}
