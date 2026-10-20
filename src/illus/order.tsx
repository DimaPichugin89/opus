// Story 5 illustrations: an order arrives -> the press starts; shipped within 2 days; date of pressing.
import React from 'react';
import {IllustratedBottle} from './bottles';
import {Art, Drop, INK, LINE, ramp, useT} from './kit';
import {Sfx} from '../sfx';
import {COLORS, OIL} from '../theme';

export const OrderToPress: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const tap = ramp(t, 16, 28, 0, 1);
  const fly = ramp(t, 30, 60, 0, 1);
  const press = ramp(t, 60, 90, 0, 1);
  const cardX = 230 + fly * 440;
  const cardY = 330 - Math.sin(fly * Math.PI) * 160;
  return (
    <>
      <Art cx={cx} cy={cy} w={960} h={800}>
        {/* phone */}
        <rect x={110} y={120} width={250} height={480} rx={44} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
        <rect x={190} y={140} width={90} height={14} rx={7} fill={INK} opacity={0.6} />
        <IllustratedBottle x={235} y={410} h={190} label={OIL.sun} />
        <rect x={150} y={460} width={170} height={64} rx={32} fill={COLORS.amber} />
        <text x={235} y={503} textAnchor="middle" fontFamily="MasMedium" fontSize={30} fill="#FFFFFF">
          Заказать
        </text>
        {tap > 0 && tap < 1 ? <circle cx={235} cy={492} r={20 + 60 * tap} fill="none" stroke={COLORS.amber} strokeWidth={6} opacity={1 - tap} /> : null}
        {/* order card flying to the press */}
        {fly > 0 && fly < 1 ? (
          <g transform={`translate(${cardX} ${cardY}) rotate(${fly * 20 - 10})`}>
            <rect x={-60} y={-40} width={120} height={80} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <path d="M -24 0 L -6 18 L 26 -16" stroke={OIL.hemp} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        ) : null}
        {/* press, drawn as a simple steel cylinder */}
        <rect x={600} y={260} width={200} height={300} rx={30} fill="url(#k-steel)" />
        <rect x={680} y={160 + press * 60} width={40} height={120} fill="url(#k-steel)" />
        <rect x={620} y={270 + press * 60} width={160} height={30} rx={10} fill={COLORS.steelDeep} />
        {press > 0.6 ? <Drop x={700} y={600 + ((t * 6) % 80)} r={14} /> : null}
        <ellipse cx={700} cy={690} rx={90} ry={18} fill="url(#k-oil)" opacity={press} />
      </Art>
      <Sfx name="tap" at={at + 16} />
      <Sfx name="press" at={at + 58} gain={0.6} />
    </>
  );
};

export const ShipIn2Days: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const drop = ramp(t, 6, 22, 0, 1, (x) => x * x);
  const flaps = ramp(t, 26, 40, 0, 1);
  const cal = ramp(t, 34, 48, 0, 1);
  return (
    <>
      <Art cx={cx} cy={cy} w={960} h={800}>
        <g opacity={1 - flaps * 0}>
          <g transform={`translate(0 ${-300 * (1 - drop)})`} opacity={1 - flaps}>
            <IllustratedBottle x={300} y={520} h={300} label={OIL.sun} />
          </g>
          <rect x={150} y={420} width={300} height={240} rx={22} fill="#C9A06A" stroke={INK} strokeWidth={LINE} />
          <path d={`M 150 ${420} L ${150 + 150 * (1 - flaps * 0.98)} ${420 - 110 * (1 - flaps)} M 450 ${420} L ${450 - 150 * (1 - flaps * 0.98)} ${420 - 110 * (1 - flaps)}`} stroke={INK} strokeWidth={LINE} strokeLinecap="round" />
          <rect x={150} y={420 - 8 * flaps} width={300} height={16 * flaps} fill="#B98E57" />
          <rect x={270} y={420} width={60} height={240 * flaps} fill="#E8D6B0" opacity={0.9} />
        </g>
        <g opacity={cal} transform={`translate(${(1 - cal) * 40} 0)`}>
          <rect x={560} y={260} width={280} height={300} rx={36} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
          <rect x={560} y={260} width={280} height={70} rx={36} fill={OIL.sun} />
          <rect x={560} y={296} width={280} height={34} fill={OIL.sun} />
          <text x={700} y={490} textAnchor="middle" fontFamily="MasMedium" fontSize={150} fill={INK}>
            2
          </text>
          <text x={700} y={620} textAnchor="middle" fontFamily="MasRegular" fontSize={48} fill={COLORS.inkSoft}>
            дня
          </text>
        </g>
      </Art>
      <Sfx name="thud" at={at + 22} gain={0.5} />
      <Sfx name="clink" at={at + 40} gain={0.6} />
    </>
  );
};

// A label close-up: the date of pressing is written into the white field.
export const PressDate: React.FC<{cx: number; cy: number; at?: number; date: string}> = ({cx, cy, at = 0, date}) => {
  const t = useT(at);
  const write = ramp(t, 22, 52, 0, 1, (x) => x);
  return (
    <Art cx={cx} cy={cy} w={960} h={760}>
      <rect x={120} y={120} width={720} height={520} rx={18} fill={OIL.sun} />
      <circle cx={480} cy={330} r={160} fill="none" stroke="rgba(38,23,13,0.35)" strokeWidth={8} />
      <text x={170} y={510} fontFamily="MasRegular" fontSize={44} fill={COLORS.cream}>
        Дата отжима:
      </text>
      <rect x={170} y={540} width={420} height={72} rx={8} fill="#FFFFFF" />
      <defs>
        <clipPath id="date-write">
          <rect x={180} y={540} width={400 * write} height={72} />
        </clipPath>
      </defs>
      <text x={190} y={596} fontFamily="MasMedium" fontSize={56} fill={INK} clipPath="url(#date-write)">
        {date}
      </text>
    </Art>
  );
};
