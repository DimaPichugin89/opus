import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './fonts';
import {Story01} from './stories/Story01';
import {FPS, H, STORY_FRAMES, W} from './theme';

loadFonts();

const STORIES = [{id: 'Story01', component: Story01}];

export const Root: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition key={s.id} id={s.id} component={s.component} durationInFrames={STORY_FRAMES} fps={FPS} width={W} height={H} />
    ))}
  </>
);
