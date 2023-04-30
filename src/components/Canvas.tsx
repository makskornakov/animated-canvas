import { useState } from 'react';
import {
  CanvasContainer,
  DetailCard,
  PageContainer,
  SettingsContainer,
  SideBar,
} from '@/styles/Canvas.styled';
import Settings from './Settings';
import Fps from './Fps';
import AnimatedCanvas from './AnimatedCanvas';
import CustomConsole from './CustomConsole';
import GeneralSettings from './GeneralSettings';

// type Setting = {
//   value: boolean | number;
//   // (typeof value extends boolean ? 'min' : never)?: number;
//   min?: number;
//   max?: number;
// };

// export type SettingsObject = {
//   [key: string]: Setting;
// };

// interface Setting {
//   type: 'boolean' | 'number';
//   value: boolean | number;
//   min?: number;
//   max?: number;
// }

// export interface BaseSettings {
//   [key: string]: Setting;
// }

const defaultAnimationSettings = {
  size: {
    value: 50,
    min: 1,
    max: 300,
  },

  randomSize: {
    value: false,
  },

  randomX: {
    value: false,
  },

  randomY: {
    value: false,
  },
};

// type SmartSettings<T extends Setting> = T['type'] extends 'number'
//   ? T & { min: number; max: number }
//   : T;

const defaultGeneralSettings = {
  canvasOverlay: {
    value: false,
  },
  canvasOverlayBehind: {
    value: false,
  },
  overlayOpacity: {
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
  },
};

export type AnimationSettings = typeof defaultAnimationSettings;

export type GeneralSettingsType = typeof defaultGeneralSettings;

export default function Canvas() {
  const [frameRate, setFrameRate] = useState<number>(0);
  const [settings, setSettings] = useState<AnimationSettings>(defaultAnimationSettings);
  const [generalSettings, setGeneralSettings] =
    useState<GeneralSettingsType>(defaultGeneralSettings);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard>
          {/* Add needed console.logs inside */}
          <CustomConsole />
        </DetailCard>
        <DetailCard />
      </SideBar>
      <div>
        <SettingsContainer>
          <Settings settings={settings} setSettings={setSettings} />
          {/* <Settings settings={generalSettings} setSettings={setGeneralSettings} /> */}
          <GeneralSettings
            generalSettings={generalSettings}
            setGeneralSettings={setGeneralSettings}
          />
        </SettingsContainer>
        <CanvasContainer>
          <Fps frameRate={frameRate} />
          <AnimatedCanvas
            settings={settings}
            setFrameRate={setFrameRate}
            generalSettings={generalSettings}
          />
        </CanvasContainer>
      </div>
      <SideBar>
        <DetailCard />
        <DetailCard />
      </SideBar>
    </PageContainer>
  );
}
