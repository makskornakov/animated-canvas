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

interface Setting {
  value: boolean | number | string;
  min?: number;
  max?: number;
  step?: number;
}

export interface Settings {
  [key: string]: Setting;
}

interface AnimationSettings {
  [key: string]: Settings;
}

export const animationSettings: AnimationSettings = {
  ball: {
    size: {
      value: 50,
      min: 1,
      max: 300,
      step: 0.1,
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
  },
};

const defaultGeneralSettings: Settings = {
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

export default function Canvas() {
  const [frameRate, setFrameRate] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>(animationSettings.ball);
  const [generalSettings, setGeneralSettings] = useState<Settings>(defaultGeneralSettings);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard>
          <CustomConsole />
        </DetailCard>
        <DetailCard />
      </SideBar>
      <div>
        <SettingsContainer>
          <Settings settings={settings} setSettings={setSettings} />
          <Settings settings={generalSettings} setSettings={setGeneralSettings} />
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
