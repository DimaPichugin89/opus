// Shot plumbing: a camera that settles on entry and drifts, and a band wipe that hides the cut.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Sfx, WHOOSH_LEAD} from '../sfx';
import {COLORS, H} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Camera: React.FC<{
  dur: number;
  zoom?: [number, number];
  driftY?: [number, number];
  driftX?: [number, number];
  children: React.ReactNode;
}> = ({dur, zoom = [1, 1.05], driftY = [0, 0], driftX = [0, 0], children}) => {
  const f = useCurrentFrame();
  const settle = interpolate(f, [0, 12], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const scale = interpolate(f, [0, dur], zoom, clamp) * (1 + 0.06 * settle);
  const y = interpolate(f, [0, dur], driftY, clamp) + 70 * settle;
  const x = interpolate(f, [0, dur], driftX, clamp);
  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 55%'}}>
      {children}
    </AbsoluteFill>
  );
};

export const Shot: React.FC<{
  from: number;
  dur: number;
  bg?: string;
  camera?: Omit<React.ComponentProps<typeof Camera>, 'dur' | 'children'>;
  children: React.ReactNode;
}> = ({from, dur, bg = COLORS.cream, camera, children}) => (
  <Sequence from={from} durationInFrames={dur}>
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <Camera dur={dur} {...camera}>
        {children}
      </Camera>
    </AbsoluteFill>
  </Sequence>
);

// A skewed colour band sweeps bottom->top; it fully covers the frame exactly at `at`,
// which is where the outgoing shot's Sequence ends and the next one starts.
const BAND = 2600;
export const Wipe: React.FC<{at: number; color: string; accent?: string; dur?: number}> = ({
  at,
  color,
  accent = COLORS.ink,
  dur = 16,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at - dur / 2, at + dur / 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const pa = interpolate(f, [at - dur / 2 - 2, at + dur / 2 - 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const visible = f >= at - dur / 2 - 3 && f <= at + dur / 2 + 1;
  const top = H - p * (H + BAND);
  const accentTop = H - pa * (H + BAND);
  return (
    <>
      {visible ? (
        <AbsoluteFill style={{pointerEvents: 'none', zIndex: 50}}>
          <div style={{position: 'absolute', left: -200, right: -200, top: accentTop - 70, height: 90, background: accent, transform: 'skewY(-7deg)'}} />
          <div style={{position: 'absolute', left: -200, right: -200, top, height: BAND, background: color, transform: 'skewY(-7deg)'}} />
        </AbsoluteFill>
      ) : null}
      <Sfx name="whoosh" at={at - WHOOSH_LEAD} />
    </>
  );
};
