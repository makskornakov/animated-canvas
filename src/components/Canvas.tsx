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
export interface Settings {
  [key: string]: {
    value: boolean | number | string;
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface SettingList {
  [key: string]: Settings;
}

export const animationSettingsSetter: SettingList = {
  ball: {
    size: {
      value: 100,
      min: 10,
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
  },
  square: {
    size: {
      value: 100,
      min: 10,
      max: 300,
    },
    randomSize: {
      value: false,
    },
    randomForce: {
      value: 0.2,
      max: 2,
      step: 0.01,
    },
  },
};

const otherSettingsSetter: SettingList = {
  general: {
    canvasOverlay: {
      value: false,
    },
    canvasOverlayBehind: {
      value: false,
    },
    overlayOpacity: {
      value: 0.5,
      max: 1,
      step: 0.01,
    },
  },
};

export type AnimationName = keyof typeof animationSettingsSetter;

export default function Canvas() {
  const [frameRate, setFrameRate] = useState<number>(0);
  const [animationName, setAnimationName] = useState<AnimationName>('ball');

  const [animationSettings, setAnimationSettings] = useState<SettingList>(animationSettingsSetter);
  const [otherSettings, setOtherSettings] = useState<SettingList>(otherSettingsSetter);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard>
          <label htmlFor="animationName">Animation Name</label>
          <select
            onChange={(e) => setAnimationName(e.target.value as AnimationName)}
            id="animationName"
          >
            {Object.keys(animationSettingsSetter).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </DetailCard>
        <DetailCard />
      </SideBar>
      <div>
        <SettingsContainer>
          <Settings
            animationName={animationName}
            settings={animationSettings[animationName]}
            setSettings={setAnimationSettings}
          />
          <Settings
            animationName="general"
            settings={otherSettings.general}
            setSettings={setOtherSettings}
          />
        </SettingsContainer>
        <CanvasContainer>
          <Fps frameRate={frameRate} />
          <AnimatedCanvas
            animationName={animationName}
            allAnimationSettings={animationSettings}
            setFrameRate={setFrameRate}
            generalSettings={otherSettings.general}
          />
        </CanvasContainer>
      </div>
      <SideBar>
        <DetailCard>
          <CustomConsole />
        </DetailCard>

        <DetailCard />
      </SideBar>
    </PageContainer>
  );
}
