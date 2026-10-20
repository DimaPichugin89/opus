// Story frame: background, film grain and soft vignette shared by every story.
import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 2);
  const x = (step * 137) % 512;
  const y = (step * 271) % 512;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('tex/grain.png')})`,
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: 'overlay',
        opacity: 0.16,
        pointerEvents: 'none',
        zIndex: 90,
      }}
    />
  );
};

export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: COLORS.cream}}>
    {children}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(38,23,13,0.14) 100%)', zIndex: 89, pointerEvents: 'none'}} />
    <Grain />
  </AbsoluteFill>
);
