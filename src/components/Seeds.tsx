// Seeds drawn in code: shapes for each crop, a rain that settles on a floor, and a slow drift.
import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

export type SeedKind = 'sunflower' | 'flax' | 'sesame' | 'pumpkin' | 'hemp';

// All shapes in a 40x80 box, pointing up.
export const SeedShape: React.FC<{kind: SeedKind; size: number}> = ({kind, size}) => {
  const w = size / 2;
  const box = {width: w, height: size, display: 'block' as const, overflow: 'visible' as const};
  switch (kind) {
    case 'sunflower':
      return (
        <svg viewBox="0 0 40 80" style={box}>
          <path d="M20 1 C33 10 39 38 34 60 C31 74 25 79 20 79 C15 79 9 74 6 60 C1 38 7 10 20 1Z" fill="#2B2724" />
          <path d="M20 6 L20 74 M13 14 C10 34 10 54 13 70 M27 14 C30 34 30 54 27 70" stroke="#CFC7BB" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M14 18 C12 30 12 40 13 48" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'flax':
      return (
        <svg viewBox="0 0 40 80" style={box}>
          <path d="M20 4 C32 16 36 44 30 64 C27 73 23 76 20 76 C17 76 13 73 10 64 C4 44 8 16 20 4Z" fill="#8E5326" />
          <path d="M15 22 C13 34 13 44 15 54" stroke="#F5C48A" strokeOpacity="0.7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'sesame':
      return (
        <svg viewBox="0 0 40 80" style={box}>
          <path d="M20 6 C33 18 37 44 31 62 C28 71 24 74 20 74 C16 74 12 71 9 62 C3 44 7 18 20 6Z" fill="#EEDFBE" stroke="#C7AF80" strokeWidth="2" />
          <path d="M20 14 L20 66" stroke="#D2BC8F" strokeWidth="1.5" />
        </svg>
      );
    case 'pumpkin':
      return (
        <svg viewBox="0 0 40 80" style={box}>
          <path d="M20 2 C36 12 39 46 33 64 C30 74 25 78 20 78 C15 78 10 74 7 64 C1 46 4 12 20 2Z" fill="#B7BE83" />
          <path d="M20 7 C32 16 34 46 29 62 C27 70 23 73 20 73 C17 73 13 70 11 62 C6 46 8 16 20 7Z" fill="#6F7D43" />
        </svg>
      );
    case 'hemp':
      return (
        <svg viewBox="0 0 40 80" style={box}>
          <ellipse cx="20" cy="40" rx="18" ry="24" fill="#A08C6C" />
          <path d="M8 34 C14 30 18 38 24 33 C28 30 30 36 33 34 M9 46 C15 42 19 50 25 45 C29 42 31 48 32 46" stroke="#6A5A42" strokeWidth="1.8" fill="none" />
          <ellipse cx="13" cy="30" rx="4" ry="7" fill="#fff" fillOpacity="0.22" />
        </svg>
      );
  }
};

const pick = <T,>(arr: T[], r: number) => arr[Math.floor(r * arr.length) % arr.length];

// Seeds fall from above and come to rest between floor[0] and floor[1].
export const SeedRain: React.FC<{
  count: number;
  seed: string;
  kinds: SeedKind[];
  floor: [number, number];
  start?: number;
  spread?: number; // frames over which seeds start falling
  size?: [number, number];
}> = ({count, seed, kinds, floor, start = 0, spread = 30, size = [48, 72]}) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const s0 = start + r('s') * spread;
        const dur = 14 + r('d') * 10;
        const x = 30 + r('x') * (W - 60);
        const yEnd = floor[0] + r('y') ** 0.7 * (floor[1] - floor[0]);
        const sz = size[0] + r('z') * (size[1] - size[0]);
        const rot0 = r('r0') * 360;
        const rot1 = rot0 + (r('r1') - 0.5) * 220;
        const p = interpolate(f, [s0, s0 + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
        if (p <= 0) return null;
        const after = Math.max(0, f - (s0 + dur));
        const bounce = after > 0 ? Math.abs(Math.sin(after * 0.55)) * Math.exp(-after / 3) * 22 : 0;
        const y = -160 + (yEnd + 160) * p - bounce;
        // Back seeds (smaller) sit lower in z: lighter and slightly soft.
        const depth = (sz - size[0]) / (size[1] - size[0] || 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${rot0 + (rot1 - rot0) * p}deg)`,
              filter: `drop-shadow(0 ${4 + depth * 6}px ${4 + depth * 4}px rgba(38,23,13,0.25))`,
              zIndex: Math.round(depth * 10),
            }}
          >
            <SeedShape kind={pick(kinds, r('k'))} size={sz} />
          </div>
        );
      })}
    </>
  );
};

// Seeds that drift slowly through the frame at different depths: parallax layer.
export const SeedDrift: React.FC<{
  count: number;
  seed: string;
  kinds: SeedKind[];
  size?: [number, number];
  speed?: number; // px per frame for the nearest layer
  blur?: 'far' | 'near' | false; // which depth gets defocused
  area?: [number, number, number, number]; // x0, y0, x1, y1
  opacity?: number;
}> = ({count, seed, kinds, size = [26, 60], speed = 6, blur = 'far', area = [0, 0, W, H], opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const depth = r('z');
        const sz = size[0] + depth * (size[1] - size[0]);
        const v = speed * (0.35 + 0.65 * depth);
        const span = area[3] - area[1] + 300;
        const y = area[3] + 150 - ((r('y') * span + f * v) % span);
        const x = area[0] + r('x') * (area[2] - area[0]) + Math.sin(f / 18 + r('p') * 6) * 14;
        const rot = r('r') * 360 + f * (r('w') - 0.5) * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              opacity: opacity * (0.45 + 0.55 * depth),
              filter: blur ? `blur(${blur === 'far' ? (1 - depth) * 3 : 2 + depth * 7}px)` : undefined,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            }}
          >
            <SeedShape kind={pick(kinds, r('k'))} size={sz} />
          </div>
        );
      })}
    </>
  );
};
