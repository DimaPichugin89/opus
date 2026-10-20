// An amber oil drop: forms, falls, lands with a ripple and a soft plop.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../sfx';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const DropShape: React.FC<{size: number; stretch?: number}> = ({size, stretch = 1}) => (
  <svg viewBox="0 0 100 130" style={{width: size, height: size * 1.3, display: 'block', transform: `scaleY(${stretch})`, transformOrigin: '50% 100%'}}>
    <defs>
      <radialGradient id="dropFill" cx="38%" cy="62%" r="70%">
        <stop offset="0" stopColor="#FFD77A" />
        <stop offset="0.45" stopColor="#E9A525" />
        <stop offset="1" stopColor="#A85F08" />
      </radialGradient>
    </defs>
    <path d="M50 2 C50 2 90 56 90 86 A40 40 0 0 1 10 86 C10 56 50 2 50 2Z" fill="url(#dropFill)" />
    <ellipse cx="36" cy="80" rx="9" ry="15" fill="#fff" fillOpacity="0.55" transform="rotate(18 36 80)" />
  </svg>
);

export const OilDrop: React.FC<{
  x: number;
  fromY: number;
  toY: number;
  formAt: number;
  impactAt: number;
  size?: number;
}> = ({x, fromY, toY, formAt, impactAt, size = 64}) => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [formAt, formAt + 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const fallStart = formAt + 9;
  const q = interpolate(f, [fallStart, impactAt], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const y = fromY + (toY - fromY) * q;
  const stretch = 1 + 0.25 * q;
  const t = f - impactAt;
  const ripple = interpolate(t, [0, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <>
      {f >= formAt && t < 0 ? (
        <div style={{position: 'absolute', left: x - size / 2, top: y - size * 1.3, transform: `scale(${grow})`, transformOrigin: '50% 0%'}}>
          <DropShape size={size} stretch={stretch} />
        </div>
      ) : null}
      {t >= 0 && t < 20 ? (
        <svg style={{position: 'absolute', left: x - 200, top: toY - 120, width: 400, height: 160, overflow: 'visible'}}>
          {[0, 1].map((k) => {
            const rr = Math.max(0, ripple - k * 0.25);
            return (
              <ellipse key={k} cx={200} cy={120} rx={20 + 150 * rr} ry={(20 + 150 * rr) * 0.2} fill="none" stroke="#C9821A" strokeWidth={5 * (1 - rr)} opacity={1 - rr} />
            );
          })}
          {[-1, -0.4, 0.4, 1].map((d, k) => {
            const tt = t / 12;
            const px = 200 + d * 70 * tt;
            const py = 120 - (90 - k * 10) * tt + 160 * tt * tt;
            return tt < 1 ? <circle key={k} cx={px} cy={py} r={7 - 3 * tt} fill="#E9A525" /> : null;
          })}
        </svg>
      ) : null}
      <Sfx name="plop" at={impactAt} />
    </>
  );
};
