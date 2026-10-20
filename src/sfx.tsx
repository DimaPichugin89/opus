// Sound effects: one table for mix level, one component to place a cue on a frame.
// The sounds themselves are synthesised by scripts/gen_sfx.py (each file peaks at -1 dBFS).
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './theme';

export const SFX = {
  tap: {file: 'sfx/tap.wav', seconds: 0.12, volume: 0.4}, // word or phrase appears
  pour: {file: 'sfx/pour.wav', seconds: 0.75, volume: 0.42}, // liquid transition between shots
  thud: {file: 'sfx/thud.wav', seconds: 0.45, volume: 0.42}, // bottle set down
  clink: {file: 'sfx/clink.wav', seconds: 1.2, volume: 0.28}, // numbers and facts
  plop: {file: 'sfx/plop.wav', seconds: 0.25, volume: 0.45}, // oil drop
  chord: {file: 'sfx/chord.wav', seconds: 2.4, volume: 0.5}, // logo accent
  seeds: {file: 'sfx/seeds.wav', seconds: 1.6, volume: 0.3}, // seeds raining onto the table
  press: {file: 'sfx/press.wav', seconds: 2.6, volume: 0.2}, // screw press running
  swish: {file: 'sfx/swish.wav', seconds: 0.32, volume: 0.3}, // fast camera move
  squeeze: {file: 'sfx/squeeze.wav', seconds: 1.3, volume: 0.42}, // press plates crush the seeds: rumble, crack, squish
} as const;

// Global trim for the whole series.
export const MASTER = 1.04;

export type SfxName = keyof typeof SFX;

// Frames before the cut at which the pour starts, so its swell peaks as the liquid covers the frame.
export const POUR_LEAD = 11;

export const Sfx: React.FC<{name: SfxName; at: number; gain?: number}> = ({name, at, gain = 1}) => {
  const s = SFX[name];
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.ceil(s.seconds * FPS) + 2} layout="none">
      <Audio src={staticFile(s.file)} volume={s.volume * gain * MASTER} />
    </Sequence>
  );
};
