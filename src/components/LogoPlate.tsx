// Logo reveal: the mark wipes in left to right with a warm chord; optional caption.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {LOGO} from '../assets';
import {Sfx} from '../sfx';
import {COLORS, FONT, TYPE, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const LogoPlate: React.FC<{
  at: number;
  cy: number;
  width?: number;
  variant?: keyof Omit<typeof LOGO, 'aspect'>;
  caption?: string;
  captionColor?: string;
}> = ({at, cy, width = 620, variant = 'black', caption, captionColor = COLORS.ink}) => {
  const f = useCurrentFrame();
  const height = width / LOGO.aspect;
  const wipe = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const rise = interpolate(f, [at, at + 14], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const capAt = at + 12;
  const cap = interpolate(f, [capAt, capAt + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const captionY = cy + height / 2 + 36;
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
      {caption ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: captionY,
              left: 0,
              width: W,
              textAlign: 'center',
              fontFamily: FONT[TYPE.cta.font],
              fontSize: TYPE.cta.size,
              lineHeight: TYPE.cta.lineHeight,
              letterSpacing: `${TYPE.cta.tracking}em`,
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
