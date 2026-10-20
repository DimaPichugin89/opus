// Simple graphic accents drawn in code.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A colour disc that pops in behind the hero, with a thin concentric ring.
export const Disc: React.FC<{cx: number; cy: number; d: number; color: string; at: number; ring?: string}> = ({cx, cy, d, color, at, ring}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 14, stiffness: 120, mass: 0.8}});
  const r = spring({frame: f - at - 6, fps, config: {damping: 200}});
  return (
    <>
      <div style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', background: color, transform: `scale(${s})`}} />
      {ring ? (
        <div
          style={{
            position: 'absolute',
            left: cx - d / 2 - 40,
            top: cy - d / 2 - 40,
            width: d + 80,
            height: d + 80,
            borderRadius: '50%',
            border: `4px solid ${ring}`,
            transform: `scale(${0.85 + 0.15 * r})`,
            opacity: r,
          }}
        />
      ) : null}
    </>
  );
};

// A hairline that draws itself from one end.
export const Rule: React.FC<{x: number; y: number; w: number; at: number; color: string; thickness?: number; from?: 'left' | 'right' | 'center'}> = ({
  x,
  y,
  w,
  at,
  color,
  thickness = 4,
  from = 'left',
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: thickness,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: from === 'center' ? 'center' : `${from} center`,
      }}
    />
  );
};
