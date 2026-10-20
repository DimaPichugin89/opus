// Kinetic type: each word rises out of its own mask, one tap per phrase.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../sfx';
import {COLORS, FONT, SAFE, W} from '../theme';

export type TextLine = {
  text: string;
  at: number;
  size: number;
  font?: keyof typeof FONT;
  color?: string;
  tracking?: number; // em
  stagger?: number; // frames between words
  sound?: boolean;
  underline?: string; // colour of a marker stroke drawn under the line
};

const Word: React.FC<{word: string; at: number; line: TextLine}> = ({word, at, line}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 200, stiffness: 170, mass: 0.7}});
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', padding: '0.04em 0.03em 0.16em', margin: '-0.04em -0.03em -0.16em'}}>
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 5}deg)`,
          transformOrigin: 'left bottom',
        }}
      >
        {word}
      </span>
    </span>
  );
};

const Line: React.FC<{line: TextLine}> = ({line}) => {
  const frame = useCurrentFrame();
  const words = line.text.split(' ');
  const stagger = line.stagger ?? 3;
  const lastWordAt = line.at + stagger * (words.length - 1);
  const mark = interpolate(frame, [lastWordAt + 4, lastWordAt + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: FONT[line.font ?? 'black'],
        fontSize: line.size,
        lineHeight: 1.0,
        letterSpacing: `${line.tracking ?? -0.025}em`,
        color: line.color ?? COLORS.ink,
        whiteSpace: 'nowrap',
        padding: '0.06em 0',
      }}
    >
      {line.underline ? (
        <div
          style={{
            position: 'absolute',
            left: '-0.08em',
            right: '-0.08em',
            bottom: '0.02em',
            height: '0.32em',
            background: line.underline,
            transform: `scaleX(${mark})`,
            transformOrigin: 'left center',
            borderRadius: '0.06em',
            zIndex: -1,
          }}
        />
      ) : null}
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 ? ' ' : null}
          <Word word={w} at={line.at + i * stagger} line={line} />
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
}> = ({lines, top, out, align = 'center'}) => {
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
        left: SAFE.side,
        width: W - SAFE.side * 2,
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
