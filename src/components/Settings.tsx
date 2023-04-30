import type { Settings } from './Canvas';
export default function Settings({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
  return (
    <div>
      {Object.entries(settings).map(([key, setting]) => {
        return (
          <>
            <span key={key}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}{' '}
              <input
                {...(typeof setting.value === 'boolean'
                  ? { checked: setting.value }
                  : {
                      value: setting.value,
                    })}
                {...(typeof setting.value === 'number' && {
                  min: setting.min,
                  max: setting.max,
                  step: setting.step,
                })}
                type={
                  typeof setting.value === 'boolean'
                    ? 'checkbox'
                    : typeof setting.value === 'number'
                    ? 'range'
                    : 'text'
                }
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof Settings],
                      value:
                        typeof prev[key as keyof Settings].value === 'boolean'
                          ? e.target.checked
                          : typeof prev[key as keyof Settings].value === 'number'
                          ? e.target.valueAsNumber
                          : e.target.value,
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
