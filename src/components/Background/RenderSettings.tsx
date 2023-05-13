import { useCallback, useState } from 'react';

import { SettingsSection } from './Back.styled';
import { GenerationSettings } from './SpaceBackground';

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
  baseGenerationSettings,
  baseNetSize,
}: {
  netSize: number;
  setNetSize: React.Dispatch<React.SetStateAction<number>>;
  generationSettings: GenerationSettings;
  setGenerationSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  baseGenerationSettings: GenerationSettings;
  baseNetSize: number;
}) {
  const debounceTimeout = 180;

  const [internalGenerationSettings, setInternalGenerationSettings] =
    useInternalReverseDebouncedState(generationSettings, setGenerationSettings, debounceTimeout);

  const [internalNetSize, setInternalNetSize] = useInternalReverseDebouncedState(
    netSize,
    setNetSize,
    debounceTimeout,
  );

  const updateSettings = useCallback(
    (key: keyof GenerationSettings, value: any) => {
      setInternalGenerationSettings((prev: any) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setInternalGenerationSettings],
  );

  const resetSettings = useCallback(
    (key: keyof GenerationSettings | 'netSize') => {
      if (key === 'netSize') {
        setInternalNetSize(baseNetSize);
      } else
        setInternalGenerationSettings((prev: any) => {
          if (prev[key] === baseGenerationSettings[key]) return prev;
          return {
            ...prev,
            [key]: baseGenerationSettings[key],
          };
        });
    },
    [baseGenerationSettings, baseNetSize, setInternalGenerationSettings, setInternalNetSize],
  );

  return (
    <SettingsSection>
      <label
        onDoubleClick={() => {
          resetSettings('netSize');
        }}
      >
        Net size: {internalNetSize}
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
      <RenderOtherGenerationSettings
        {...{
          internalGenerationSettings,
          updateSettings,
          resetSettings,
        }}
      />
    </SettingsSection>
  );
}
function RenderOtherGenerationSettings({
  internalGenerationSettings,
  updateSettings,
  resetSettings,
}: {
  internalGenerationSettings: GenerationSettings;
  updateSettings: (key: keyof GenerationSettings, value: any) => void;
  resetSettings: (key: keyof GenerationSettings) => void;
}) {
  return (
    <>
      <label
        onDoubleClick={() => {
          resetSettings('maxDistanceBetweenStars');
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
          resetSettings('growStep');
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
          }}
        />
        <h5>Allow growing over the walls</h5>
      </label>
    </>
  );
}
