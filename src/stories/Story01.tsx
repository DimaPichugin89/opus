// Story 1, the hook: seeds -> bottle -> benefit -> lineup + logo + call to order.
import React from 'react';
import {BOTTLES, PHOTOS} from '../assets';
import {Bottle} from '../components/Bottle';
import {KineticText} from '../components/KineticText';
import {LogoPlate} from '../components/LogoPlate';
import {OilDrop} from '../components/OilDrop';
import {PhotoWindow} from '../components/PhotoWindow';
import {SeedDrift, SeedRain} from '../components/Seeds';
import {Disc} from '../components/Shapes';
import {Stage} from '../components/Stage';
import {Shot, Wipe} from '../components/Transitions';
import {COLORS, OIL, STORY_FRAMES, W} from '../theme';

// Cuts (global frames). Each wipe fully covers the frame on its cut.
const CUT = [0, 72, 150, 210, STORY_FRAMES];
const len = (i: number) => CUT[i + 1] - CUT[i];

export const Story01: React.FC = () => (
  <Stage>
    {/* 1. Seeds rain down: Сыродавленное масло */}
    <Shot from={CUT[0]} dur={len(0)} camera={{zoom: [1, 1.07]}}>
      <SeedDrift count={22} seed="s1-back" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={9} opacity={0.6} />
      <SeedRain count={70} seed="s1-front" kinds={['sunflower', 'sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1330, 1760]} spread={34} />
      <KineticText
        top={760}
        lines={[
          {text: 'Сыродавленное', at: 8, role: 'title'},
          {text: 'масло', at: 14, role: 'title', sound: false},
        ]}
      />
    </Shot>

    {/* 2. The bottle lands; a drop falls: Из семян, холодным отжимом */}
    <Shot from={CUT[1]} dur={len(1)} camera={{zoom: [1, 1.05], driftY: [0, -24]}}>
      <Disc cx={W / 2} cy={1250} d={660} color={OIL.sun} at={2} />
      <SeedDrift count={9} seed="s1-orbit" kinds={['sunflower']} size={[30, 58]} speed={3} area={[60, 620, 1020, 1700]} />
      <Bottle asset={BOTTLES.sun} cx={W / 2} bottom={1680} height={1000} landAt={18} />
      <KineticText
        top={300}
        lines={[
          {text: 'Из семян,', at: 26, role: 'body'},
          {text: 'холодным отжимом', at: 32, role: 'lead', sound: false},
        ]}
      />
      <OilDrop x={962} fromY={600} toY={1680} formAt={40} impactAt={60} size={80} />
    </Shot>

    {/* 3. Lifestyle photo window: Витамины и вкус семян сохраняются */}
    <Shot from={CUT[2]} dur={len(2)} camera={{zoom: [1, 1.04]}}>
      <PhotoWindow src={PHOTOS.sunField} cx={W / 2} cy={770} height={1040} revealAt={0} dur={len(2)} />
      <KineticText
        top={1360}
        lines={[
          {text: 'Витамины и вкус', at: 9, role: 'lead'},
          {text: 'семян сохраняются', at: 15, role: 'body', sound: false},
        ]}
      />
    </Shot>

    {/* 4. The lineup lands, then the logo and the call to order */}
    <Shot from={CUT[3]} dur={len(3)} camera={{zoom: [1.02, 1]}}>
      <Bottle asset={BOTTLES.hemp} cx={262} bottom={1600} height={830} landAt={8} gain={0.6} fall={1300} tilt={-4} />
      <Bottle asset={BOTTLES.pumpkin} cx={818} bottom={1600} height={830} landAt={13} gain={0.6} fall={1300} tilt={5} />
      <Bottle asset={BOTTLES.sun} cx={540} bottom={1630} height={900} landAt={18} gain={0.75} fall={1400} />
      <LogoPlate at={26} cy={395} width={640} caption="Закажите свежий отжим" />
    </Shot>

    <Wipe at={CUT[1]} color={OIL.sun} />
    <Wipe at={CUT[2]} color={COLORS.ink} accent={OIL.peanut} />
    <Wipe at={CUT[3]} color={OIL.peanut} accent={OIL.sun} />
  </Stage>
);
