// Benefit infographic: rows of a round badge, a short fact and a plain-words note.
// Each badge pops in with a glass clink; the text rises out of its mask.
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from './KineticText';
import {Sfx} from '../sfx';
import {COLORS, FONT, SAFE, W} from '../theme';

export type Benefit = {
  at: number;
  badge: React.ReactNode; // glyph or icon inside the badge
  color: string;
  ink?: string; // glyph colour on the badge
  title: string;
  note: string;
};

const BADGE = 188;

const Row: React.FC<{item: Benefit; top: number}> = ({item, top}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - item.at, fps, config: {damping: 12, stiffness: 160, mass: 0.7}});
  const textLeft = SAFE.side + BADGE + 40;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top,
          width: BADGE,
          height: BADGE,
          borderRadius: '50%',
          background: item.color,
          color: item.ink ?? COLORS.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.medium,
          fontSize: 84,
          letterSpacing: '-0.02em',
          transform: `scale(${pop})`,
        }}
      >
        {item.badge}
      </div>
      <KineticText
        top={top + 14}
        left={textLeft}
        width={W - SAFE.side - textLeft}
        align="left"
        lines={[
          {text: item.title, at: item.at + 3, role: 'item', sound: false},
          {text: item.note, at: item.at + 7, role: 'note', color: COLORS.inkSoft, sound: false, stagger: 2},
        ]}
      />
      <Sfx name="clink" at={item.at} />
    </>
  );
};

export const BenefitList: React.FC<{items: Benefit[]; top: number; gap?: number}> = ({items, top, gap = BADGE + 70}) => (
  <>
    {items.map((it, i) => (
      <Row key={i} item={it} top={top + i * gap} />
    ))}
  </>
);
