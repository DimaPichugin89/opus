// Style frames for the sunflower reel: one still per scene, frame n shows scene n.
// Story: ordinary (refined) oil on black -> why it has no smell -> what is lost;
// cold-pressed on white -> what stays -> vitamin E per tablespoon -> order.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT, TYPE} from '../../theme';

type Theme = {bg: string; text: string; sub: string; line: string; fill: string};
const LIGHT: Theme = {bg: '#FFFFFF', text: COLORS.ink, sub: COLORS.inkSoft, line: '#4A3424', fill: '#FFFFFF'};
const DARK: Theme = {bg: '#0E0C0A', text: '#F5F1EA', sub: '#A9A39A', line: '#D9D3C9', fill: '#1A1714'};
const ThemeCtx = React.createContext(LIGHT);
const useTheme = () => React.useContext(ThemeCtx);

const GOLD_A = '#F6C453';
const GOLD_B = '#C9821A';

const Text: React.FC<{lines: string[]; sub?: string[]; top?: number}> = ({lines, sub = [], top = 290}) => {
  const t = useTheme();
  return (
    <div style={{position: 'absolute', top, left: 64, right: 64, textAlign: 'center'}}>
      {lines.map((l) => (
        <div key={l} style={{fontFamily: FONT.medium, fontSize: TYPE.para.size, lineHeight: TYPE.para.lineHeight, letterSpacing: `${TYPE.para.tracking}em`, color: t.text}}>
          {l}
        </div>
      ))}
      {sub.map((l, i) => (
        <div key={l} style={{fontFamily: FONT.regular, fontSize: 52, lineHeight: 1.2, color: t.sub, marginTop: i === 0 ? 18 : 0}}>
          {l}
        </div>
      ))}
    </div>
  );
};

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="gold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor={GOLD_A} />
        <stop offset="1" stopColor={GOLD_B} />
      </linearGradient>
      <linearGradient id="pale" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#F4EDCF" />
        <stop offset="1" stopColor="#DCD0A0" />
      </linearGradient>
      <filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>
    {children}
  </svg>
);

const Label: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; color?: string; weight?: 'medium' | 'regular'}> = ({x, y, children, size = 40, color, weight = 'regular'}) => {
  const t = useTheme();
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT[weight]} fontSize={size} fill={color ?? t.sub}>
      {children}
    </text>
  );
};

// --- drawing kit ---------------------------------------------------------------------

// Glass bowl, side view; the oil inside is gold (cold-pressed) or pale (refined).
const Bowl: React.FC<{x: number; y: number; pale?: boolean}> = ({x, y, pale}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -230 0 C -220 150 -120 210 0 210 C 120 210 220 150 230 0 Z" fill={t.fill} stroke={t.line} strokeWidth={4} />
      <path d="M -200 40 C -186 140 -100 186 0 186 C 100 186 186 140 200 40 Z" fill={pale ? 'url(#pale)' : 'url(#gold)'} />
      <ellipse cx={0} cy={40} rx={200} ry={26} fill={pale ? '#F7F1D9' : GOLD_A} />
      <ellipse cx={0} cy={0} rx={230} ry={34} fill="none" stroke={t.line} strokeWidth={4} />
      <path d="M -170 70 C -160 120 -120 150 -80 165" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

// Aroma: crisp golden curls rising. Faded = dashed and grey, the smell is gone.
const Aroma: React.FC<{x: number; y: number; faded?: boolean; s?: number}> = ({x, y, faded, s = 1}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={faded ? t.line : GOLD_B} strokeOpacity={faded ? 0.3 : 1} strokeWidth={7} strokeLinecap="round" strokeDasharray={faded ? '4 16' : undefined}>
      {[-70, 0, 70].map((dx, i) => (
        <path key={i} d={`M ${dx} 0 c -34 -30 34 -60 0 -90 c -34 -30 30 -54 6 -84 c -14 -18 4 -30 18 -22`} />
      ))}
    </g>
  );
};

// Steam: soft blurred plumes, hazy and straight, unlike the crisp aroma curls.
const Steam: React.FC<{x: number; y: number; h: number; w?: number}> = ({x, y, h, w = 70}) => (
  <g filter="url(#steamBlur)" fill="#CFCBC4">
    {[-w, 0, w].map((dx, i) => (
      <path key={i} d={`M ${x + dx - 14} ${y} C ${x + dx - 30} ${y - h * 0.4} ${x + dx + 26} ${y - h * 0.6} ${x + dx - 4} ${y - h - (i % 2) * 40} C ${x + dx + 40} ${y - h * 0.6} ${x + dx + 10} ${y - h * 0.3} ${x + dx + 14} ${y} Z`} fillOpacity={0.55} />
    ))}
  </g>
);

