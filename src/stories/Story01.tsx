// Story 1, the hook: seeds are crushed by the press -> how it is made -> what it gives you ->
// lineup + logo + where to order.
import React from 'react';
import {BOTTLES} from '../assets';
import {BenefitList} from '../components/BenefitList';
import {Bottle} from '../components/Bottle';
import {KineticText} from '../components/KineticText';
import {LogoPlate} from '../components/LogoPlate';
import {DropShape} from '../components/OilDrop';
import {PressJaws, PressSquash} from '../components/PressJaws';
import {ProcessSteps} from '../components/ProcessSteps';
import {SeedDrift, SeedRain} from '../components/Seeds';
import {Stage} from '../components/Stage';
import {LiquidWipe, Shot} from '../components/Transitions';
import {Sfx} from '../sfx';
import {COLORS, OIL, STORY_FRAMES} from '../theme';

// Cuts (global frames). Every transition fully covers the frame on its cut.
const CUT = [0, 48, 140, 228, STORY_FRAMES];
const len = (i: number) => CUT[i + 1] - CUT[i];

export const Story01: React.FC = () => (
  <Stage>
    {/* 1. Seeds rain down: Сыродавленное масло. The press plates then crush the whole shot. */}
    <Shot from={CUT[0]} dur={len(0)} camera={{zoom: [1, 1.06]}}>
      <PressSquash at={CUT[1]} mode="squash">
        <SeedDrift count={22} seed="s1-back" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={9} opacity={0.6} />
        <SeedRain count={70} seed="s1-front" kinds={['sunflower', 'sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1330, 1760]} spread={26} />
        <Sfx name="seeds" at={3} />
        <KineticText
          top={760}
          lines={[
            {text: 'Сыродавленное', at: 4, role: 'title'},
            {text: 'масло', at: 10, role: 'title', sound: false},
          ]}
        />
      </PressSquash>
    </Shot>

    {/* 2. How it is made: seeds -> press without heat -> fresh oil */}
    <Shot from={CUT[1]} dur={len(1)} camera={{zoom: [1, 1.03]}}>
      <PressSquash at={0} mode="release">
        <KineticText
          top={300}
          lines={[
            {text: 'Семена под пресс,', at: 5, role: 'lead'},
            {text: 'без нагрева', at: 11, role: 'body', sound: false},
          ]}
        />
        <ProcessSteps cy={1010} at={12} labels={[['семена'], ['пресс', 'без нагрева'], ['свежее', 'масло']]} />
      </PressSquash>
    </Shot>

    {/* 3. What it gives you: benefits infographic */}
    <Shot from={CUT[2]} dur={len(2)} camera={{zoom: [1, 1.03]}}>
      <KineticText top={420} lines={[{text: 'В каждой ложке', at: 4, role: 'lead'}]} />
      <BenefitList
        top={640}
        gap={300}
        items={[
          {at: 14, badge: 'E', color: OIL.peanut, title: 'Витамин E', note: 'для кожи'},
          {at: 26, badge: 'ω', color: OIL.hemp, ink: COLORS.cream, title: 'Омега-3, 6, 9', note: 'для сосудов и мозга'},
          {at: 38, badge: <DropShape size={72} />, color: COLORS.creamDeep, title: 'Отжим под заказ', note: 'всегда свежее'},
        ]}
      />
    </Shot>

    {/* 4. The lineup lands, then the logo and where to order */}
    <Shot from={CUT[3]} dur={len(3)} camera={{zoom: [1.02, 1]}}>
      <Bottle asset={BOTTLES.hemp} cx={262} bottom={1610} height={800} landAt={4} gain={0.6} fall={1300} tilt={-4} />
      <Bottle asset={BOTTLES.pumpkin} cx={818} bottom={1610} height={800} landAt={8} gain={0.6} fall={1300} tilt={5} />
      <Bottle asset={BOTTLES.sun} cx={540} bottom={1650} height={870} landAt={12} gain={0.75} fall={1400} />
      <LogoPlate at={16} cy={395} width={640} />
      <KineticText
        top={560}
        lines={[
          {text: 'Заказывайте на', at: 26, role: 'note', color: COLORS.inkSoft},
          {text: 'maslarada.ru', at: 30, role: 'lead', sound: false},
        ]}
      />
    </Shot>

    <PressJaws at={CUT[1]} seed="j1" />
    <LiquidWipe at={CUT[2]} seed="w2" />
    <LiquidWipe at={CUT[3]} seed="w3" />
  </Stage>
);
