import type { GeneralSettingsType } from './Canvas';
export default function GeneralSettings({
  generalSettings,
  setGeneralSettings,
}: {
  generalSettings: GeneralSettingsType;
  setGeneralSettings: React.Dispatch<React.SetStateAction<GeneralSettingsType>>;
}) {
  return (
    <div>
      {Object.entries(generalSettings).map(([key, value]) => {
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
                      step: value.step,
                    })}
                type={typeof value.value === 'boolean' ? 'checkbox' : 'range'}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof GeneralSettingsType],
                      value:
                        typeof prev[key as keyof GeneralSettingsType].value === 'boolean'
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
