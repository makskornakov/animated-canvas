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
      <span>
        Overlay{' '}
        <input
          type="checkbox"
          checked={generalSettings.canvasOverlay}
          onChange={(e) =>
            setGeneralSettings((prev) => ({ ...prev, canvasOverlay: e.target.checked }))
          }
        />
      </span>
      <br></br>
      <span>
        Overlay Behind{' '}
        <input
          type="checkbox"
          checked={generalSettings.canvasOverlayPosition === -1}
          onChange={(e) =>
            setGeneralSettings((prev) => ({
              ...prev,
              canvasOverlayPosition: e.target.checked ? -1 : 0,
            }))
          }
        />
      </span>
      <br></br>
      <span> Overlay Opacity </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={generalSettings.overlayOpacity}
        onChange={(e) =>
          setGeneralSettings((prev) => ({
            ...prev,
            overlayOpacity: Number(e.target.value),
          }))
        }
      />
    </div>
  );
}
