// Sound effects: one table for mix level, one component to place a cue on a frame.
// The sounds themselves are synthesised by scripts/gen_sfx.py (each file peaks at -1 dBFS).
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './theme';

export const SFX = {
  tap: {file: 'sfx/tap.wav', seconds: 0.09, volume: 0.32},
  whoosh: {file: 'sfx/whoosh.wav', seconds: 0.5, volume: 0.34},
  thud: {file: 'sfx/thud.wav', seconds: 0.32, volume: 0.5},
  ding: {file: 'sfx/ding.wav', seconds: 1.1, volume: 0.3},
  plop: {file: 'sfx/plop.wav', seconds: 0.22, volume: 0.42},
  chord: {file: 'sfx/chord.wav', seconds: 2.2, volume: 0.45},
} as const;

// Global trim for the whole series.
export const MASTER = 1.12;

export type SfxName = keyof typeof SFX;

// Frames before the visual hit at which a whoosh should start so its peak lands on the cut.
export const WHOOSH_LEAD = 7;

export const Sfx: React.FC<{name: SfxName; at: number; gain?: number}> = ({name, at, gain = 1}) => {
  const s = SFX[name];
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.ceil(s.seconds * FPS) + 2} layout="none">
      <Audio src={staticFile(s.file)} volume={s.volume * gain * MASTER} />
    </Sequence>
  );
};
