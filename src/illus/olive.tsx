// Story 3 illustrations: olive oil, the omega-3 comparison, months on the road, the blend label.
import React from 'react';
import {Art, INK, LINE, ramp, useT, wavePath} from './kit';
import {Sfx} from '../sfx';
import {COLORS, OIL} from '../theme';

const OLIVE_OIL = '#B9B13A';

const OliveBottle: React.FC<{x: number; y: number; h: number; label?: string; layers?: boolean; t?: number}> = ({x, y, h, label, layers, t = 0}) => {
  const w = h * 0.26;
  const top = y - h;
  const neck = w * 0.34;
  const shoulder = top + h * 0.34;
  const body = `M ${x - neck / 2} ${top + h * 0.08} L ${x - neck / 2} ${top + h * 0.2} Q ${x - neck / 2} ${shoulder - h * 0.04} ${x - w / 2} ${shoulder + h * 0.04} L ${x - w / 2} ${y - h * 0.03} Q ${x - w / 2} ${y} ${x - w / 2 + 12} ${y} L ${x + w / 2 - 12} ${y} Q ${x + w / 2} ${y} ${x + w / 2} ${y - h * 0.03} L ${x + w / 2} ${shoulder + h * 0.04} Q ${x + neck / 2} ${shoulder - h * 0.04} ${x + neck / 2} ${top + h * 0.2} L ${x + neck / 2} ${top + h * 0.08} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`ob-${x}`}>
          <path d={body} />
        </clipPath>
      </defs>
      <ellipse cx={x} cy={y + 6} rx={w * 0.75} ry={h * 0.025} fill="#26170D" opacity={0.16} />
      <path d={body} fill="#3F4A1E" />
      <g clipPath={`url(#ob-${x})`} opacity={0.9}>
        {layers ? (
          <>
            <rect x={x - w} y={shoulder} width={w * 2} height={h} fill="#F3E39A" />
            <path d={`M ${x - w} ${shoulder + h * 0.28} C ${x - w / 3} ${shoulder + h * 0.2 + 20 * Math.sin(t / 8)} ${x + w / 3} ${shoulder + h * 0.38 - 20 * Math.sin(t / 8)} ${x + w} ${shoulder + h * 0.3} L ${x + w} ${shoulder} L ${x - w} ${shoulder} Z`} fill={OLIVE_OIL} />
          </>
        ) : (
          <rect x={x - w} y={shoulder} width={w * 2} height={h} fill={OLIVE_OIL} opacity={0.55} />
        )}
      </g>
      {label ? (
        <g>
          <rect x={x - w / 2 + 6} y={y - h * 0.42} width={w - 12} height={h * 0.2} rx={8} fill={COLORS.cream} stroke={INK} strokeWidth={3} />
          {label.split(' ').map((word, i, all) => (
            <text key={i} x={x} y={y - h * 0.32 + (i - (all.length - 1) / 2) * h * 0.05 + h * 0.015} textAnchor="middle" fontFamily="MasMedium" fontSize={h * 0.042} fill={INK}>
              {word}
            </text>
          ))}
        </g>
      ) : null}
      <rect x={x - neck * 0.7} y={top} width={neck * 1.4} height={h * 0.09} rx={8} fill="#1E1914" />
      <rect x={x - w * 0.36} y={shoulder + h * 0.08} width={w * 0.08} height={h * 0.4} rx={w * 0.04} fill="#fff" opacity={0.25} />
    </g>
  );
};

