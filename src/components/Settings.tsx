import type { AnimationSettings } from './Canvas';
import { SettingsContainer } from '@/styles/Canvas.styled';
export default function Settings({
  settings,
  setSettings,
  ...props
}: {
  settings: AnimationSettings;
  setSettings: React.Dispatch<React.SetStateAction<AnimationSettings>>;
}) {
  return (
    <SettingsContainer {...props}>
      <div>
        <input
          type="range"
          min="10"
          max="300"
          value={settings.size}
          onChange={(e) => setSettings({ ...settings, size: Number(e.target.value) })}
        />{' '}
        <span>{settings.size}</span>
        <br></br>
      </div>

      <div></div>
    </SettingsContainer>
  );
}
