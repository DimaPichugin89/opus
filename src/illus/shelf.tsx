// Story 2 illustrations: how ordinary refined sunflower oil is made, step by step.
import React from 'react';
import {random} from 'remotion';
import {IllustratedBottle, ShelfBottle} from './bottles';
import {Art, INK, LINE, ramp, Seed, Thermometer, useT, wavePath} from './kit';
import {Sfx} from '../sfx';
import {COLORS, OIL} from '../theme';

export const ShelfBottleArt: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const rise = ramp(t, 0, 20, 60, 0);
  return (
    <Art cx={cx} cy={cy + rise} w={500} h={800}>
      <ShelfBottle x={250} y={760} h={700} />
    </Art>
  );
};

// Step 1: seeds on a tray over soft rounded flames, heat waves rising, thermometer climbing.
export const HeatTray: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const temp = ramp(t, 4, 70, 20, 105);
  return (
    <Art cx={cx} cy={cy} w={900} h={800}>
      {[0, 1, 2, 3].map((k) => {
        const y = 330 - ((t * 3 + k * 60) % 240);
        return <path key={k} d={`M ${200 + k * 110} ${y + 60} q 20 -30 0 -60 q -20 -30 0 -60`} stroke={COLORS.inkSoft} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.5 * Math.sin(Math.PI * Math.min(1, (330 - y) / 240))} />;
      })}
      {new Array(18).fill(0).map((_, i) => (
        <Seed key={i} x={170 + (i % 9) * 52 + (i > 8 ? 26 : 0)} y={392 + (i > 8 ? 22 : 0) + Math.sin(t / 3 + i) * 1.5} len={56} rot={70 + random(`ht${i}`) * 40} />
      ))}
      <rect x={120} y={430} width={540} height={40} rx={20} fill="url(#k-steel)" />
      {[0, 1, 2, 3, 4].map((k) => {
        const s = 1 + 0.12 * Math.sin(t / 4 + k * 1.7);
        return (
          <g key={k} transform={`translate(${170 + k * 110} 600) scale(${s})`}>
            <path d="M 0 -110 C 30 -70 52 -40 52 -2 C 52 30 28 50 0 50 C -28 50 -52 30 -52 -2 C -52 -40 -30 -70 0 -110 Z" fill="#F08A2C" />
            <path d="M 0 -50 C 14 -30 24 -14 24 6 C 24 24 12 34 0 34 C -12 34 -24 24 -24 6 C -24 -14 -14 -30 0 -50 Z" fill="#FFD067" />
          </g>
        );
      })}
      <Thermometer x={780} y={190} h={420} value={temp} max={120} marks={[]} />
    </Art>
  );
};

// Step 2: solvent poured over the pressed cake to pull out the rest of the oil.
export const SolventPour: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const tilt = ramp(t, 4, 22, 0, 62);
  const pour = t > 18;
  const level = ramp(t, 22, 90, 0, 1);
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={800}>
        <defs>
          <clipPath id="vat">
            <rect x={240} y={420} width={420} height={300} rx={50} />
          </clipPath>
        </defs>
        <g clipPath="url(#vat)">
          {new Array(26).fill(0).map((_, i) => (
            <ellipse key={i} cx={270 + (i % 9) * 46} cy={690 - Math.floor(i / 9) * 40} rx={26} ry={16} fill="#8C6A43" />
          ))}
          <path d={wavePath(240, 420, 720 - level * 170, 720, t, 6)} fill="#BFD9E6" opacity={0.75} />
        </g>
        <rect x={240} y={420} width={420} height={300} rx={50} fill="none" stroke={INK} strokeWidth={LINE} />
        {pour ? <path d={`M 452 300 Q 446 380 450 ${700 - level * 170}`} stroke="#BFD9E6" strokeWidth={16} strokeLinecap="round" fill="none" /> : null}
        <g transform={`rotate(${tilt} 470 260)`}>
          <path d="M 400 120 L 400 210 L 340 330 Q 330 352 354 352 L 546 352 Q 570 352 560 330 L 500 210 L 500 120 Z" fill="#DCEBF2" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
          <path d="M 372 270 L 528 270 L 560 330 Q 570 352 546 352 L 354 352 Q 330 352 340 330 Z" fill="#BFD9E6" />
          <rect x={390} y={104} width={120} height={22} rx={11} fill="none" stroke={INK} strokeWidth={LINE} />
        </g>
      </Art>
      <Sfx name="pour" at={at + 18} gain={0.6} />
    </>
  );
};

// Step 3: three flasks, the oil going from dark to pale.
export const BleachFlasks: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const shades = ['#7A4A1C', '#C99A3C', '#F3E39A'];
  return (
    <Art cx={cx} cy={cy} w={960} h={700}>
      {shades.map((c, k) => {
        const p = ramp(t, 4 + k * 16, 20 + k * 16, 0, 1);
        const x = 180 + k * 300;
        return (
          <g key={k} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
            <path d={`M ${x - 40} 180 L ${x - 40} 330 L ${x - 120} 540 Q ${x - 130} 570 ${x - 100} 570 L ${x + 100} 570 Q ${x + 130} 570 ${x + 120} 540 L ${x + 40} 330 L ${x + 40} 180 Z`} fill="#FFFFFF" fillOpacity={0.5} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
            <path d={`M ${x - 76} 430 L ${x + 76} 430 L ${x + 120} 540 Q ${x + 130} 570 ${x + 100} 570 L ${x - 100} 570 Q ${x - 130} 570 ${x - 120} 540 Z`} fill={c} />
          </g>
        );
      })}
    </Art>
  );
};

// Step 4: steam over a tank and a thermometer going past 200 °C.
export const SteamTank: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const temp = ramp(t, 4, 60, 40, 230);
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={800}>
        {new Array(7).fill(0).map((_, k) => {
          const life = (t * 1.6 + k * 30) % 200;
          return <circle key={k} cx={300 + (k % 3) * 60 + Math.sin(life / 20 + k) * 20} cy={360 - life * 1.4} r={40 + life * 0.35} fill="#FFFFFF" opacity={0.75 * (1 - life / 200)} />;
        })}
        <rect x={160} y={380} width={460} height={340} rx={70} fill="url(#k-steel)" />
        <rect x={210} y={460} width={360} height={200} rx={40} fill="#F7EFD0" />
        <path d={wavePath(210, 360, 520, 660, t, 6)} fill="url(#k-pale-oil)" />
        <Thermometer x={760} y={140} h={520} value={temp} max={250} marks={[200]} />
      </Art>
      <Sfx name="clink" at={at + 48} gain={0.8} />
    </>
  );
};

// Pale store oil next to the amber Maslarada bottle.
export const CompareBottles: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const a = ramp(t, 0, 16, 0, 1);
  const b = ramp(t, 10, 26, 0, 1);
  return (
    <Art cx={cx} cy={cy} w={900} h={820}>
      <g opacity={a} transform={`translate(0 ${(1 - a) * 40})`}>
        <ShelfBottle x={260} y={720} h={620} />
        <text x={260} y={800} textAnchor="middle" fontFamily="MasRegular" fontSize={44} fill={COLORS.inkSoft}>
          с полки магазина
        </text>
      </g>
      <g opacity={b} transform={`translate(0 ${(1 - b) * 40})`}>
        <IllustratedBottle x={640} y={720} h={620} label={OIL.sun} />
        <text x={640} y={800} textAnchor="middle" fontFamily="MasRegular" fontSize={44} fill={COLORS.inkSoft}>
          сыродавленное
        </text>
      </g>
    </Art>
  );
};