const Flame: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -70 C 30 -36 52 -10 44 22 C 38 48 18 62 0 62 C -18 62 -38 48 -44 22 C -50 -2 -30 -18 -20 -36 C -16 -18 -6 -12 -2 -14 C -8 -34 -6 -52 0 -70 Z" fill="#E8833A" />
    <path d="M 0 -6 C 14 8 22 22 18 36 C 14 48 6 54 0 54 C -6 54 -16 48 -18 36 C -20 22 -8 12 0 -6 Z" fill={GOLD_A} />
  </g>
);

// Sunflower seed: dark shell with pale stripes.
const Seed: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -30 C 14 -22 16 10 0 30 C -16 10 -14 -22 0 -30 Z" fill="#2E2219" />
    <path d="M -5 -18 C -6 -4 -6 8 -3 20 M 5 -18 C 6 -4 6 8 3 20" stroke="#B9AD9C" strokeWidth={2.4} fill="none" strokeLinecap="round" />
  </g>
);

// Vitamin E as a coin of three parts; `parts` of them are present, the rest are dashed outlines.
const VitaminE: React.FC<{x: number; y: number; r: number; parts: number; drift?: boolean}> = ({x, y, r, parts, drift}) => {
  const t = useTheme();
  const seg = (k: number) => {
    const a0 = ((k * 120 - 90 + 3) * Math.PI) / 180;
    const a1 = (((k + 1) * 120 - 90 - 3) * Math.PI) / 180;
    const ri = r * 0.62;
    const p = (a: number, rr: number) => `${x + rr * Math.cos(a)} ${y + rr * Math.sin(a)}`;
    return `M ${p(a0, r)} A ${r} ${r} 0 0 1 ${p(a1, r)} L ${p(a1, ri)} A ${ri} ${ri} 0 0 0 ${p(a0, ri)} Z`;
  };
  return (
    <g>
      {[0, 1, 2].map((k) => {
        const on = k < parts;
        const off = drift && !on ? `translate(${r * 0.28} ${-r * 0.2})` : undefined;
        return <path key={k} d={seg(k)} transform={off} fill={on ? 'url(#gold)' : 'none'} stroke={on ? 'none' : t.line} strokeOpacity={0.7} strokeWidth={4} strokeDasharray={on ? undefined : '10 10'} />;
      })}
      <text x={x} y={y + r * 0.2} textAnchor="middle" fontFamily={FONT.medium} fontSize={r * 0.56} fill={parts ? GOLD_B : t.line}>
        E
      </text>
    </g>
  );
};

// Generic clear supermarket bottle, upright, mouth at (0, -260).
const PlainBottle: React.FC = () => {
  const t = useTheme();
  return (
    <g>
      <rect x={-24} y={-270} width={48} height={28} rx={6} fill={t.line} />
      <path d="M -20 -242 L -20 -190 C -20 -150 -85 -140 -85 -80 L -85 210 Q -85 240 -55 240 L 55 240 Q 85 240 85 210 L 85 -80 C 85 -140 20 -150 20 -190 L 20 -242 Z" fill="none" stroke={t.line} strokeWidth={4} />
      <path d="M -77 -40 L 77 -40 L 77 210 Q 77 232 55 232 L -55 232 Q -77 232 -77 210 Z" fill="url(#pale)" opacity={0.9} />
    </g>
  );
};

const Press: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={t.line} strokeWidth={4} fill="#EDE8E0">
      <rect x={-24} y={-130} width={48} height={80} rx={10} />
      <rect x={-190} y={-52} width={380} height={52} rx={16} />
      {Array.from({length: 11}, (_, i) => (
        <Seed key={i} x={-160 + i * 32} y={18} rot={90 + ((i * 41) % 30) - 15} s={0.62} />
      ))}
      <rect x={-190} y={36} width={380} height={30} rx={12} />
    </g>
  );
};

