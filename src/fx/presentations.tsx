// Transition presets for TransitionSeries. Each one carries its own sound, played on the
// entering side so it is counted once. "Cover" presets hide the cut under an overlay that
// fully covers the frame at progress 0.5, where the incoming scene switches on.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {BOTTLE_BODY_Y, BOTTLE_OUTLINE} from './bottleShape';
import {Sfx, SfxName} from '../sfx';
import {COLORS, H, W} from '../theme';

type P = TransitionPresentationComponentProps<Record<string, unknown>>;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

// All presets share one type so they can be mixed in a list or a ternary.
export type Fx = TransitionPresentation<Record<string, unknown>>;
const make = <T extends Record<string, unknown>>(component: React.FC<TransitionPresentationComponentProps<T>>, props: T): Fx =>
  ({component, props}) as unknown as Fx;

// Sound placed relative to the start of the transition, only once.
const Cue: React.FC<{dir: P['presentationDirection']; name: SfxName; at?: number; gain?: number}> = ({dir, name, at = 0, gain}) =>
  dir === 'entering' ? <Sfx name={name} at={at} gain={gain} /> : null;

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

const OilDefs: React.FC<{id: string; y0: number; y1: number}> = ({id, y0, y1}) => (
  <defs>
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y0} x2="0" y2={y1}>
      <stop offset="0" stopColor={COLORS.amberLight} />
      <stop offset="0.2" stopColor={COLORS.amber} />
      <stop offset="0.85" stopColor={COLORS.amber} />
      <stop offset="1" stopColor={COLORS.amberLight} />
    </linearGradient>
    <filter id={`${id}-soft`}>
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);

// 1. Oil flows down the frame with rounded drips on its leading edge.
const THICK = 2400;
const Liquid: React.FC<TransitionPresentationComponentProps<{seed: string; up?: boolean}>> = ({children, presentationProgress: p, presentationDirection: dir, presentationDurationInFrames: d, passedProps}) => {
  const {seed, up = false} = passedProps;
  const pe = ease(p);
  const t = p * d;
  const lead = -150 + pe * (H + THICK + 300);
  const trail = lead - THICK;
  const drips = new Array(7).fill(0).map((_, k) => ({x: 60 + random(`${seed}x${k}`) * (W - 120), w: 22 + random(`${seed}w${k}`) * 30, d: 60 + random(`${seed}d${k}`) * 220}));
  const xs = new Array(45).fill(0).map((_, i) => -40 + (i / 44) * (W + 80));
  const leadY = (x: number) => lead + 24 * Math.sin(x / 150 + t * 0.22) + 12 * Math.sin(x / 61 - t * 0.37) + drips.reduce((s, r) => s + r.d * (0.3 + 0.7 * pe) * Math.exp(-(((x - r.x) / r.w) ** 2)), 0);
  const trailY = (x: number) => trail + 28 * Math.sin(x / 170 - t * 0.2) + 14 * Math.sin(x / 73 + t * 0.31);
  const leadPts = xs.map((x) => [x, leadY(x)] as [number, number]);
  const body = `${smoothPath(xs.map((x) => [x, trailY(x)] as [number, number]))} L ${W + 40} ${leadY(W + 40)} ${smoothPath([...leadPts].reverse()).replace(/^M/, 'L')} Z`;
  if (dir === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: pe >= 0.5 ? 1 : 0}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{transform: up ? 'scaleY(-1)' : undefined}}>
        <svg width={W} height={H}>
          <OilDefs id={`lq-${seed}`} y0={lead} y1={trail} />
          <path d={body} fill={`url(#lq-${seed})`} />
          <path d={smoothPath(leadPts.map(([x, y]) => [x, y - 34]))} fill="none" stroke="#FFF3D6" strokeOpacity={0.45} strokeWidth={12} strokeLinecap="round" filter={`url(#lq-${seed}-soft)`} />
        </svg>
      </AbsoluteFill>
      <Cue dir={dir} name="pour" at={Math.round(d * 0.08)} gain={0.85} />
    </AbsoluteFill>
  );
};
export const liquid = (seed: string, up = false) => make(Liquid, {seed, up});

