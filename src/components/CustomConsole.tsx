import { ConsoleContainer, Indicator } from '@/styles/Canvas.styled';
import { keyToName } from '@/utils/keyFunc';
import { useRef, createRef, useEffect } from 'react';

export default function CustomConsole() {
  // ? Create refs for each console log that needs to be visualized
  const consoleSpanRefs = useRef({
    animationStartRef: createRef<HTMLSpanElement>(), // ? console.log('animationStartRef')
    animationCleanRef: createRef<HTMLSpanElement>(),
    resizeRef: createRef<HTMLSpanElement>(),
    drawTickRef: createRef<HTMLSpanElement>(),
    // Add more refs here as needed
  });

  type ConsoleRefs = typeof consoleSpanRefs.current;

  useEffect(() => {
    const blink = (ref: React.RefObject<HTMLSpanElement>) => {
      if (!ref.current) return;

      ref.current.style.color = 'var(--coquelicot)';
      // ? Another visualization method
      // ref.current.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      //   Math.random() * 255
      // })`;

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
    <>
      <h4>Console</h4>
      <ConsoleContainer>
        {Object.keys(consoleSpanRefs.current).map((key) => {
          return (
            <span key={key}>
              <span>{keyToName(key)}</span>
              <Indicator ref={consoleSpanRefs.current[key as keyof ConsoleRefs]} />
            </span>
          );
        })}
      </ConsoleContainer>
    </>
  );
}
