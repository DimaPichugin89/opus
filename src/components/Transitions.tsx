// Shot plumbing: a camera that settles on entry and drifts, and a liquid oil wipe that hides the cut.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame} from 'remotion';
import {POUR_LEAD, Sfx} from '../sfx';
import {COLORS, H, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Camera: React.FC<{
  dur: number;
  zoom?: [number, number];
  driftY?: [number, number];
  driftX?: [number, number];
  children: React.ReactNode;
}> = ({dur, zoom = [1, 1.05], driftY = [0, 0], driftX = [0, 0], children}) => {
  const f = useCurrentFrame();
  const settle = interpolate(f, [0, 14], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const scale = interpolate(f, [0, dur], zoom, clamp) * (1 + 0.05 * settle);
  const y = interpolate(f, [0, dur], driftY, clamp) + 50 * settle;
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

// Liquid wipe: a thick layer of oil flows down the frame. Its leading edge carries rounded
// drips, its trailing edge is a soft wave; it covers the whole frame exactly at `at`, which is
// where the outgoing shot's Sequence ends and the next one starts.
const THICK = 2400;
const SAMPLES = 44;

const smoothPath = (pts: [number, number][]) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q ${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
};

export const LiquidWipe: React.FC<{at: number; seed: string; light?: string; deep?: string; dur?: number}> = ({
  at,
  seed,
  light = COLORS.amberLight,
  deep = COLORS.amber,
  dur = 26,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at - dur / 2, at + dur / 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const visible = f >= at - dur / 2 && f <= at + dur / 2;
  const lead = -150 + p * (H + THICK + 300);
  const trail = lead - THICK;
  const drips = new Array(7).fill(0).map((_, k) => ({
    x: 60 + random(`${seed}-dx${k}`) * (W - 120),
    w: 22 + random(`${seed}-dw${k}`) * 30,
    d: 60 + random(`${seed}-dd${k}`) * 200,
  }));
  const xs = new Array(SAMPLES + 1).fill(0).map((_, i) => -40 + (i / SAMPLES) * (W + 80));
  const leadY = (x: number) =>
    lead +
    24 * Math.sin(x / 150 + f * 0.22) +
    12 * Math.sin(x / 61 - f * 0.37) +
    drips.reduce((s, dr) => s + dr.d * (0.3 + 0.7 * p) * Math.exp(-(((x - dr.x) / dr.w) ** 2)), 0);
  const trailY = (x: number) => trail + 28 * Math.sin(x / 170 - f * 0.2) + 14 * Math.sin(x / 73 + f * 0.31);
  const leadPts = xs.map((x) => [x, leadY(x)] as [number, number]);
  const trailPts = xs.map((x) => [x, trailY(x)] as [number, number]);
  const body = `${smoothPath(trailPts)} L ${W + 40} ${leadY(W + 40)} ${smoothPath([...leadPts].reverse()).replace(/^M/, 'L')} Z`;
  const gloss = smoothPath(leadPts.map(([x, y]) => [x, y - 34]));
  return (
    <>
      {visible ? (
        <AbsoluteFill style={{pointerEvents: 'none', zIndex: 50}}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <linearGradient id={`oil-${seed}`} gradientUnits="userSpaceOnUse" x1="0" y1={lead} x2="0" y2={trail}>
                <stop offset="0" stopColor={light} />
                <stop offset="0.18" stopColor={deep} />
                <stop offset="0.85" stopColor={deep} />
                <stop offset="1" stopColor={light} />
              </linearGradient>
              <filter id={`soft-${seed}`}>
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>
            <path d={body} fill={`url(#oil-${seed})`} />
            <path d={gloss} fill="none" stroke="#FFF3D6" strokeOpacity="0.45" strokeWidth="12" strokeLinecap="round" filter={`url(#soft-${seed})`} />
          </svg>
        </AbsoluteFill>
      ) : null}
      <Sfx name="pour" at={at - POUR_LEAD} />
    </>
  );
};
