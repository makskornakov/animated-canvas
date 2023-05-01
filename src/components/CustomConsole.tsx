import { ConsoleContainer, Indicator } from '@/styles/Canvas.styled';
import { keyToName } from '@/utils/keyFunc';
import { useRef, createRef, useEffect } from 'react';

export default function CustomConsole() {
  // ? Create refs for each console log that needs to be visualized
  const consoleSpanRefs = useRef({
    animationStartRef: createRef<HTMLDivElement>(), // ? console.log('animationStartRef')
    animationCleanRef: createRef<HTMLDivElement>(),
    resizeRef: createRef<HTMLDivElement>(),
    drawTickRef: createRef<HTMLDivElement>(),
    overlayDrawRef: createRef<HTMLDivElement>(),
    // Add more refs here as needed
  });

  type ConsoleRefs = typeof consoleSpanRefs.current;

  useEffect(() => {
    const blink = (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return;

      // ref.current.style.background = 'var(--coquelicot)';
      ref.current.style.background = 'lime';
      // ? Another visualization method
      // ref.current.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      //   Math.random() * 255
      // })`;

      setTimeout(() => {
        if (!ref.current) return;
        ref.current.style.background = 'lightgray';
      }, 250);
    };

    const oldLog = console.log;
    console.log = function (key?: keyof ConsoleRefs, ...args: any[]) {
      if (key && key in consoleSpanRefs.current) {
        blink(consoleSpanRefs.current[key] as React.RefObject<HTMLDivElement>);
      } else oldLog.apply(console, [key, ...args]);
    };
  }, []);
  return (
    <>
      <h4>Console</h4>
      <ConsoleContainer>
        {Object.keys(consoleSpanRefs.current).map((key) => {
          return (
            <span key={key}>
              <span>{keyToName(key)}</span>
              <Indicator>
                <div ref={consoleSpanRefs.current[key as keyof ConsoleRefs]} />
              </Indicator>
            </span>
          );
        })}
      </ConsoleContainer>
    </>
  );
}
