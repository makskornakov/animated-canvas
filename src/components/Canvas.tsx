import { createRef, useEffect, useRef, useState } from 'react';
import {
  CanvasContainer,
  DetailCard,
  Indicator,
  PageContainer,
  SideBar,
} from '@/styles/Canvas.styled';
import Settings from './Settings';
import Fps from './Fps';
import AnimatedCanvas from './AnimatedCanvas';
import { keyToName } from '@/utils/keyFunc';

export interface AnimationSettings {
  size: number;
  // Add more settings here as needed
}

export default function Canvas() {
  const [settings, setSettings] = useState<AnimationSettings>({ size: 50 });
  const [frameRate, setFrameRate] = useState<number>(0);

  // automatically set the ref keys based on the ConsoleRefs type
  const consoleSpanRefs = useRef({
    animationStartRef: createRef<HTMLSpanElement>(),
    animationCleanRef: createRef<HTMLSpanElement>(),
    resizeRef: createRef<HTMLSpanElement>(),
    drawTickRef: createRef<HTMLSpanElement>(),
  });

  type ConsoleRefs = typeof consoleSpanRefs.current;

  useEffect(() => {
    const blink = (ref: React.RefObject<HTMLSpanElement>) => {
      if (!ref.current) return;
      ref.current.style.color = 'red';

      setTimeout(() => {
        if (!ref.current) return;
        ref.current.style.color = 'lightgray';
      }, 250);
    };

    const oldLog = console.log;
    console.log = function (key?: keyof ConsoleRefs, ...args: any[]) {
      if (key && key in consoleSpanRefs.current) {
        blink(consoleSpanRefs.current[key] as React.RefObject<HTMLSpanElement>);
      } else oldLog.apply(console, [key, ...args]);
    };
  }, []);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard>
          <h4>Console</h4>
          {Object.keys(consoleSpanRefs.current).map((key) => {
            return (
              <span key={key}>
                {keyToName(key)}
                <Indicator ref={consoleSpanRefs.current[key as keyof ConsoleRefs]} />
              </span>
            );
          })}
        </DetailCard>
        <DetailCard />
      </SideBar>
      <div>
        <Settings settings={settings} setSettings={setSettings} />
        <CanvasContainer>
          <Fps frameRate={frameRate} />
          <AnimatedCanvas settings={settings} setFrameRate={setFrameRate} />
        </CanvasContainer>
      </div>
      <SideBar>
        <DetailCard />
        <DetailCard />
      </SideBar>
    </PageContainer>
  );
}