// 2. Stainless press plates close on the frame, oil sprays from the seam, strands stretch as they part.
const SLAB = 1300;
const Press: React.FC<TransitionPresentationComponentProps<{seed: string}>> = ({children, presentationProgress: p, presentationDirection: dir, passedProps: {seed}}) => {
  const closed = p < 0.5 ? Easing.in(Easing.cubic)(p / 0.5) : 1 - Easing.out(Easing.cubic)((p - 0.5) / 0.5);
  const mid = H / 2;
  const top = -60 + (mid + 60) * closed;
  const bottom = H + 60 - (mid + 60) * closed;
  const gap = Math.max(0.02, (bottom - top) / H);
  const after = p - 0.5;
  if (dir === 'exiting') {
    const sy = p < 0.5 ? Math.min(1, gap + 0.05) : 0.02;
    return <AbsoluteFill style={{transform: `scale(${1 + 0.12 * (1 - sy)}, ${sy})`}}>{children}</AbsoluteFill>;
  }
  const strands = new Array(5).fill(0).map((_, k) => ({x: 110 + k * 215 + random(`${seed}s${k}`) * 70, w: 18 + random(`${seed}sw${k}`) * 16}));
  const sprays = new Array(10).fill(0).map((_, k) => ({side: k % 2 ? 1 : -1, v: 0.5 + random(`${seed}v${k}`), lift: random(`${seed}l${k}`) - 0.5, r: 10 + random(`${seed}r${k}`) * 16}));
  const snap = Math.min(1, Math.max(0, after) / 0.32);
  const slab = (edge: number, side: 'top' | 'bottom') => (
    <g>
      <rect x={-80} y={side === 'top' ? edge - SLAB : edge} width={W + 160} height={SLAB} rx={70} fill={`url(#st-${side})`} />
      <rect x={60} y={side === 'top' ? edge - 26 : edge + 8} width={W - 120} height={14} rx={7} fill="#fff" opacity={0.7} />
    </g>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: p >= 0.5 ? 1 : 0, transform: `scaleY(${p >= 0.5 ? 0.7 + 0.3 * Math.min(1, gap) : 1})`}}>{children}</AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="st-top" gradientUnits="userSpaceOnUse" x1="0" y1={top - 700} x2="0" y2={top}>
            <stop offset="0" stopColor={COLORS.steelLight} />
            <stop offset="0.82" stopColor={COLORS.steel} />
            <stop offset="1" stopColor={COLORS.steelDeep} />
          </linearGradient>
          <linearGradient id="st-bottom" gradientUnits="userSpaceOnUse" x1="0" y1={bottom} x2="0" y2={bottom + 700}>
            <stop offset="0" stopColor={COLORS.steelDeep} />
            <stop offset="0.18" stopColor={COLORS.steel} />
            <stop offset="1" stopColor={COLORS.steelLight} />
          </linearGradient>
          <filter id={`goo-${seed}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
        {slab(top, 'top')}
        {slab(bottom, 'bottom')}
        <g filter={`url(#goo-${seed})`} fill={COLORS.amberLight}>
          {after > -0.04 && after < 0.25
            ? sprays.map((s, k) => {
                const tt = Math.max(0, after + 0.04) * 40;
                return <circle key={k} cx={W / 2 + s.side * (W * 0.35 + s.v * 26 * tt)} cy={mid + s.lift * 14 * tt + 0.9 * tt * tt} r={s.r} />;
              })
            : null}
          {after >= 0 && snap < 1
            ? strands.map((s, k) => {
                const half = ((bottom - top) / 2 + 10) * (1 - snap * snap);
                const w = s.w * (1 - 0.5 * snap);
                return (
                  <g key={k}>
                    <rect x={s.x - w / 2} y={top - 10} width={w} height={half} rx={w / 2} />
                    <rect x={s.x - w / 2} y={bottom + 10 - half} width={w} height={half} rx={w / 2} />
                  </g>
                );
              })
            : null}
        </g>
      </svg>
      <Cue dir={dir} name="squeeze" at={0} />
    </AbsoluteFill>
  );
};
export const press = (seed: string) => make(Press, {seed});

