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

export interface AnimationSettings {
  size: number;
  // Add more settings here as needed
}

export interface GeneralSettingsType {
  canvasOverlay: boolean;
  canvasOverlayPosition: number;
  overlayOpacity: number;
  // Add more settings here as needed
}

const defaultSettings: AnimationSettings = {
  size: 100,
};

const defaultGeneralSettings: GeneralSettingsType = {
  canvasOverlay: true,
  canvasOverlayPosition: 0,
  overlayOpacity: 0.9,
};

export default function Canvas() {
  const [frameRate, setFrameRate] = useState<number>(0);
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
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
