// Sound effects: one table for mix level, one component to place a cue on a frame.
// The sounds themselves are synthesised by scripts/gen_sfx.py (each file peaks at -1 dBFS).
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {TimeScaleContext} from './illus/kit';
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
  rise: {file: 'sfx/rise.wav', seconds: 1.2, volume: 0.32}, // volume slider up, sound opens
  fall: {file: 'sfx/fall.wav', seconds: 1.0, volume: 0.32}, // volume slider down, sound dulls
  tick: {file: 'sfx/tick.wav', seconds: 0.06, volume: 0.3}, // scale notch
  squeeze: {file: 'sfx/squeeze.wav', seconds: 1.3, volume: 0.42}, // press plates crush the seeds: rumble, crack, squish
} as const;

// Global trim for the whole series.
export const MASTER = 0.98;

// Per-video trim on top of MASTER (a short, dense cut needs a little less).
export const MixGain = React.createContext(1);

export type SfxName = keyof typeof SFX;

// Frames before the cut at which the pour starts, so its swell peaks as the liquid covers the frame.
export const POUR_LEAD = 11;

// Inside a <TimeScale k> (illus/kit) cue times are illustration time, so they are divided by k.
export const Sfx: React.FC<{name: SfxName; at: number; gain?: number}> = ({name, at: rawAt, gain = 1}) => {
  const s = SFX[name];
  const at = Math.round(rawAt / React.useContext(TimeScaleContext));
  const mix = React.useContext(MixGain);
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.ceil(s.seconds * FPS) + 2} layout="none">
      <Audio src={staticFile(s.file)} volume={s.volume * gain * mix * MASTER} />
    </Sequence>
  );
};
