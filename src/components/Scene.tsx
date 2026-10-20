// A calm scene inside a story: fades and rises in, holds, then fades and lifts out.
// Neighbouring scenes overlap by OVERLAP frames so one dissolves into the next.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';

export const OVERLAP = 12;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Fade: React.FC<{dur: number; first: boolean; last: boolean; children: React.ReactNode}> = ({dur, first, last, children}) => {
  const f = useCurrentFrame();
  // The outgoing scene is gone before the incoming one is more than faintly visible.
  const inP = first ? 1 : interpolate(f, [OVERLAP - 4, OVERLAP + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const outP = last ? 1 : interpolate(f, [dur - OVERLAP - 2, dur - 2], [1, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const drift = interpolate(f, [0, dur], [0, -18], clamp);
  return (
    <AbsoluteFill style={{opacity: Math.min(inP, outP), transform: `translateY(${(1 - inP) * 36 - (1 - outP) * 36 + drift}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

// Lay out scenes back to back from their durations (seconds); returns [from, dur] in frames.
export const sceneTimes = (seconds: number[], fps = 30): [number, number][] => {
  let t = 0;
  return seconds.map((s, i) => {
    const dur = Math.round(s * fps) + (i < seconds.length - 1 ? OVERLAP : 0);
    const out: [number, number] = [t, dur];
    t += Math.round(s * fps);
    return out;
  });
};

export const Scene: React.FC<{at: [number, number]; first?: boolean; last?: boolean; children: React.ReactNode}> = ({at, first = false, last = false, children}) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    <Fade dur={at[1]} first={first} last={last}>
      {children}
    </Fade>
  </Sequence>
);
