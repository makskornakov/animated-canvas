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
  );
}
