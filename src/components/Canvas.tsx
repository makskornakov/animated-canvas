import { useState } from 'react';
import { CanvasContainer, DetailCard, PageContainer, SideBar } from '@/styles/Canvas.styled';
import Settings from './Settings';
import Fps from './Fps';
import AnimatedCanvas from './AnimatedCanvas';

export interface AnimationSettings {
  size: number;
  // Add more settings here as needed
}

export default function Canvas() {
  const [settings, setSettings] = useState<AnimationSettings>({ size: 50 });
  const [frameRate, setFrameRate] = useState<number>(0);

  return (
    <PageContainer>
      <SideBar>
        <DetailCard />
        <DetailCard />
      </SideBar>
      <div>
        <Settings settings={settings} setSettings={setSettings} />
        <CanvasContainer>
          <Fps frameRate={frameRate} />
          <AnimatedCanvas settings={settings} setFrameRate={setFrameRate} />
        </CanvasContainer>
      </div>
      <SideBar>
        <DetailCard />
        <DetailCard />
      </SideBar>
    </PageContainer>
  );
}
