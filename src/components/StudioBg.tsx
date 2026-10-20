// Backdrops. StudioBg: warm cream sweep with a soft key light and an optional tabletop.
// HeroBg: dark backdrop in the label colour with a spotlight and slow bokeh, for close-ups.
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

export const StudioBg: React.FC<{floor?: number; light?: [number, number]}> = ({floor, light = [50, 38]}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F9F4EA 0%, #F2E8D8 52%, #E7D9C2 100%)'}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at ${light[0]}% ${light[1]}%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)`}} />
    {floor !== undefined ? (
      <>
        <div style={{position: 'absolute', left: 0, right: 0, top: floor, bottom: 0, background: 'linear-gradient(180deg, #E4D4BA 0%, #D9C6A8 60%, #CDB794 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: floor - 40, height: 80, background: 'linear-gradient(180deg, rgba(249,244,234,0) 0%, rgba(228,212,186,0.9) 50%, rgba(228,212,186,0) 100%)', filter: 'blur(12px)'}} />
        <div style={{position: 'absolute', left: W * 0.1, right: W * 0.1, top: floor + 10, height: 220, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.45), rgba(255,255,255,0) 70%)'}} />
      </>
    ) : null}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,38,18,0.16) 100%)'}} />
  </AbsoluteFill>
);

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(Math.min(255, v * k)).toString(16).padStart(2, '0');
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
};

export const HeroBg: React.FC<{color: string; seed: string}> = ({color, seed}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 60% at 50% 42%, ${shade(color, 0.75)} 0%, ${shade(color, 0.32)} 55%, ${shade(color, 0.14)} 100%)`}}>
      {new Array(14).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 40 + r('s') * 160;
        const x = r('x') * W + Math.sin(f / 50 + i) * 30;
        const y = ((r('y') * H - f * (0.4 + r('v'))) % H + H) % H;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,226,170,${0.08 + r('a') * 0.14}) 0%, rgba(255,226,170,0) 70%)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 45% 30% at 50% 30%, rgba(255,240,210,0.18), rgba(255,240,210,0) 70%)'}} />
    </AbsoluteFill>
  );
};
