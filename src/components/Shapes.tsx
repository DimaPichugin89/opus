// Simple graphic accents drawn in code.
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

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
