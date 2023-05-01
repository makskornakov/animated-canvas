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
import AnimatedCanvas, { AnimationName } from './AnimatedCanvas';
import CustomConsole from './CustomConsole';
import { animationSettingsSetter, otherSettingsSetter } from './defaultSettings';
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

export default function Canvas() {
  const [frameRate, setFrameRate] = useState<number>(0);
  const [animationName, setAnimationName] = useState<AnimationName>('ball');

  const [animationSettings, setAnimationSettings] = useState<SettingList>(animationSettingsSetter);
  const [otherSettings, setOtherSettings] = useState<SettingList>(otherSettingsSetter);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard>
          <label htmlFor="animationName">Select Animation</label>
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
            categoryName={animationName}
            settings={animationSettings[animationName]}
            setSettings={setAnimationSettings}
          />
          <Settings
            categoryName="general"
            settings={otherSettings.general}
            setSettings={setOtherSettings}
          />
        </SettingsContainer>
        <CanvasContainer>
          <Fps frameRate={frameRate} />
          <AnimatedCanvas
            animationName={animationName}
            initialAllAnimationSettings={animationSettings}
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