export const OliveArt: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const sway = Math.sin(t / 20) * 3;
  const leaves: [number, number, number][] = [[150, 260, -30], [230, 200, 20], [300, 290, -50], [380, 230, 30], [450, 300, -20], [520, 250, 40]];
  return (
    <Art cx={cx} cy={cy} w={900} h={820}>
      <g transform={`rotate(${sway} 120 300)`}>
        <path d="M 100 320 Q 320 220 580 280" stroke="#6B5A3A" strokeWidth={10} strokeLinecap="round" fill="none" />
        {leaves.map(([x, y, r], k) => (
          <ellipse key={k} cx={x} cy={y} rx={70} ry={20} fill="#7D8C4A" transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {[[260, 330], [420, 340], [340, 360]].map(([x, y], k) => (
          <ellipse key={k} cx={x} cy={y} rx={30} ry={38} fill="#3D4420" />
        ))}
      </g>
      <OliveBottle x={680} y={780} h={600} label="Extra Virgin" />
    </Art>
  );
};

// Two measuring cylinders: share of omega-3 in olive oil vs flax oil.
export const OmegaJars: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const jars = [
    {x: 270, pct: 1, label: 'оливковое', color: OLIVE_OIL, at: 6, sign: '<'},
    {x: 630, pct: 55, label: 'льняное', color: COLORS.amberLight, at: 22, sign: '≈'},
  ];
  const H = 520;
  const top = 160;
  return (
    <>
      <Art cx={cx} cy={cy} w={900} h={860}>
        {jars.map((j, k) => {
          const p = ramp(t, j.at, j.at + 30, 0, 1, (x) => 1 - (1 - x) ** 3);
          const level = top + H - 10 - (H - 20) * (j.pct / 100) * p;
          return (
            <g key={k}>
              <defs>
                <clipPath id={`cyl-${k}`}>
                  <rect x={j.x - 110} y={top} width={220} height={H} rx={40} />
                </clipPath>
              </defs>
              <rect x={j.x - 110} y={top} width={220} height={H} rx={40} fill="#FFFFFF" fillOpacity={0.45} />
              <g clipPath={`url(#cyl-${k})`}>
                <path d={wavePath(j.x - 110, 220, Math.min(level, top + H - 14), top + H, t, 4)} fill={j.color} />
              </g>
              <rect x={j.x - 110} y={top} width={220} height={H} rx={40} fill="none" stroke={INK} strokeWidth={LINE} />
              {[0.25, 0.5, 0.75].map((m) => (
                <rect key={m} x={j.x + 60} y={top + H - H * m} width={36} height={5} rx={2.5} fill={INK} opacity={0.5} />
              ))}
              <text x={j.x} y={top - 40} textAnchor="middle" fontFamily="MasMedium" fontSize={92} fill={INK} opacity={p > 0 ? 1 : 0}>
                {j.sign} {Math.max(j.sign === '<' ? 1 : 0, Math.round(j.pct * p))}%
              </text>
              <text x={j.x} y={top + H + 70} textAnchor="middle" fontFamily="MasRegular" fontSize={48} fill={COLORS.inkSoft}>
                {j.label}
              </text>
            </g>
          );
        })}
      </Art>
      <Sfx name="clink" at={at + jars[0].at + 26} gain={0.7} />
      <Sfx name="clink" at={at + jars[1].at + 28} />
    </>
  );
};

// A calendar flipping through months while the bottle travels.
export const MonthsOnRoad: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const month = Math.min(6, 1 + Math.floor(Math.max(0, t - 8) / 12));
  const flip = ((Math.max(0, t - 8) % 12) / 12) * (month < 6 ? 1 : 0);
  const travel = ramp(t, 0, 110, -140, 140, (x) => x);
  return (
    <Art cx={cx} cy={cy} w={900} h={860}>
      <rect x={240} y={110} width={420} height={420} rx={46} fill="#FFFFFF" stroke={INK} strokeWidth={LINE} />
      <rect x={240} y={110} width={420} height={96} rx={46} fill={OIL.sun} />
      <rect x={240} y={160} width={420} height={46} fill={OIL.sun} />
      {[330, 570].map((x) => (
        <rect key={x} x={x - 12} y={80} width={24} height={70} rx={12} fill={INK} />
      ))}
      <g transform={`translate(450 ${380 - Math.sin(flip * Math.PI) * 14}) scale(1 ${1 - 0.25 * Math.sin(flip * Math.PI)})`}>
        <text x={0} y={30} textAnchor="middle" fontFamily="MasMedium" fontSize={190} fill={INK}>
          {month}
          {month === 6 ? '+' : ''}
        </text>
      </g>
      <text x={450} y={490} textAnchor="middle" fontFamily="MasRegular" fontSize={46} fill={COLORS.inkSoft}>
        месяцев
      </text>
      <g transform={`translate(${travel} ${Math.abs(Math.sin(t / 6)) * -8})`}>
        <OliveBottle x={450} y={820} h={250} />
      </g>
    </Art>
  );
};

// A bottle labelled just "Olive oil" with two layers swirling: refined and virgin.
export const BlendBottle: React.FC<{cx: number; cy: number; at?: number}> = ({cx, cy, at = 0}) => {
  const t = useT(at);
  const legend = ramp(t, 24, 40, 0, 1);
  return (
    <Art cx={cx} cy={cy} w={900} h={860}>
      <OliveBottle x={250} y={800} h={680} label="Olive oil" layers t={t} />
      <g opacity={legend} transform={`translate(${(1 - legend) * 30} 0)`}>
        <circle cx={460} cy={420} r={24} fill={OLIVE_OIL} />
        <text x={500} y={435} fontFamily="MasRegular" fontSize={42} fill={INK}>
          нерафинированное
        </text>
        <circle cx={460} cy={560} r={24} fill="#F3E39A" stroke={INK} strokeWidth={2} />
        <text x={500} y={575} fontFamily="MasRegular" fontSize={42} fill={INK}>
          рафинированное
        </text>
      </g>
    </Art>
  );
};
