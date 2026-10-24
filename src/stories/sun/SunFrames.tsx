// Style frames for the sunflower reel: one still per scene, frame n shows scene n.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage} from '../../components/Stage';
import {COLORS, FONT, TYPE} from '../../theme';

const GOLD_A = '#F6C453';
const GOLD_B = '#C9821A';
const PALE_A = '#FAF4DA';
const PALE_B = '#EFE3B4';
const LINE = '#4A3424';
const RED = '#E2312A';

const Text: React.FC<{lines: string[]; sub?: string[]; top?: number}> = ({lines, sub = [], top = 290}) => (
  <div style={{position: 'absolute', top, left: 64, right: 64, textAlign: 'center'}}>
    {lines.map((l) => (
      <div key={l} style={{fontFamily: FONT.medium, fontSize: TYPE.para.size, lineHeight: TYPE.para.lineHeight, letterSpacing: `${TYPE.para.tracking}em`, color: COLORS.ink}}>
        {l}
      </div>
    ))}
    {sub.map((l, i) => (
      <div key={l} style={{fontFamily: FONT.regular, fontSize: 52, lineHeight: 1.2, color: COLORS.inkSoft, marginTop: i === 0 ? 18 : 0}}>
        {l}
      </div>
    ))}
  </div>
);

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="gold" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor={GOLD_A} />
      <stop offset="1" stopColor={GOLD_B} />
    </linearGradient>
    <linearGradient id="pale" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor={PALE_A} />
      <stop offset="1" stopColor={PALE_B} />
    </linearGradient>
    <radialGradient id="shadow">
      <stop offset="0" stopColor="#26170D" stopOpacity="0.16" />
      <stop offset="1" stopColor="#26170D" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <Defs />
    {children}
  </svg>
);

// A drop standing on its round bottom at (x, y), radius r.
const dropD = (r: number) => `M 0 ${-r * 2.7} C ${r * 0.25} ${-r * 2.05} ${r} ${-r * 1.45} ${r} ${-r * 0.95} A ${r} ${r} 0 1 1 ${-r} ${-r * 0.95} C ${-r} ${-r * 1.45} ${-r * 0.25} ${-r * 2.05} 0 ${-r * 2.7} Z`;
const Drop: React.FC<{x: number; y: number; r: number; pale?: boolean; shadow?: boolean}> = ({x, y, r, pale, shadow = true}) => (
  <g transform={`translate(${x} ${y})`}>
    {shadow ? <ellipse cx={0} cy={r * 0.12} rx={r * 1.25} ry={r * 0.22} fill="url(#shadow)" /> : null}
    <path d={dropD(r)} fill={pale ? 'url(#pale)' : 'url(#gold)'} stroke={pale ? '#D8C98E' : 'none'} strokeWidth={3} />
    <ellipse cx={-r * 0.42} cy={-r * 1.15} rx={r * 0.16} ry={r * 0.34} fill="#fff" opacity={pale ? 0.8 : 0.5} transform={`rotate(18 ${-r * 0.42} ${-r * 1.15})`} />
    <path d={`M ${r * 0.55} ${-r * 0.55} A ${r * 0.62} ${r * 0.62} 0 0 1 ${r * 0.05} ${-r * 0.08}`} fill="none" stroke="#fff" strokeOpacity={pale ? 0.7 : 0.35} strokeWidth={r * 0.07} strokeLinecap="round" />
  </g>
);

// Sunflower seed in profile: dark shell with pale stripes.
const Seed: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -30 C 14 -22 16 10 0 30 C -16 10 -14 -22 0 -30 Z" fill="#2E2219" />
    <path d="M -5 -18 C -6 -4 -6 8 -3 20 M 5 -18 C 6 -4 6 8 3 20" stroke="#A89A88" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
);

const Caption: React.FC<{x: number; y: number; children: React.ReactNode; color?: string}> = ({x, y, children, color = COLORS.inkSoft}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.regular} fontSize={42} fill={color}>
    {children}
  </text>
);

