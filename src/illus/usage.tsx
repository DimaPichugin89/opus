// Story 6 illustrations: a spoon a day, only into ready food, not for frying, keep cold.
import React from 'react';
import {IllustratedBottle} from './bottles';
import {Art, Drop, INK, LINE, ramp, useT} from './kit';
import {Sfx} from '../sfx';
import {COLORS, OIL} from '../theme';

export const SpoonFill: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const fill = ramp(t, 10, 60, 0, 1);
  const pouring = t > 6 && t < 64;
  return (
    <>
      <Art cx={cx} cy={cy} w={960} h={700}>
        <defs>
          <clipPath id="spoon-bowl">
            <ellipse cx={330} cy={400} rx={200} ry={110} />
          </clipPath>
        </defs>
        {pouring ? <path d={`M ${330 + Math.sin(t / 3) * 4} 0 L 330 ${400 - fill * 30}`} stroke={COLORS.amberLight} strokeWidth={16} strokeLinecap="round" /> : null}
        <rect x={500} y={384} width={400} height={34} rx={17} fill="url(#k-steel)" />
        <ellipse cx={330} cy={400} rx={200} ry={110} fill="url(#k-steel)" />
        <g clipPath="url(#spoon-bowl)">
          <ellipse cx={330} cy={420} rx={170 * fill} ry={80 * fill} fill="url(#k-oil)" />
        </g>
        <ellipse cx={270} cy={370} rx={40 * fill} ry={14 * fill} fill="#FFF3D6" opacity={0.5} />
      </Art>
      <Sfx name="pour" at={at + 6} gain={0.6} />
    </>
  );
};

const Bowl: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -150 0 Q -150 110 0 120 Q 150 110 150 0 Z" fill="#FFFFFF" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
    <ellipse cx={0} cy={0} rx={150} ry={34} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
    {children}
  </g>
);

export const ReadyDishes: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const bowls = [
    {x: 250, y: 260, fill: [['#7FA04A', -60, -4, 50], ['#94B65A', 10, -8, 46], [OIL.sun, 60, 0, 22], ['#7FA04A', -10, 4, 40]]},
    {x: 650, y: 260, fill: [['#E3C893', -40, -2, 70], ['#E9D2A4', 40, 0, 66]]},
    {x: 250, y: 600, fill: [['#E0612B', -60, -4, 26], ['#E0612B', -10, 2, 26], ['#7FA04A', 40, -6, 40], ['#E0612B', 70, 2, 24]]},
    {x: 650, y: 600, fill: [['#FBF8F0', -50, -4, 50], ['#F4EFE2', 20, -2, 56], ['#FBF8F0', 70, 2, 30]]},
  ] as const;
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={820}>
        {bowls.map((b, k) => {
          const d = 8 + k * 12;
          const q = ramp(t, d, d + 12, 0, 1, (x) => x * x);
          const shine = ramp(t, d + 12, d + 24, 0, 1);
          return (
            <g key={k}>
              <Bowl x={b.x} y={b.y}>
                {b.fill.map(([c, x, y, r], i) => (
                  <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.4} fill={c} />
                ))}
                <ellipse cx={0} cy={-4} rx={60 * shine} ry={12 * shine} fill="url(#k-oil)" opacity={0.9} />
              </Bowl>
              {q > 0 && q < 1 ? <Drop x={b.x} y={b.y - 240 + 236 * q} r={16} /> : null}
            </g>
          );
        })}
      </Art>
      {[0, 1, 2, 3].map((k) => (
        <Sfx key={k} name="plop" at={at + 20 + k * 12} gain={0.35} />
      ))}
    </>
  );
};

export const NoFrying: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const sign = ramp(t, 22, 40, 0, 1);
  return (
    <Art cx={cx} cy={cy} w={900} h={760}>
      {[0, 1, 2].map((k) => {
        const y = 300 - ((t * 2.4 + k * 50) % 150);
        return <path key={k} d={`M ${330 + k * 80} ${y + 60} q 18 -26 0 -52 q -18 -26 0 -52`} stroke={COLORS.inkSoft} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.5} />;
      })}
      <ellipse cx={410} cy={420} rx={230} ry={70} fill="#3A3330" />
      <path d="M 180 420 Q 190 520 410 530 Q 630 520 640 420" fill="#2A2420" />
      <rect x={630} y={400} width={230} height={36} rx={18} fill="#2A2420" />
      <g opacity={sign} transform={`translate(450 400) scale(${0.8 + 0.2 * sign})`}>
        <circle r={300} fill="none" stroke={OIL.sun} strokeWidth={22} />
        <path d="M -212 212 L 212 -212" stroke={OIL.sun} strokeWidth={22} strokeLinecap="round" />
      </g>
    </Art>
  );
};

export const KeepCold: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const open = ramp(t, 6, 18, 0, 1) * (1 - ramp(t, 44, 56, 0, 1));
  const slide = ramp(t, 18, 40, 0, 1);
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={860}>
        <rect x={260} y={60} width={380} height={760} rx={40} fill="#F7F7F4" stroke={INK} strokeWidth={LINE} />
        <rect x={260} y={330} width={380} height={8} fill={INK} opacity={0.5} />
        {[480, 620].map((y) => (
          <rect key={y} x={290} y={y} width={320} height={8} rx={4} fill={COLORS.steel} />
        ))}
        <g transform={`translate(${-260 * (1 - slide)} 0)`} opacity={slide > 0 ? 1 : 0}>
          <IllustratedBottle x={450} y={612} h={250} label={OIL.linen} />
        </g>
        {/* door swings open and closes again */}
        <g transform={`translate(640 0) scale(${1 - open * 0.92} 1) translate(-640 0)`}>
          <rect x={260} y={338} width={380} height={482} rx={30} fill="#FBFBF8" stroke={INK} strokeWidth={LINE} />
          <rect x={300} y={380} width={16} height={120} rx={8} fill={COLORS.steelDeep} />
        </g>
        <rect x={260} y={60} width={380} height={270} rx={40} fill="#FBFBF8" stroke={INK} strokeWidth={LINE} />
        <rect x={300} y={200} width={16} height={100} rx={8} fill={COLORS.steelDeep} />
        {[0, 1, 2].map((k) => {
          const a = t / 30 + k * 2.1;
          return <text key={k} x={720 + Math.cos(a) * 40} y={200 + k * 120 + Math.sin(a) * 20} fontSize={60} fill="#9DC3D9" fontFamily="MasRegular">❄</text>;
        })}
      </Art>
      <Sfx name="thud" at={at + 56} gain={0.35} />
    </>
  );
};