// 3. A drop falls to the centre, its splash floods the frame, the next scene opens from the centre.
const Splash: React.FC<TransitionPresentationComponentProps<{x: number; y: number}>> = ({children, presentationProgress: p, presentationDirection: dir, presentationDurationInFrames: d, passedProps: {x, y}}) => {
  if (dir === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 80;
  const fall = interpolate(p, [0, 0.28], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const flood = interpolate(p, [0.28, 0.5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const open = interpolate(p, [0.5, 1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const dropY = -120 + (y + 120) * fall;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: p >= 0.5 ? 1 : 0, clipPath: `circle(${open * R}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <OilDefs id="sp" y0={y - R} y1={y + R} />
        {p < 0.28 ? (
          <g transform={`translate(${x} ${dropY})`}>
            <path d="M 0 -120 C 10 -90 46 -60 46 -38 A 46 46 0 1 1 -46 -38 C -46 -60 -10 -90 0 -120 Z" fill={COLORS.amber} />
            <ellipse cx={-14} cy={-46} rx={9} ry={16} fill="#fff" opacity={0.55} />
          </g>
        ) : null}
        {p >= 0.28 ? (
          <path
            fillRule="evenodd"
            fill={COLORS.amber}
            d={`M ${x - R * flood} ${y} a ${R * flood} ${R * flood} 0 1 0 ${2 * R * flood} 0 a ${R * flood} ${R * flood} 0 1 0 ${-2 * R * flood} 0 Z ${open > 0 ? `M ${x - R * open} ${y} a ${R * open} ${R * open} 0 1 0 ${2 * R * open} 0 a ${R * open} ${R * open} 0 1 0 ${-2 * R * open} 0 Z` : ''}`}
          />
        ) : null}
        {open > 0 && open < 1 ? <circle cx={x} cy={y} r={R * open + 18} fill="none" stroke={COLORS.amberLight} strokeWidth={22} opacity={0.8} /> : null}
      </svg>
      <Cue dir={dir} name="plop" at={Math.round(d * 0.28)} />
    </AbsoluteFill>
  );
};
export const splash = (x = W / 2, y = H * 0.5) => make(Splash, {x, y});

// 4. The next scene opens inside the bottle silhouette, which grows until its label fills the frame.
const BottleMask: React.FC<P> = ({children, presentationProgress: p, presentationDirection: dir}) => {
  const pe = Easing.in(Easing.exp)(p);
  if (dir === 'exiting') return <AbsoluteFill style={{transform: `scale(${1 + 0.15 * pe})`, filter: `brightness(${1 - 0.35 * pe})`}}>{children}</AbsoluteFill>;
  const h = 520 + pe * 11000;
  const w = h * 0.2527;
  const x0 = W / 2 - w / 2;
  const y0 = H / 2 - BOTTLE_BODY_Y * h;
  const poly = BOTTLE_OUTLINE.map(([x, y]) => `${(x0 + x * w).toFixed(1)}px ${(y0 + y * h).toFixed(1)}px`).join(', ');
  const enter = interpolate(p, [0, 0.15], [0, 1], clamp);
  return (
    <AbsoluteFill style={{clipPath: `polygon(${poly})`, opacity: enter}}>
      <AbsoluteFill style={{transform: `scale(${1.25 - 0.25 * pe})`}}>{children}</AbsoluteFill>
      <Cue dir={dir} name="swish" at={0} gain={0.8} />
    </AbsoluteFill>
  );
};
export const bottleMask = () => make(BottleMask, {});

// 5. Whip pan: both scenes rush sideways with a directional smear.
const Whip: React.FC<TransitionPresentationComponentProps<{dir: 1 | -1}>> = ({children, presentationProgress: p, presentationDirection: d, passedProps}) => {
  const s = passedProps.dir;
  const pe = Easing.inOut(Easing.quad)(p);
  const speed = Math.sin(Math.PI * p);
  const x = d === 'exiting' ? -s * pe * W * 1.1 : s * (1 - pe) * W * 1.1;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px) skewX(${-s * speed * 6}deg)`, filter: `blur(${speed * 18}px)`}}>
      {children}
      <Cue dir={d} name="swish" at={0} />
    </AbsoluteFill>
  );
};
export const whip = (dir: 1 | -1 = 1) => make(Whip, {dir});

// 6. Zoom through: the camera flies into the outgoing scene and settles into the next one.
const Zoom: React.FC<TransitionPresentationComponentProps<{x: number; y: number}>> = ({children, presentationProgress: p, presentationDirection: d, passedProps: {x, y}}) => {
  const pe = Easing.inOut(Easing.cubic)(p);
  const style: React.CSSProperties =
    d === 'exiting'
      ? {transform: `scale(${1 + pe * 3.5})`, transformOrigin: `${x}px ${y}px`, opacity: 1 - interpolate(p, [0.35, 0.65], [0, 1], clamp), filter: `blur(${pe * 14}px)`}
      : {transform: `scale(${1.35 - 0.35 * pe})`, opacity: interpolate(p, [0.35, 0.65], [0, 1], clamp), filter: `blur(${(1 - pe) * 10}px)`};
  return (
    <AbsoluteFill style={style}>
      {children}
      <Cue dir={d} name="swish" at={0} gain={0.7} />
    </AbsoluteFill>
  );
};
export const zoomThrough = (x = W / 2, y = H / 2) => make(Zoom, {x, y});

// 7. Card stack: the next scene slides up as a rounded card over the receding one.
const Card: React.FC<P> = ({children, presentationProgress: p, presentationDirection: d}) => {
  const pe = Easing.out(Easing.cubic)(p);
  if (d === 'exiting') return <AbsoluteFill style={{transform: `scale(${1 - 0.1 * pe})`, filter: `brightness(${1 - 0.25 * pe})`, borderRadius: 60 * pe, overflow: 'hidden'}}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - pe) * H}px)`, borderRadius: 60 * (1 - pe), overflow: 'hidden', boxShadow: '0 -30px 80px rgba(38,23,13,0.35)'}}>
      {children}
      <Cue dir={d} name="tap" at={0} />
    </AbsoluteFill>
  );
};
export const card = () => make(Card, {});

// 8. Oil flood: oil rises from the bottom (a liquid wipe flipped upward).
export const flood = (seed: string) => liquid(seed, true);
