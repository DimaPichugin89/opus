// Kinetic type: each word rises out of its own mask, one tap per phrase.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../sfx';
import {COLORS, FONT, SAFE, TYPE, W} from '../theme';

export type TextLine = {
  text: string;
  at: number;
  role?: keyof typeof TYPE;
  color?: string;
  stagger?: number; // frames between words
  sound?: boolean;
};

const Word: React.FC<{word: string; at: number}> = ({word, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 200, stiffness: 170, mass: 0.7}});
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', padding: '0.04em 0.03em 0.16em', margin: '-0.04em -0.03em -0.16em'}}>
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${(1 - p) * 110}%)`,
        }}
      >
        {word}
      </span>
    </span>
  );
};

const Line: React.FC<{line: TextLine}> = ({line}) => {
  const words = line.text.split(' ');
  const stagger = line.stagger ?? 3;
  const type = TYPE[line.role ?? 'lead'];
  return (
    <div
      style={{
        fontFamily: FONT[type.font],
        fontSize: type.size,
        lineHeight: type.lineHeight,
        letterSpacing: `${type.tracking}em`,
        color: line.color ?? COLORS.ink,
        whiteSpace: 'nowrap',
      }}
    >
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 ? ' ' : null}
          <Word word={w} at={line.at + i * stagger} />
        </React.Fragment>
      ))}
      {line.sound === false ? null : <Sfx name="tap" at={line.at} />}
    </div>
  );
};

export const KineticText: React.FC<{
  lines: TextLine[];
  top: number;
  out?: number; // frame at which the block leaves
  align?: 'center' | 'left';
  left?: number;
  width?: number;
}> = ({lines, top, out, align = 'center', left = SAFE.side, width = W - SAFE.side * 2}) => {
  const frame = useCurrentFrame();
  const leave = out === undefined ? 0 : interpolate(frame, [out, out + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        isolation: 'isolate',
        zIndex: 20,
        transform: `translateY(${-60 * leave}px)`,
        opacity: 1 - leave,
      }}
    >
      {lines.map((l, i) => (
        <Line key={i} line={l} />
      ))}
    </div>
  );
};
