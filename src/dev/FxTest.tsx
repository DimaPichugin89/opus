// Dev check: every transition preset between alternating test scenes.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {StudioBottle} from '../components/StudioBottle';
import {bottleMask, card, flood, liquid, press, splash, whip, zoomThrough} from '../fx/presentations';
import {COLORS, OIL} from '../theme';

const A: React.FC<{n: number}> = ({n}) => (
  <AbsoluteFill style={{background: n % 2 ? COLORS.cream : OIL.linen, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: 'MasMedium', fontSize: 200, color: n % 2 ? COLORS.ink : COLORS.cream}}>{n}</div>
    <StudioBottle oil={n % 2 ? 'sun' : 'peanut'} x={540} bottom={1600} height={700} />
  </AbsoluteFill>
);

const FX = [liquid('a'), press('b'), splash(), bottleMask(), whip(1), zoomThrough(540, 800), card(), flood('c')];
export const FX_FRAMES = 40 * (FX.length + 1) - 24 * FX.length;

export const FxTest: React.FC = () => (
  <TransitionSeries>
    {FX.map((fx, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={40}>
          <A n={i} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fx} timing={linearTiming({durationInFrames: 24})} />
      </React.Fragment>
    ))}
    <TransitionSeries.Sequence durationInFrames={40}>
      <A n={FX.length} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
