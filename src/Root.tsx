import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './fonts';
import {G1, G1_FRAMES} from './stories/general/G1';
import {G2, G2_FRAMES} from './stories/general/G2';
import {G3, G3_FRAMES} from './stories/general/G3';
import {G4, G4_FRAMES} from './stories/general/G4';
import {G5, G5_FRAMES} from './stories/general/G5';
import {G6, G6_FRAMES} from './stories/general/G6';
import {G7, G7_FRAMES} from './stories/general/G7';
import {FxTest, FX_FRAMES} from './dev/FxTest';
import {Reel, REEL_FRAMES} from './stories/reel/Reel';
import {SunReel, SUN_FRAMES} from './stories/sun/SunReel';
import {SunInfo, SUN_INFO_FRAMES} from './stories/sun/SunInfo';
import {SunFrames, SUN_FRAMES_COUNT} from './stories/sun/SunFrames';
import {FPS, H, W} from './theme';

loadFonts();

// General block: what cold-pressed oil is, how shelf oil differs, benefits, ordering.
const STORIES = [
  {id: 'Reel', component: Reel, frames: REEL_FRAMES},
  {id: 'SunReel', component: SunReel, frames: SUN_FRAMES},
  {id: 'SunInfo', component: SunInfo, frames: SUN_INFO_FRAMES},
  {id: 'SunFrames', component: SunFrames, frames: SUN_FRAMES_COUNT},
  {id: 'General01', component: G1, frames: G1_FRAMES},
  {id: 'General02', component: G2, frames: G2_FRAMES},
  {id: 'General03', component: G3, frames: G3_FRAMES},
  {id: 'General04', component: G4, frames: G4_FRAMES},
  {id: 'General05', component: G5, frames: G5_FRAMES},
  {id: 'General06', component: G6, frames: G6_FRAMES},
  {id: 'General07', component: G7, frames: G7_FRAMES},
  {id: 'FxTest', component: FxTest, frames: FX_FRAMES},
];

export const Root: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition key={s.id} id={s.id} component={s.component} durationInFrames={s.frames} fps={FPS} width={W} height={H} />
    ))}
  </>
);
