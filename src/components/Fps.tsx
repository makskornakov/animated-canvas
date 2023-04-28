import { FpsSpan } from './Canvas.styled';

export default function Fps({ frameRate }: { frameRate: number }) {
  return (
    <FpsSpan fps={frameRate}>
      {frameRate}
      &nbsp;
      <span>FPS</span>
    </FpsSpan>
  );
}
