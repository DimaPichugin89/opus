// A cut-out bottle that falls into place, squashes a touch on landing and knocks.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BottleAsset} from '../assets';
import {Sfx} from '../sfx';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Bottle: React.FC<{
  asset: BottleAsset;
  cx: number;
  bottom: number; // y of the base
  height: number;
  landAt: number;
  fall?: number; // px above the resting point where the fall starts
  fallFrames?: number;
  gain?: number;
  tilt?: number; // degrees at the start of the fall
}> = ({asset, cx, bottom, height, landAt, fall = 1400, fallFrames = 11, gain = 1, tilt = -6}) => {
  const f = useCurrentFrame();
  const width = (height * asset.w) / asset.h;
  const q = interpolate(f, [landAt - fallFrames, landAt], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const t = f - landAt;
  const squash = t >= 0 ? Math.exp(-t / 3.5) * Math.cos(t * 1.1) : 0;
  const y = -fall * (1 - q);
  const rot = tilt * (1 - q);
  const shadow = interpolate(q, [0.4, 1], [0, 1], clamp);
  const visible = f >= landAt - fallFrames;
  return (
    <>
      {visible ? (
        <>
      <div
        style={{
          position: 'absolute',
          left: cx - width * 0.85,
          top: bottom - 22,
          width: width * 1.7,
          height: 44,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(38,23,13,0.38), rgba(38,23,13,0))',
          opacity: shadow,
          transform: `scaleX(${0.6 + 0.4 * shadow})`,
        }}
      />
      <Img
        src={staticFile(asset.src)}
        style={{
          position: 'absolute',
          left: cx - width / 2,
          top: bottom - height,
          width,
          height,
          transform: `translateY(${y}px) rotate(${rot}deg) scale(${1 + 0.02 * squash}, ${1 - 0.035 * squash})`,
          transformOrigin: '50% 100%',
        }}
      />
        </>
      ) : null}
      <Sfx name="thud" at={landAt} gain={gain} />
    </>
  );
};
