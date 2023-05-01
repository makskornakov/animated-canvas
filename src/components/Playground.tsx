import { useState } from 'react';
import {
  CanvasContainer,
  DetailCard,
  PageContainer,
  SettingsContainer,
  SideBar,
} from '@/styles/Canvas.styled';
import DynamicSettings from './DynamicSettings';
import Fps from './Fps';
import AnimatedCanvas from './AnimatedCanvas';
import CustomConsole from './CustomConsole';
import { animationSettingsSetter, otherSettingsSetter } from '../utils/settings';
import type { SettingList } from '../utils/settings';
import type { AnimationName } from '../utils/animations';

export default function Playground() {
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
          <DynamicSettings
            categoryName={animationName}
            settings={animationSettings[animationName]}
            setSettings={setAnimationSettings}
          />
          <DynamicSettings
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
