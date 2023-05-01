import {
  tickCircleDraw,
  overlayCircleDraw,
  tickSquareDraw,
  overlaySquareDraw,
} from '@/utils/engine';
import type { Settings } from '@/utils/settings';

type Animation = {
  tick: (ctx: CanvasRenderingContext2D, settings: Settings) => void;
  overlay: (ctx: CanvasRenderingContext2D, settings: Settings) => void;
};

// animations should be of type Animations but another unique type so it can be then referenced to get the type with object keys
const ball: Animation = {
  tick: tickCircleDraw,
  overlay: overlayCircleDraw,
};
const square: Animation = {
  tick: tickSquareDraw,
  overlay: overlaySquareDraw,
};
export const animations = {
  ball,
  square,
};

export type AnimationName = keyof typeof animations;
