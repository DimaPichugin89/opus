// Press transition: two rounded stainless plates close on the frame and squash the outgoing shot,
// oil bursts out of the seam, then the plates part to reveal the next shot with oil still
// hanging from their edges. The plates meet (frame fully covered) exactly at `at`.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Sfx} from '../sfx';
import {COLORS, H, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const MID = H / 2;
const SLAB = 1200;

// Position of the top plate's lower edge and the bottom plate's upper edge.
export const jawEdges = (f: number, at: number, close = 14, open = 16) => {
  const c = interpolate(f, [at - close, at], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const o = interpolate(f, [at, at + open], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const closed = f < at ? c : 1 - o;
  return {top: -60 + (MID + 60) * closed, bottom: H + 60 - (MID + 60) * closed, closed};
};

// Wrap a shot's content so it is squashed by the closing plates (before `at`)
// or springs back out of the seam as they part (after `at`).
export const PressSquash: React.FC<{at: number; mode: 'squash' | 'release'; children: React.ReactNode}> = ({at, mode, children}) => {
  const f = useCurrentFrame();
  const {top, bottom} = jawEdges(f, at);
  const ratio = Math.max(0.02, (bottom - top) / H);
  const sy = mode === 'squash' ? Math.min(1, ratio + 0.06) : 0.7 + 0.3 * Math.min(1, ratio);
  const sx = mode === 'squash' ? 1 + 0.12 * (1 - sy) : 1;
  return <AbsoluteFill style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>;
};

const Slab: React.FC<{edge: number; side: 'top' | 'bottom'}> = ({edge, side}) => {
  const y = side === 'top' ? edge - SLAB : edge;
  const lip = side === 'top' ? SLAB - 26 : 8;
  return (
    <g>
      <rect x={-80} y={y} width={W + 160} height={SLAB} rx={70} fill={`url(#steel-${side})`} />
      <rect x={60} y={y + lip} width={W - 120} height={14} rx={7} fill="#FFFFFF" opacity={0.7} />
    </g>
  );
};

export const PressJaws: React.FC<{at: number; seed: string}> = ({at, seed}) => {
  const f = useCurrentFrame();
  const {top, bottom} = jawEdges(f, at);
  const visible = f >= at - 14 && f <= at + 22;
  const t = f - at;
  // Oil: sprays sideways from the seam, stretches in strands as the plates part, then hangs from both edges.
  const sprays = new Array(10).fill(0).map((_, k) => ({
    side: k % 2 ? 1 : -1,
    v: 18 + random(`${seed}-v${k}`) * 26,
    lift: (random(`${seed}-l${k}`) - 0.5) * 14,
    r: 10 + random(`${seed}-r${k}`) * 16,
  }));
  // Viscous strands stretched between the plates as they part.
  const strands = new Array(5).fill(0).map((_, k) => ({x: 110 + k * 215 + random(`${seed}-sx${k}`) * 70, w: 18 + random(`${seed}-sw${k}`) * 16, sag: random(`${seed}-sg${k}`) * 6}));
  const drips = new Array(6).fill(0).map((_, k) => ({x: 90 + k * 180 + random(`${seed}-dx${k}`) * 60, len: 30 + random(`${seed}-dl${k}`) * 60}));
  return (
    <>
      {visible ? (
        <AbsoluteFill style={{pointerEvents: 'none', zIndex: 60}}>
          <svg width={W} height={H}>
            <defs>
              <linearGradient id="steel-top" gradientUnits="userSpaceOnUse" x1="0" y1={top - 700} x2="0" y2={top}>
                <stop offset="0" stopColor={COLORS.steelLight} />
                <stop offset="0.82" stopColor={COLORS.steel} />
                <stop offset="1" stopColor={COLORS.steelDeep} />
              </linearGradient>
              <linearGradient id="steel-bottom" gradientUnits="userSpaceOnUse" x1="0" y1={bottom} x2="0" y2={bottom + 700}>
                <stop offset="0" stopColor={COLORS.steelDeep} />
                <stop offset="0.18" stopColor={COLORS.steel} />
                <stop offset="1" stopColor={COLORS.steelLight} />
              </linearGradient>
              <filter id={`goo-${seed}`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
                <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
              </filter>
            </defs>
            <Slab edge={top} side="top" />
            <Slab edge={bottom} side="bottom" />
            <g filter={`url(#goo-${seed})`} fill={COLORS.amberLight}>
              {t >= 0 && t < 10
                ? strands.map((st, k) => {
                    // A strand necks in the middle, snaps, and both halves pull back to their plate.
                    const snap = Math.min(1, t / (6 + st.sag * 0.4));
                    const half = ((bottom - top) / 2 + 10) * (1 - snap * snap);
                    const w = st.w * (1 - 0.5 * snap);
                    return half > 4 ? (
                      <g key={k}>
                        <rect x={st.x - w / 2} y={top - 10} width={w} height={half} rx={w / 2} />
                        <rect x={st.x - w / 2} y={bottom + 10 - half} width={w} height={half} rx={w / 2} />
                      </g>
                    ) : null;
                  })
                : null}
              {t > -3 && t < 12
                ? sprays.map((s, k) => {
                    const tt = Math.max(0, t + 3);
                    return <circle key={k} cx={W / 2 + s.side * (W * 0.35 + s.v * tt)} cy={MID + s.lift * tt + 0.9 * tt * tt} r={s.r} />;
                  })
                : null}
              {t > 0
                ? drips.map((d, k) => {
                    const len = d.len * Math.min(1, t / 14);
                    return (
                      <g key={k}>
                        <rect x={d.x - 16} y={top - 30} width={32} height={30 + len} rx={16} />
                        <circle cx={d.x} cy={top + len} r={20} />
                        <rect x={d.x + 60 - 20} y={bottom - 22} width={70} height={40} rx={20} />
                      </g>
                    );
                  })
                : null}
            </g>
          </svg>
        </AbsoluteFill>
      ) : null}
      <Sfx name="squeeze" at={at - 18} />
    </>
  );
};
