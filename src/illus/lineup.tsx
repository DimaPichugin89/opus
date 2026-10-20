// Story 7: the ten oils, each bottle arriving with its name, then the order card.
import React from 'react';
import {IllustratedBottle} from './bottles';
import {Art, ramp, useT} from './kit';
import {COLORS, OIL, Oil} from '../theme';

export const LINEUP: {oil: Oil; name: string}[] = [
  {oil: 'sun', name: 'подсолнечное'},
  {oil: 'linen', name: 'льняное'},
  {oil: 'sesame', name: 'кунжутное'},
  {oil: 'pumpkin', name: 'тыквенное'},
  {oil: 'hemp', name: 'конопляное'},
  {oil: 'mustard', name: 'горчичное'},
  {oil: 'camelina', name: 'рыжиковое'},
  {oil: 'almond', name: 'миндальное'},
  {oil: 'peanut', name: 'арахисовое'},
  {oil: 'thistle', name: 'расторопши'},
];

// 4 + 3 + 3 grid; each bottle drops in on its own beat with its name.
// y is the baseline of the names; bottles stand just above it.
const ROWS = [
  {y: 900, xs: [150, 410, 670, 930]},
  {y: 1230, xs: [200, 540, 880]},
  {y: 1560, xs: [200, 540, 880]},
];

export const LineupGrid: React.FC<{at?: number; every?: number}> = ({at = 0, every = 16}) => {
  const t = useT(at);
  const slots = ROWS.flatMap((r) => r.xs.map((x) => ({x, y: r.y})));
  return (
    <Art cx={540} cy={960} w={1080} h={1920}>
      {LINEUP.map((b, i) => {
        const s = slots[i];
        const p = ramp(t, i * every, i * every + 14, 0, 1, (x) => 1 - (1 - x) ** 3);
        return (
          <g key={b.oil} opacity={p} transform={`translate(0 ${(1 - p) * -60})`}>
            <IllustratedBottle x={s.x} y={s.y - 46} h={250} label={OIL[b.oil]} motif={b.oil === 'sesame' ? 'rgba(38,23,13,0.25)' : undefined} />
            <text x={s.x} y={s.y} textAnchor="middle" fontFamily="MasRegular" fontSize={36} fill={COLORS.ink}>
              {b.name}
            </text>
          </g>
        );
      })}
    </Art>
  );
};

// A row of all ten small bottles under the logo on the order card.
export const LineupRow: React.FC<{y: number; at?: number}> = ({y, at = 0}) => {
  const t = useT(at);
  return (
    <Art cx={540} cy={960} w={1080} h={1920}>
      {LINEUP.map((b, i) => {
        const p = ramp(t, i * 3, i * 3 + 14, 0, 1, (x) => 1 - (1 - x) ** 3);
        return (
          <g key={b.oil} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
            <IllustratedBottle x={84 + i * 101} y={y} h={330} label={OIL[b.oil]} />
          </g>
        );
      })}
    </Art>
  );
};
