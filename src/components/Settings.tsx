// import { BaseSettings } from './Canvas';

import type { AnimationSettings } from './Canvas';
export default function Settings({
  settings,
  setSettings,
}: {
  settings: AnimationSettings;
  setSettings: React.Dispatch<React.SetStateAction<AnimationSettings>>;
}) {
  return (
    <div>
      {Object.entries(settings).map(([key, value]) => {
        return (
          <>
            <span key={key}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}{' '}
              <input
                {...(typeof value.value === 'boolean'
                  ? { checked: value.value }
                  : {
                      value: value.value,
                      min: value.min,
                      max: value.max,
                    })}
                type={typeof value.value === 'boolean' ? 'checkbox' : 'range'}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof AnimationSettings],
                      value:
                        typeof prev[key as keyof AnimationSettings].value === 'boolean'
                          ? e.target.checked
                          : e.target.valueAsNumber,
                    },
                  }))
                }
              />
            </span>
            <br></br>
          </>
        );
      })}
    </div>
  );
}
