import type { AnimationName, Settings } from './Canvas';
export default function Settings({
  animationName,
  settings,
  setSettings,
}: {
  animationName: AnimationName;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<{ [key: string]: Settings }>>;
}) {
  return (
    <div key={animationName}>
      {Object.entries(settings).map(([key, setting]) => {
        return (
          <span key={key}>
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}{' '}
            <input
              {...(typeof setting.value === 'boolean'
                ? { checked: setting.value }
                : {
                    value: setting.value,
                  })}
              {...(typeof setting.value === 'number' && {
                min: setting.min || 0,
                max: setting.max || 100,
                step: setting.step || 0.1,
              })}
              type={
                typeof setting.value === 'boolean'
                  ? 'checkbox'
                  : typeof setting.value === 'number'
                  ? 'range'
                  : 'text'
              }
              onChange={(e) =>
                setSettings((prev) => {
                  const newSettings = { ...prev };
                  newSettings[animationName][key as keyof Settings] = {
                    ...prev[animationName][key as keyof Settings],
                    value:
                      typeof prev[animationName][key as keyof Settings].value === 'boolean'
                        ? e.target.checked
                        : typeof prev[animationName][key as keyof Settings].value === 'number'
                        ? e.target.valueAsNumber
                        : e.target.value,
                  };
                  return newSettings;
                })
              }
            />
          </span>
        );
      })}
    </div>
  );
}