const Thermo: React.FC<{x: number; y: number; label: string; color: string}> = ({x, y, label, color}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-14} y={-150} width={28} height={170} rx={14} fill={t.fill} stroke={t.line} strokeWidth={4} />
      <circle cx={0} cy={36} r={30} fill={color} stroke={t.line} strokeWidth={4} />
      <rect x={-6} y={-60} width={12} height={90} rx={6} fill={color} />
      <text x={0} y={120} textAnchor="middle" fontFamily={FONT.medium} fontSize={46} fill={color}>
        {label}
      </text>
    </g>
  );
};

const Arrow: React.FC<{x: number; y1: number; y2: number}> = ({x, y1, y2}) => {
  const t = useTheme();
  return (
    <g stroke={t.line} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" fill="none">
      <line x1={x} y1={y1} x2={x} y2={y2} strokeDasharray="2 14" />
      <path d={`M ${x - 12} ${y2 - 14} L ${x} ${y2} L ${x + 12} ${y2 - 14}`} />
    </g>
  );
};

// Tablespoon from above, bowl up, full of oil.
const Tablespoon: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y}) rotate(-24)`}>
      <rect x={-17} y={110} width={34} height={300} rx={17} fill={t.fill} stroke={t.line} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={96} ry={128} fill={t.fill} stroke={t.line} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={84} ry={116} fill="url(#gold)" />
      <ellipse cx={-30} cy={-50} rx={13} ry={30} fill="#fff" opacity={0.45} transform="rotate(16 -30 -50)" />
    </g>
  );
};

const PhoneIcon: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-52} y={-90} width={104} height={180} rx={18} fill={t.fill} stroke={t.line} strokeWidth={5} />
      <path d="M -22 2 L -6 18 L 24 -16" fill="none" stroke={GOLD_B} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

const BrandBottle: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={t.line} strokeWidth={5} strokeLinejoin="round">
      <rect x={-26} y={-300} width={52} height={40} rx={8} fill="#3A2C22" />
      <path d="M -22 -260 L -22 -200 C -22 -160 -95 -150 -95 -90 L -95 210 Q -95 240 -65 240 L 65 240 Q 95 240 95 210 L 95 -90 C 95 -150 22 -160 22 -200 L 22 -260 Z" fill="url(#gold)" />
      <rect x={-84} y={-20} width={168} height={180} rx={10} fill="#FFFFFF" />
      <rect x={-72} y={92} width={144} height={44} rx={8} fill="#FFF1D0" stroke={GOLD_B} strokeWidth={4} />
      <text x={0} y={122} textAnchor="middle" fontFamily={FONT.medium} fontSize={21} fill={GOLD_B} stroke="none">
        дата отжима
      </text>
      <line x1={-54} y1={30} x2={54} y2={30} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <line x1={-54} y1={60} x2={30} y2={60} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
    </g>
  );
};

// --- scenes ---------------------------------------------------------------------------

// 1. The familiar fact: ordinary sunflower oil pours, and nothing rises above it.
const S1 = () => (
  <>
    <Text lines={['Почему обычное', 'подсолнечное', 'ничем не пахнет?']} />
    <Svg>
      <g transform="translate(360 830) rotate(125)">
        <PlainBottle />
      </g>
      <path d="M 573 978 C 578 1070 572 1180 572 1290" stroke="url(#pale)" strokeWidth={14} strokeLinecap="round" fill="none" />
      <Bowl x={572} y={1300} pale />
    </Svg>
  </>
);

// 2. The cause: seeds are heated, the oil is steamed at 200 °C.
const S2 = () => {
  const t = DARK;
  const seeds = Array.from({length: 14}, (_, i) => ({x: 370 + (i % 7) * 56 + (i > 6 ? 28 : 0), y: 790 + (i > 6 ? 22 : 0), rot: 90 + ((i * 37) % 40) - 20}));
  return (
    <>
      <Text lines={['Семена прогревают,', 'а масло пропаривают', 'при 200 °C']} />
      <Svg>
        {/* step 1: seeds on a hot tray */}
        <rect x={330} y={826} width={420} height={22} rx={11} fill="#5A544D" stroke={t.line} strokeWidth={3} />
        {seeds.map((s, i) => (
          <Seed key={i} x={s.x} y={s.y} rot={s.rot} s={0.8} />
        ))}
        <Flame x={440} y={930} s={0.8} />
        <Flame x={540} y={924} s={0.95} />
        <Flame x={640} y={930} s={0.8} />
        <Arrow x={540} y1={1010} y2={1090} />
        {/* step 2: oil in a tank, steam rising through it */}
        <rect x={380} y={1190} width={320} height={300} rx={40} fill="#1A1714" stroke={t.line} strokeWidth={4} />
        <rect x={396} y={1290} width={288} height={184} rx={28} fill="url(#pale)" />
        <Steam x={540} y={1200} h={150} w={80} />
        <text x={760} y={1360} fontFamily={FONT.medium} fontSize={56} fill="#F5F1EA">
          200 °C
        </text>
      </Svg>
    </>
  );
};

// 3. The loss: with the smell goes about a third of vitamin E.
const S3 = () => (
  <>
    <Text lines={['Вместе с запахом', 'уходит около трети', 'витамина E']} />
    <Svg>
      <Steam x={760} y={980} h={170} w={40} />
      <VitaminE x={540} y={1150} r={230} parts={2} drift />
      <Label x={540} y={1470}>витамин E</Label>
    </Svg>
  </>
);

// 4. The alternative: seeds pressed at up to 30 °C, golden oil runs out of the press.
const S4 = () => (
  <>
    <Text lines={['Холодный отжим:', 'семена давят прессом', 'до 30 °C']} />
    <Svg>
      <Press x={500} y={860} />
      <path d="M 500 930 C 504 1010 500 1100 500 1230" stroke="url(#gold)" strokeWidth={14} strokeLinecap="round" fill="none" />
      <Bowl x={500} y={1240} />
      <Thermo x={880} y={1080} label="30 °C" color={GOLD_B} />
    </Svg>
  </>
);

// 5. What stays: the same bowl as in scene 1, now golden with aroma; vitamin E complete.
const S5 = () => (
  <>
    <Text lines={['Остаются запах семян', 'и витамин E']} />
    <Svg>
      <Aroma x={360} y={1000} s={0.85} />
      <Bowl x={360} y={1060} />
      <VitaminE x={800} y={1150} r={150} parts={3} />
    </Svg>
  </>
);

// 6. The dose: one tablespoon is about a third of the daily norm.
const S6 = () => (
  <>
    <Text lines={['В столовой ложке', 'около трети нормы', 'витамина E']} />
    <Svg>
      <Tablespoon x={300} y={1000} />
      <VitaminE x={770} y={1050} r={170} parts={1} />
      <Label x={770} y={1290}>дневная норма</Label>
      <Label x={770} y={1340}>15 мг</Label>
    </Svg>
  </>
);

// 7. Why order here: pressed after the order, on the table in 48 hours.
const S7 = () => (
  <>
    <Text lines={['От заказа до стола', 'за 48 часов']} />
    <Svg>
      <PhoneIcon x={200} y={860} />
      <line x1={280} y1={860} x2={400} y2={860} stroke={LIGHT.line} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
      <Press x={540} y={880} s={0.5} />
      <line x1={680} y1={860} x2={800} y2={860} stroke={LIGHT.line} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
      <BrandBottle x={880} y={890} s={0.62} />
      <Label x={200} y={1020}>заказ</Label>
      <Label x={540} y={1020}>отжим</Label>
      <Label x={880} y={1080}>у вас</Label>
      <path d="M 150 1120 Q 150 1146 176 1146 L 904 1146 Q 930 1146 930 1120" fill="none" stroke={GOLD_B} strokeWidth={4} strokeLinecap="round" />
      <Label x={540} y={1210} color={GOLD_B} weight="medium" size={48}>
        48 часов
      </Label>
    </Svg>
    <Text top={1300} lines={[]} sub={['Заказывайте на']} />
    <div style={{position: 'absolute', top: 1376, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: TYPE.title.size, letterSpacing: '-0.03em', color: COLORS.ink}}>maslarada.ru</div>
  </>
);

const SCENES: {C: React.FC; theme: Theme}[] = [
  {C: S1, theme: DARK},
  {C: S2, theme: DARK},
  {C: S3, theme: DARK},
  {C: S4, theme: LIGHT},
  {C: S5, theme: LIGHT},
  {C: S6, theme: LIGHT},
  {C: S7, theme: LIGHT},
];
export const SUN_FRAMES_COUNT = SCENES.length;

export const SunFrames: React.FC = () => {
  const {C, theme} = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return (
    <ThemeCtx.Provider value={theme}>
      <AbsoluteFill style={{background: theme.bg}}>
        <C />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