// Aroma: soft wavy lines rising.
const Aroma: React.FC<{x: number; y: number; h: number; opacity?: number}> = ({x, y, h, opacity = 1}) => (
  <g opacity={opacity} fill="none" stroke={GOLD_B} strokeWidth={7} strokeLinecap="round">
    {[-60, 0, 60].map((dx, i) => (
      <path key={i} d={`M ${x + dx} ${y} c 26 ${-h * 0.18} -26 ${-h * 0.36} 0 ${-h * 0.54} s -26 ${-h * 0.36} 0 ${-h * (0.82 - i * 0.08)}`} opacity={0.55 + i * 0.15} />
    ))}
  </g>
);

// Spoon seen from above, bowl up; fill 0..1 of the bowl.
const Spoon: React.FC<{x: number; y: number; fill: number; pale?: boolean; missing?: boolean; handle?: number}> = ({x, y, fill, pale, missing, handle = 300}) => {
  const rx = 82;
  const ry = 112;
  const id = `bowl${x}${y}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={ry + handle} rx={90} ry={14} fill="url(#shadow)" />
      <rect x={-15} y={ry - 12} width={30} height={handle} rx={15} fill={COLORS.cream} stroke={LINE} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#FBF5EA" stroke={LINE} strokeWidth={4} />
      <clipPath id={id}>
        <ellipse cx={0} cy={0} rx={rx - 10} ry={ry - 10} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-rx} y={ry - 10 - fill * (ry * 2 - 20)} width={rx * 2} height={ry * 2} fill={pale ? 'url(#pale)' : 'url(#gold)'} />
        {missing ? <line x1={-rx} y1={ry - 10 - (ry * 2 - 20)} x2={rx} y2={ry - 10 - (ry * 2 - 20)} stroke={LINE} strokeOpacity={0.4} strokeWidth={3} strokeDasharray="10 10" /> : null}
      </g>
      {fill > 0.9 && !pale ? <ellipse cx={-26} cy={-40} rx={14} ry={30} fill="#fff" opacity={0.45} transform="rotate(16 -26 -40)" /> : null}
    </g>
  );
};

const Flame: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 -70 C 30 -36 52 -10 44 22 C 38 48 18 62 0 62 C -18 62 -38 48 -44 22 C -50 -2 -30 -18 -20 -36 C -16 -18 -6 -12 -2 -14 C -8 -34 -6 -52 0 -70 Z" fill="#E8833A" />
    <path d="M 0 -6 C 14 8 22 22 18 36 C 14 48 6 54 0 54 C -6 54 -16 48 -18 36 C -20 22 -8 12 0 -6 Z" fill="#F6C453" />
  </g>
);

const Steam: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke="#9C9E99" strokeWidth={8} strokeLinecap="round">
    <path d="M -36 50 c 22 -22 -22 -44 0 -66 s -22 -44 0 -66" />
    <path d="M 0 56 c 22 -22 -22 -44 0 -66 s -22 -44 0 -66" />
    <path d="M 36 50 c 22 -22 -22 -44 0 -66 s -22 -44 0 -66" />
  </g>
);

const Arrow: React.FC<{x1: number; x2: number; y: number}> = ({x1, x2, y}) => (
  <g stroke={LINE} strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" fill="none">
    <line x1={x1} y1={y} x2={x2} y2={y} strokeDasharray="2 14" />
    <path d={`M ${x2 - 14} ${y - 12} L ${x2} ${y} L ${x2 - 14} ${y + 12}`} />
  </g>
);

// --- scenes -------------------------------------------------------------------------

const S1 = () => (
  <>
    <Text lines={['Чем сыродавленное', 'подсолнечное лучше', 'магазинного?']} />
    <Svg>
      <Drop x={330} y={1300} r={150} />
      <Drop x={750} y={1300} r={150} pale />
      <Caption x={330} y={1420}>сыродавленное</Caption>
      <Caption x={750} y={1420}>магазинное</Caption>
    </Svg>
  </>
);

const S2 = () => {
  const seeds = Array.from({length: 22}, (_, i) => ({x: 300 + (i % 11) * 48 + (i > 10 ? 24 : 0), y: 1016 + (i > 10 ? 26 : 0), rot: 90 + ((i * 37) % 40) - 20}));
  return (
    <>
      <Text lines={['Семена просто', 'отжимают прессом']} sub={['без нагрева']} />
      <Svg>
        {/* upper plate pressing down */}
        <rect x={250} y={880} width={580} height={90} rx={22} fill="#D9D3C7" stroke={LINE} strokeWidth={4} />
        <rect x={500} y={740} width={80} height={140} rx={14} fill="#D9D3C7" stroke={LINE} strokeWidth={4} />
        <g stroke={LINE} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.6}>
          <path d="M 400 790 L 400 850 M 384 834 L 400 850 L 416 834" />
          <path d="M 680 790 L 680 850 M 664 834 L 680 850 L 696 834" />
        </g>
        {/* seeds, flattened under the plate */}
        {seeds.map((s, i) => (
          <Seed key={i} x={s.x} y={s.y} rot={s.rot} s={0.82} />
        ))}
        {/* lower plate with holes */}
        <rect x={250} y={1066} width={580} height={44} rx={14} fill="#D9D3C7" stroke={LINE} strokeWidth={4} />
        {[380, 470, 560, 650, 740].map((x) => (
          <circle key={x} cx={x} cy={1088} r={7} fill={GOLD_B} />
        ))}
        {/* oil leaves the press as drops */}
        <Drop x={470} y={1200} r={16} shadow={false} />
        <Drop x={650} y={1176} r={13} shadow={false} />
        <Drop x={540} y={1420} r={60} />
      </Svg>
    </>
  );
};

const S3 = () => (
  <>
    <Text lines={['Остаются запах', 'и вкус семян']} />
    <Svg>
      <Aroma x={540} y={880} h={260} />
      <Drop x={540} y={1400} r={160} />
    </Svg>
  </>
);

const S4 = () => (
  <>
    <Text lines={['В одной ложке', 'треть нормы витамина E']} sub={['он защищает клетки']} />
    <Svg>
      <Spoon x={300} y={900} fill={1} />
      <Spoon x={540} y={900} fill={0} />
      <Spoon x={780} y={900} fill={0} />
      {/* vitamin E badge on the full spoon */}
      <circle cx={300} cy={900} r={46} fill="#FBF5EA" opacity={0.9} />
      <text x={300} y={918} textAnchor="middle" fontFamily={FONT.medium} fontSize={54} fill={GOLD_B}>
        E
      </text>
      <path d="M 210 1350 Q 210 1376 236 1376 L 844 1376 Q 870 1376 870 1350" fill="none" stroke={LINE} strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" />
      <Caption x={540} y={1440}>дневная норма</Caption>
    </Svg>
  </>
);

const S5 = () => (
  <>
    <Text lines={['Магазинное масло часто', 'греют и обрабатывают', 'паром']} sub={['запах уходит,', 'витамина E меньше']} />
    <Svg>
      <Drop x={170} y={1040} r={56} />
      <Arrow x1={240} x2={360} y={980} />
      <Flame x={440} y={970} />
      <Steam x={640} y={1000} />
      <Arrow x1={720} x2={840} y={980} />
      <Drop x={920} y={1040} r={56} pale />
      <Caption x={440} y={1110}>нагрев</Caption>
      <Caption x={640} y={1110}>пар</Caption>
      <Spoon x={540} y={1310} fill={0.62} missing handle={150} />
    </Svg>
  </>
);

const S6 = () => (
  <>
    <Svg>
      <Drop x={540} y={980} r={130} />
      <text x={540} y={1210} textAnchor="middle" fontFamily={FONT.medium} fontSize={190} letterSpacing="-0.03em" fill={RED}>
        600<tspan fontSize={100} dx={14}>руб.</tspan>
      </text>
      <path d="M 300 1500 L 780 1500" stroke={GOLD_B} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(780 1500)">
        <path d={dropD(9)} fill="url(#gold)" transform="translate(0 30)" />
      </g>
    </Svg>
    <Text top={1290} lines={[]} sub={['Заказывайте на']} />
    <div style={{position: 'absolute', top: 1366, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: TYPE.title.size, letterSpacing: '-0.03em', color: COLORS.ink}}>maslarada.ru</div>
  </>
);

const SCENES = [S1, S2, S3, S4, S5, S6];
export const SUN_FRAMES_COUNT = SCENES.length;

export const SunFrames: React.FC = () => {
  const Scene = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return (
    <Stage>
      <AbsoluteFill>
        <Scene />
      </AbsoluteFill>
    </Stage>
  );
};
