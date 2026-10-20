// A lifestyle photo shown as an oval window: soft reveal, gentle push-in, a drawn ring.
// The photos are low-res oval crops, so the zoom stays light and the edge is a clean CSS ellipse.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PHOTO_ASPECT} from '../assets';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const PhotoWindow: React.FC<{
  src: string;
  cx: number;
  cy: number;
  height: number;
  revealAt: number;
  dur: number;
  zoom?: [number, number];
  ring?: string;
}> = ({src, cx, cy, height, revealAt, dur, zoom = [1.06, 1.13], ring}) => {
  const f = useCurrentFrame();
  const width = height * PHOTO_ASPECT;
  const open = interpolate(f, [revealAt, revealAt + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const push = interpolate(f, [revealAt, revealAt + dur], zoom, clamp);
  const draw = interpolate(f, [revealAt + 4, revealAt + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const rx = width / 2 + 22;
  const ry = height / 2 + 22;
  const perimeter = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  return (
    <>
      {ring ? (
        <svg style={{position: 'absolute', left: cx - rx - 10, top: cy - ry - 10, width: rx * 2 + 20, height: ry * 2 + 20}}>
          <path
            d={`M ${rx + 10} 10 A ${rx} ${ry} 0 1 1 ${rx + 10} ${2 * ry + 10} A ${rx} ${ry} 0 1 1 ${rx + 10} 10`}
            fill="none"
            stroke={ring}
            strokeWidth={5}
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter * (1 - draw)}
          />
        </svg>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: cx - width / 2,
          top: cy - height / 2,
          width,
          height,
          borderRadius: '50%',
          overflow: 'hidden',
          transform: `scale(${0.82 + 0.18 * open})`,
          opacity: open,
          boxShadow: '0 30px 60px rgba(38,23,13,0.18)',
        }}
      >
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', transform: `scale(${push})`}} />
      </div>
    </>
  );
};
