import type { Settings } from './Canvas';
import { SettingsContainer } from './Canvas.styled';
export default function Settings({
  settings,
  setSettings,
  ...props
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
  return (
    <SettingsContainer {...props}>
      <input
        type="range"
        min="10"
        max="300"
        value={settings.size}
        onChange={(e) => setSettings({ ...settings, size: Number(e.target.value) })}
      />{' '}
      <span>{settings.size}</span>
      <br></br>
    </SettingsContainer>
  );
}
