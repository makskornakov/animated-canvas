import { useCallback, useState } from 'react';

import { SettingsSection } from './Back.styled';

function useInternalReverseDebouncedState<T>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  delay: number,
) {
  const [internalGenerationSettings, setInternalGenerationSettings] = useState(state);

  const [currentTimeoutId, setCurrentTimeoutId] = useState<NodeJS.Timeout>();

  function modifiedSetState(funcOrNewValue: React.SetStateAction<T>) {
    clearTimeout(currentTimeoutId);

    setInternalGenerationSettings(funcOrNewValue);

    const timeoutId = setTimeout(() => {
      setState(funcOrNewValue);
    }, delay);
    setCurrentTimeoutId(timeoutId);
  }

  return [internalGenerationSettings, modifiedSetState] as const;
}

export default function RenderedRenderSettings({
  netSize,
  setNetSize,
  generationSettings,
  setGenerationSettings,
}: {
  netSize: number;
  setNetSize: React.Dispatch<React.SetStateAction<number>>;
  generationSettings: any; // TODO! remove any
  setGenerationSettings: React.Dispatch<React.SetStateAction<any>>;
}) {
  const debounceTimeout = 180;

  const [internalGenerationSettings, setInternalGenerationSettings] =
    useInternalReverseDebouncedState(generationSettings, setGenerationSettings, debounceTimeout);

  const updateSettings = useCallback(
    (key: string, value: any) => {
      setInternalGenerationSettings((prev: any) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setInternalGenerationSettings],
  );

  const [internalNetSize, setInternalNetSize] = useInternalReverseDebouncedState(
    netSize,
    setNetSize,
    debounceTimeout,
  );

  return (
    <SettingsSection>
      <label
        onDoubleClick={() => {
          if (internalNetSize === 30) return;
          setNetSize(30);
        }}
      >
        Net size: {internalNetSize}
        {/* uses a lot of resources */}
        <h5 style={internalNetSize < 10 ? { color: 'red' } : {}}>
          Smaller net is resource intensive
        </h5>
        <input
          type="range"
          min="1"
          step={1}
          max="100"
          value={internalNetSize}
          onChange={(e) => {
            setInternalNetSize(+e.target.value);
          }}
        />
      </label>

      <label
        onDoubleClick={() => {
          if (internalGenerationSettings.maxDistanceBetweenStars === 0) return;
          setGenerationSettings({
            ...internalGenerationSettings,
            maxDistanceBetweenStars: 0,
          });
        }}
      >
        Max star distance: {internalGenerationSettings.maxDistanceBetweenStars}
        <h5>Negative - overlap | Positive - space</h5>
        <input
          type="range"
          min="-10"
          step={0.1}
          max="10"
          value={internalGenerationSettings.maxDistanceBetweenStars}
          onChange={(e) => {
            updateSettings('maxDistanceBetweenStars', +e.target.value);
          }}
        />
      </label>
      <label
        onDoubleClick={() => {
          if (internalGenerationSettings.growStep === 0.1) return;
          setGenerationSettings({
            ...internalGenerationSettings,
            growStep: 1,
          });
        }}
      >
        Grow step: {internalGenerationSettings.growStep}
        <h5>Smaller step is more precise</h5>
        <h5 style={internalGenerationSettings.growStep < 0.5 ? { color: 'red' } : {}}>
          Smaller step is resource intensive
        </h5>
        <input
          type="range"
          min="0.1"
          step={0.01}
          max="2"
          value={internalGenerationSettings.growStep}
          onChange={(e) => {
            updateSettings('growStep', +e.target.value);
          }}
        />
      </label>
      <label>
        Walls exist:
        <input
          type="checkbox"
          checked={internalGenerationSettings.wallsExist}
          onChange={(e) => {
            updateSettings('wallsExist', e.target.checked);
            // setGenerationSettings({
            //   ...internalGenerationSettings,
            //   wallsExist: e.target.checked,
            // });
          }}
        />
        <h5>Allow growing over the walls</h5>
      </label>
    </SettingsSection>
  );
}
