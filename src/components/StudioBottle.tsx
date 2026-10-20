// Real Maslarada bottles from the studio cutouts. Every bottle is drawn at the same height
// (they are the same bottle), with a soft floor shadow and a light streak sliding across the glass.
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Oil} from '../theme';

export const STUDIO: Record<Oil, {src: string; w: number; h: number; closeUp: boolean}> = {
  sun: {src: 'cut/studio/sun.png', w: 400, h: 1583, closeUp: true},
  linen: {src: 'cut/studio/linen.png', w: 403, h: 1580, closeUp: true},
  sesame: {src: 'cut/studio/sesame.png', w: 403, h: 1597, closeUp: true},
  pumpkin: {src: 'cut/studio/pumpkin.png', w: 238, h: 952, closeUp: false},
  hemp: {src: 'cut/studio/hemp.png', w: 317, h: 1249, closeUp: true},
  mustard: {src: 'cut/studio/mustard.png', w: 396, h: 1571, closeUp: true},
  camelina: {src: 'cut/studio/camelina.png', w: 296, h: 1165, closeUp: false},
  almond: {src: 'cut/studio/almond.png', w: 399, h: 1568, closeUp: true},
  peanut: {src: 'cut/studio/peanut.png', w: 401, h: 1579, closeUp: true},
  thistle: {src: 'cut/studio/thistle.png', w: 292, h: 1160, closeUp: false},
};

// The bottle box is ~0.253 of its height wide for every cutout.
export const bottleWidth = (height: number) => height * 0.2527;

const Gloss: React.FC<{src: string; at: number; every: number}> = ({src, at, every}) => {
  const f = useCurrentFrame();
  const t = ((((f - at) % every) + every) % every) / every;
  const x = interpolate(t, [0, 0.45], [-60, 160], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const url = `url(${staticFile(src)})`;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(100deg, rgba(255,255,255,0) ${x - 18}%, rgba(255,255,255,0.42) ${x}%, rgba(255,255,255,0) ${x + 14}%)`,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

export const StudioBottle: React.FC<{
  oil: Oil;
  x: number; // centre
  bottom: number; // y of the base
  height: number;
  shadow?: boolean;
  gloss?: boolean;
  glossAt?: number;
  reflect?: boolean; // faint mirror image on a glossy tabletop
  style?: React.CSSProperties; // extra transform etc. applied around the base centre
}> = ({oil, x, bottom, height, shadow = true, gloss = true, glossAt = 0, reflect = false, style}) => {
  const s = STUDIO[oil];
  const w = bottleWidth(height);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: bottom - height, width: w, height, transformOrigin: '50% 100%', ...style}}>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: -w * 0.35,
            right: -w * 0.35,
            bottom: -height * 0.03,
            height: height * 0.06,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(38,23,13,0.35), rgba(38,23,13,0))',
          }}
        />
      ) : null}
      {reflect ? (
        <Img
          src={staticFile(s.src)}
          style={{
            position: 'absolute',
            left: 0,
            top: height,
            width: '100%',
            height: '100%',
            transform: 'scaleY(-1)',
            transformOrigin: '50% 0%',
            opacity: 0.22,
            WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)',
            maskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)',
            filter: 'blur(1.5px)',
          }}
        />
      ) : null}
      <Img src={staticFile(s.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      {gloss ? <Gloss src={s.src} at={glossAt} every={75} /> : null}
    </div>
  );
};

// Close-up: the camera travels along a huge bottle. `focus` is the point of the bottle
// (0 = cap, 1 = base) held at the frame centre; scale is the bottle height in frame heights.
export const BottleHero: React.FC<{
  oil: Oil;
  dur: number;
  focus: [number, number];
  scale: [number, number];
  tilt?: [number, number];
  x?: [number, number]; // horizontal offset of the bottle centre from the frame centre
}> = ({oil, dur, focus, scale, tilt = [0, 0], x = [0, 0]}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const lerp = (r: [number, number]) => r[0] + (r[1] - r[0]) * p;
  const height = 1920 * lerp(scale);
  const bottom = 960 + (1 - lerp(focus)) * height;
  return <StudioBottle oil={oil} x={540 + lerp(x)} bottom={bottom} height={height} shadow={false} glossAt={4} style={{transform: `rotate(${lerp(tilt)}deg)`, transformOrigin: `50% ${lerp(focus) * 100}%`}} />;
};
