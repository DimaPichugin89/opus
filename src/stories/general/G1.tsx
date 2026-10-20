// General 1. What cold-pressed oil is: seeds -> pressed under 30 °C -> everything stays in the oil.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {PressJaws, PressSquash} from '../../components/PressJaws';
import {Scene} from '../../components/Scene';
import {SeedDrift, SeedRain} from '../../components/Seeds';
import {Stage} from '../../components/Stage';
import {OilJar, PressCutaway} from '../../illus/press';
import {Sfx} from '../../sfx';
import {COLORS} from '../../theme';

export const G1_FRAMES = 480;
const JAWS = 126;
const S2: [number, number] = [JAWS, 180];
const S3: [number, number] = [JAWS + 180 - 12, G1_FRAMES - (JAWS + 180 - 12)];

export const G1: React.FC = () => (
  <Stage>
    <Scene at={[0, JAWS]} first last>
      <PressSquash at={JAWS} mode="squash">
        <SeedDrift count={22} seed="g1-back" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={5} opacity={0.6} />
        <SeedRain count={60} seed="g1-front" kinds={['sunflower', 'sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1330, 1760]} spread={40} />
        <Sfx name="seeds" at={4} gain={0.8} />
        <KineticText
          top={720}
          lines={[
            {text: 'Что такое', at: 10, role: 'lead'},
            {text: 'сыродавленное масло?', at: 16, role: 'lead', sound: false},
          ]}
        />
      </PressSquash>
    </Scene>

    <Scene at={S2} first>
      <PressSquash at={0} mode="release">
        <KineticText
          top={290}
          lines={[
            {text: 'Семена просто', at: 12, role: 'lead'},
            {text: 'давят прессом', at: 18, role: 'lead', sound: false},
            {text: 'не выше 30 °C, без химии', at: 52, role: 'sub', color: COLORS.inkSoft, sound: false},
          ]}
        />
        <PressCutaway cx={540} cy={1100} at={10} scale={1.12} />
      </PressSquash>
    </Scene>

    <Scene at={S3} last>
      <KineticText
        top={290}
        lines={[
          {text: 'В масле остаётся всё,', at: 14, role: 'lead'},
          {text: 'что было в семенах', at: 20, role: 'lead', sound: false},
          {text: 'вкус, запах и польза', at: 50, role: 'sub', color: COLORS.inkSoft, sound: false},
        ]}
      />
      <OilJar cx={540} cy={1110} at={6} scale={1.15} />
    </Scene>

    <PressJaws at={JAWS} seed="g1j" />
  </Stage>
);
