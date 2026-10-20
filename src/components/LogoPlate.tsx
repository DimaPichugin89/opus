// Logo reveal: the mark wipes in left to right with hairlines and a warm chord; optional caption.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOGO} from '../assets';
import {Sfx} from '../sfx';
import {COLORS, FONT, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const LogoPlate: React.FC<{
  at: number;
  cy: number;
  width?: number;
  variant?: keyof Omit<typeof LOGO, 'aspect'>;
  lineColor?: string;
  caption?: string;
  captionColor?: string;
}> = ({at, cy, width = 620, variant = 'black', lineColor = COLORS.ink, caption, captionColor = COLORS.ink}) => {
  const f = useCurrentFrame();
  const height = width / LOGO.aspect;
  const wipe = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const rise = interpolate(f, [at, at + 14], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const lines = interpolate(f, [at + 4, at + 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const capAt = at + 12;
  const cap = interpolate(f, [capAt, capAt + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const ruleY = cy + height / 2 + 34;
  return (
    <>
      <Img
        src={staticFile(LOGO[variant])}
        style={{
          position: 'absolute',
          left: (W - width) / 2,
          top: cy - height / 2,
          width,
          height,
          clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
          transform: `translateY(${rise}px)`,
        }}
      />
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            top: ruleY,
            left: W / 2 + (side > 0 ? 0 : -width / 2),
            width: width / 2,
            height: 4,
            background: lineColor,
            transform: `scaleX(${lines})`,
            transformOrigin: side > 0 ? 'left center' : 'right center',
          }}
        />
      ))}
      {caption ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: ruleY + 30,
              left: 0,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.bold,
              fontSize: 64,
              letterSpacing: '-0.01em',
              color: captionColor,
              opacity: cap,
              transform: `translateY(${(1 - cap) * 20}px)`,
            }}
          >
            {caption}
          </div>
          <Sfx name="tap" at={capAt} />
        </>
      ) : null}
      <Sfx name="chord" at={at} />
    </>
  );
};
