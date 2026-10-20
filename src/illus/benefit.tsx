// Story 4 illustrations: what the oil gives the body, one idea per scene.
import React from 'react';
import {Art, Drop, INK, LINE, ramp, usePop, useT} from './kit';
import {Sfx} from '../sfx';
import {COLORS, OIL} from '../theme';

// A single big drop falls and lands with a ripple.
export const DropLand: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const q = ramp(t, 4, 26, 0, 1, (x) => x * x);
  const hit = t - 26;
  const ripple = ramp(hit, 0, 30, 0, 1, (x) => 1 - (1 - x) ** 3);
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={800}>
        <ellipse cx={450} cy={640} rx={300} ry={50} fill={COLORS.creamDeep} />
        {hit < 0 ? <Drop x={450} y={60 + 560 * q} r={60} stretch={1 + 0.25 * q} /> : null}
        {hit >= 0 ? (
          <>
            {[0, 0.3].map((d, k) => {
              const r = Math.max(0, ripple - d);
              return <ellipse key={k} cx={450} cy={640} rx={60 + 260 * r} ry={(60 + 260 * r) * 0.17} fill="none" stroke={COLORS.amber} strokeWidth={6 * (1 - r)} opacity={1 - r} />;
            })}
            <ellipse cx={450} cy={640} rx={90 * (1 - ripple * 0.3)} ry={18} fill="url(#k-oil)" />
          </>
        ) : null}
      </Art>
      <Sfx name="plop" at={at + 26} />
    </>
  );
};

// Vitamin E: a golden badge pulses and its glow reaches the cells around it.
export const VitaminE: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const pop = usePop(at + 4);
  const cells = new Array(8).fill(0).map((_, k) => {
    const a = (k / 8) * Math.PI * 2 + 0.3;
    return {x: 450 + Math.cos(a) * 300, y: 400 + Math.sin(a) * 300};
  });
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={820}>
        {[0, 1].map((k) => {
          const life = ((t - 20 - k * 22) % 44) / 44;
          return t > 20 ? <circle key={k} cx={450} cy={400} r={150 + life * 190} fill="none" stroke={OIL.peanut} strokeWidth={10 * (1 - life)} opacity={1 - life} /> : null;
        })}
        {cells.map((c, k) => {
          const glow = ramp(t, 30 + k * 3, 44 + k * 3, 0, 1);
          return (
            <g key={k}>
              <circle cx={c.x} cy={c.y} r={58} fill={COLORS.creamDeep} stroke={INK} strokeWidth={LINE * 0.7} />
              <circle cx={c.x} cy={c.y} r={58} fill={OIL.peanut} opacity={0.45 * glow} />
              <circle cx={c.x + 8} cy={c.y - 6} r={16} fill={INK} opacity={0.65} />
            </g>
          );
        })}
        <g transform={`translate(450 400) scale(${pop})`}>
          <circle r={150} fill={OIL.peanut} />
          <text x={0} y={70} textAnchor="middle" fontFamily="MasMedium" fontSize={210} fill={INK}>
            E
          </text>
        </g>
      </Art>
      <Sfx name="clink" at={at + 6} />
    </>
  );
};

// Omega-3 and omega-6: two drops come down onto a plate of food.
export const OmegaPlate: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const drops = [
    {x: 340, n: '3', at: 6},
    {x: 560, n: '6', at: 14},
  ];
  const settle = ramp(t, 60, 90, 0, 1);
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={820}>
        <ellipse cx={450} cy={660} rx={330} ry={90} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
        <ellipse cx={450} cy={650} rx={250} ry={58} fill={COLORS.creamDeep} />
        {[[330, 640, 70, '#7FA04A'], [420, 625, 60, '#94B65A'], [520, 645, 66, '#7FA04A'], [460, 660, 40, OIL.sun], [370, 660, 34, OIL.sun]].map(([x, y, r, c], k) => (
          <ellipse key={k} cx={x as number} cy={y as number} rx={r as number} ry={(r as number) * 0.4} fill={c as string} />
        ))}
        {drops.map((d, k) => {
          const pop = ramp(t, d.at, d.at + 12, 0, 1, (x) => 1 - (1 - x) ** 3);
          const bob = Math.sin((t + k * 9) / 10) * 10;
          const y = 380 + bob + settle * 200;
          return (
            <g key={k} opacity={(1 - settle * 0.9) * pop} transform={`translate(${d.x} ${y}) scale(${pop})`}>
              <Drop x={0} y={60} r={78} />
              <text x={0} y={30} textAnchor="middle" fontFamily="MasMedium" fontSize={96} fill={INK}>
                {d.n}
              </text>
            </g>
          );
        })}
      </Art>
      <Sfx name="clink" at={at + 10} gain={0.7} />
      <Sfx name="plop" at={at + 84} gain={0.6} />
    </>
  );
};

// Heart, vessels, immune system and metabolism icons light up one after another.
const Heart = () => <path d="M 0 40 C -70 -10 -60 -70 -20 -70 C 0 -70 0 -50 0 -46 C 0 -50 0 -70 20 -70 C 60 -70 70 -10 0 40 Z" />;
// A branching vessel drawn as a tube: dark outline stroke with a lighter core.
const VESSEL = 'M -60 50 C -20 30 0 0 0 -20 M 0 -20 C 0 -45 -30 -60 -60 -66 M 0 -20 C 10 -45 40 -55 66 -50';
const Vessel = () => (
  <>
    <path d={VESSEL} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
    <path d={VESSEL} fill="none" stroke={COLORS.amberLight} strokeWidth={20} strokeLinecap="round" />
  </>
);
const Shield = () => <path d="M 0 -72 L 60 -48 C 60 10 40 48 0 72 C -40 48 -60 10 -60 -48 Z" />;
const Cycle = () => (
  <>
    <path d="M -50 -10 A 52 52 0 0 1 40 -38" fill="none" strokeWidth={14} strokeLinecap="round" />
    <path d="M 50 10 A 52 52 0 0 1 -40 38" fill="none" strokeWidth={14} strokeLinecap="round" />
    <path d="M 30 -60 L 50 -36 L 22 -26 Z M -30 60 L -50 36 L -22 26 Z" />
  </>
);

export const Organs: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const items = [
    {Icon: Heart, label: 'сердце', at: 8},
    {Icon: Vessel, label: 'сосуды', at: 20},
    {Icon: Shield, label: 'иммунитет', at: 32},
    {Icon: Cycle, label: 'обмен веществ', at: 44},
  ];
  return (
    <Art cx={cx} cy={cy} w={960} h={1000}>
      {items.map(({Icon, label, at: a}, k) => {
        const x = 250 + (k % 2) * 460;
        const yOff = Math.floor(k / 2) * 440;
        const lit = ramp(t, a, a + 14, 0, 1);
        return (
          <g key={k}>
            <circle cx={x} cy={200 + yOff} r={130} fill={COLORS.creamDeep} />
            <circle cx={x} cy={200 + yOff} r={130} fill={COLORS.amberLight} opacity={0.5 * lit} />
            <g transform={`translate(${x} ${210 + yOff}) scale(${1.1 + 0.1 * lit})`} fill={lit > 0.5 ? COLORS.amber : 'none'} stroke={INK} strokeWidth={LINE} strokeLinejoin="round">
              <Icon />
            </g>
            <text x={x} y={410 + yOff} textAnchor="middle" fontFamily="MasRegular" fontSize={48} fill={COLORS.inkSoft}>
              {label}
            </text>
          </g>
        );
      })}
    </Art>
  );
};
