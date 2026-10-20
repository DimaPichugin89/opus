// Shared drawing kit for the infographic illustrations: one line weight, one oil, one steel.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

export const INK = COLORS.ink;
export const LINE = 6;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Illustrations can be played faster inside <TimeScale k>: their clock (useT) and their sounds (Sfx) scale together.
export const TimeScaleContext = React.createContext(1);
export const TimeScale: React.FC<{k: number; children: React.ReactNode}> = ({k, children}) => <TimeScaleContext.Provider value={k}>{children}</TimeScaleContext.Provider>;

// Local animation time helpers.
export const useT = (at = 0) => useCurrentFrame() * React.useContext(TimeScaleContext) - at;
export const ramp = (t: number, a: number, b: number, from = 0, to = 1, ease: (x: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], {...clamp, easing: ease});
export const usePop = (at: number, damping = 13) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, stiffness: 150, mass: 0.7}});
};

// An SVG canvas of size w x h whose centre sits at (cx, cy) in the frame.
export const Art: React.FC<{cx: number; cy: number; w: number; h: number; scale?: number; children: React.ReactNode}> = ({cx, cy, w, h, scale = 1, children}) => (
  <svg
    width={w}
    height={h}
    viewBox={`0 0 ${w} ${h}`}
    style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, overflow: 'visible', transform: `scale(${scale})`}}
  >
    <Defs />
    {children}
  </svg>
);

// Gradients every illustration can use by id.
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="k-oil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={COLORS.amberLight} />
      <stop offset="1" stopColor={COLORS.amber} />
    </linearGradient>
    <linearGradient id="k-steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={COLORS.steelDeep} />
      <stop offset="0.35" stopColor={COLORS.steelLight} />
      <stop offset="0.7" stopColor={COLORS.steel} />
      <stop offset="1" stopColor={COLORS.steelDeep} />
    </linearGradient>
    <linearGradient id="k-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
      <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.15" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.35" />
    </linearGradient>
    <linearGradient id="k-amber-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#5A2E0C" />
      <stop offset="0.3" stopColor="#9A5317" />
      <stop offset="0.55" stopColor="#7A3E10" />
      <stop offset="1" stopColor="#3E1E07" />
    </linearGradient>
    <linearGradient id="k-pale-oil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FBF1B8" />
      <stop offset="1" stopColor="#F1DD7A" />
    </linearGradient>
    <filter id="k-goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
      <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
    </filter>
  </defs>
);

// Oil surface: a gently moving wave that fills everything below `y` inside width w.
export const wavePath = (x0: number, w: number, y: number, bottom: number, t: number, amp = 8) =>
  `M ${x0} ${y} Q ${x0 + w * 0.25} ${y - amp * Math.sin(t / 6)} ${x0 + w * 0.5} ${y} T ${x0 + w} ${y} L ${x0 + w} ${bottom} L ${x0} ${bottom} Z`;

// A small oil drop in SVG coordinates, tip up, bottom centre at (x, y).
export const Drop: React.FC<{x: number; y: number; r: number; stretch?: number; fill?: string}> = ({x, y, r, stretch = 1, fill = 'url(#k-oil)'}) => (
  <g transform={`translate(${x} ${y}) scale(1 ${stretch})`}>
    <path d={`M 0 ${-r * 2.6} C ${r * 0.2} ${-r * 2} ${r} ${-r * 1.3} ${r} ${-r * 0.9} A ${r} ${r} 0 1 1 ${-r} ${-r * 0.9} C ${-r} ${-r * 1.3} ${-r * 0.2} ${-r * 2} 0 ${-r * 2.6} Z`} fill={fill} />
    <ellipse cx={-r * 0.35} cy={-r * 1.05} rx={r * 0.22} ry={r * 0.38} fill="#fff" opacity={0.55} />
  </g>
);

// A sunflower seed drawn in SVG coordinates (centre x, y; length len; rotation deg).
export const Seed: React.FC<{x: number; y: number; len: number; rot?: number; sy?: number}> = ({x, y, len, rot = 0, sy = 1}) => {
  const k = len / 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k} ${k * sy}) translate(-20 -40)`}>
      <path d="M20 1 C33 10 39 38 34 60 C31 74 25 79 20 79 C15 79 9 74 6 60 C1 38 7 10 20 1Z" fill="#2B2724" />
      <path d="M20 6 L20 74 M13 14 C10 34 10 54 13 70 M27 14 C30 34 30 54 27 70" stroke="#CFC7BB" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  );
};

// Thermometer with a numeric scale; value in °C animates the column.
export const Thermometer: React.FC<{x: number; y: number; h: number; value: number; max: number; marks: number[]; color?: string}> = ({x, y, h, value, max, marks, color = '#D9452B'}) => {
  const tube = 34;
  const level = (v: number) => y + h - (Math.min(v, max) / max) * (h - 40);
  return (
    <g>
      <rect x={x - tube / 2} y={y} width={tube} height={h} rx={tube / 2} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
      <circle cx={x} cy={y + h + 26} r={34} fill={color} stroke={INK} strokeWidth={LINE} />
      <rect x={x - 8} y={level(value)} width={16} height={y + h + 10 - level(value)} rx={8} fill={color} />
      {marks.map((m) => (
        <g key={m}>
          <rect x={x + tube / 2 + 6} y={level(m) - 3} width={22} height={6} rx={3} fill={INK} />
          <text x={x + tube / 2 + 40} y={level(m) + 14} fontFamily="MasRegular" fontSize={40} fill={INK}>
            {m} °C
          </text>
        </g>
      ))}
    </g>
  );
};

// Enlarge an illustration around its own centre line without touching its internals.
export const Grow: React.FC<{cy: number; s?: number; children: React.ReactNode}> = ({cy, s = 1.15, children}) => (
  <div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: `540px ${cy}px`}}>{children}</div>
);
