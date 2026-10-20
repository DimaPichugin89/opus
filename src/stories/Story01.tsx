// Story 1, the hook: seeds -> bottle -> benefit -> lineup + logo.
import React from 'react';
import {BOTTLES, PHOTOS} from '../assets';
import {Bottle} from '../components/Bottle';
import {KineticText} from '../components/KineticText';
import {LogoPlate} from '../components/LogoPlate';
import {OilDrop} from '../components/OilDrop';
import {PhotoWindow} from '../components/PhotoWindow';
import {SeedDrift, SeedRain} from '../components/Seeds';
import {Disc, Rule} from '../components/Shapes';
import {Stage} from '../components/Stage';
import {Shot, Wipe} from '../components/Transitions';
import {COLORS, OIL, SAFE, STORY_FRAMES, W} from '../theme';

// Cuts (global frames). Each wipe fully covers the frame on its cut.
const CUT = [0, 78, 163, 226, STORY_FRAMES];
const len = (i: number) => CUT[i + 1] - CUT[i];

export const Story01: React.FC = () => (
  <Stage>
    {/* 1. Seeds rain down: СЫРОДАВЛЕННОЕ МАСЛО */}
    <Shot from={CUT[0]} dur={len(0)} camera={{zoom: [1, 1.07]}}>
      <SeedDrift count={22} seed="s1-back" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={9} opacity={0.6} />
      <SeedRain count={70} seed="s1-front" kinds={['sunflower', 'sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1330, 1760]} spread={34} />
      <Rule x={SAFE.side} y={640} w={W - SAFE.side * 2} at={2} color={COLORS.ink} from="center" />
      <KineticText
        top={690}
        lines={[
          {text: 'СЫРОДАВЛЕННОЕ', at: 8, size: 100},
          {text: 'МАСЛО', at: 20, size: 240, tracking: -0.035},
        ]}
      />
    </Shot>

    {/* 2. The bottle lands; a drop falls: из семян, холодным отжимом */}
    <Shot from={CUT[1]} dur={len(1)} camera={{zoom: [1, 1.05], driftY: [0, -24]}}>
      <Disc cx={W / 2} cy={1250} d={660} color={OIL.sun} at={2} ring={OIL.sun} />
      <SeedDrift count={9} seed="s1-orbit" kinds={['sunflower']} size={[30, 58]} speed={3} area={[60, 620, 1020, 1700]} />
      <Bottle asset={BOTTLES.sun} cx={W / 2} bottom={1680} height={940} landAt={18} />
      <KineticText
        top={262}
        lines={[
          {text: 'из семян,', at: 26, size: 112, font: 'bold', tracking: -0.02},
          {text: 'холодным', at: 34, size: 150, tracking: -0.03},
          {text: 'отжимом', at: 40, size: 150, tracking: -0.03, sound: false},
        ]}
      />
      <OilDrop x={962} fromY={790} toY={1680} formAt={42} impactAt={62} size={80} />
    </Shot>

    {/* 3. Lifestyle photo window: польза семян в каждой ложке */}
    <Shot from={CUT[2]} dur={len(2)} camera={{zoom: [1, 1.04]}}>
      <PhotoWindow src={PHOTOS.sunField} cx={W / 2} cy={770} height={1040} revealAt={0} dur={len(2)} ring={OIL.sun} />
      <KineticText
        top={1335}
        lines={[
          {text: 'польза семян', at: 9, size: 92, font: 'bold', tracking: -0.02},
          {text: 'в каждой ложке', at: 18, size: 92, tracking: -0.025, underline: OIL.peanut},
        ]}
      />
    </Shot>

    {/* 4. The lineup lands, then the logo */}
    <Shot from={CUT[3]} dur={len(3)} camera={{zoom: [1.02, 1]}}>
      <Bottle asset={BOTTLES.hemp} cx={262} bottom={1620} height={960} landAt={8} gain={0.6} fall={1300} tilt={-4} />
      <Bottle asset={BOTTLES.pumpkin} cx={818} bottom={1620} height={960} landAt={13} gain={0.6} fall={1300} tilt={5} />
      <Bottle asset={BOTTLES.sun} cx={540} bottom={1660} height={1040} landAt={18} gain={0.75} fall={1400} />
      <LogoPlate at={30} cy={410} width={720} />
    </Shot>

    <Wipe at={CUT[1]} color={OIL.sun} />
    <Wipe at={CUT[2]} color={COLORS.ink} accent={OIL.peanut} />
    <Wipe at={CUT[3]} color={OIL.peanut} accent={OIL.sun} />
  </Stage>
);
