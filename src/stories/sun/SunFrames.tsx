// Style frames for the sunflower reel: one still per scene, frame n shows scene n.
// Cold-pressed scenes sit on white, refined-oil scenes on black.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, FONT, TYPE} from '../../theme';

type Theme = {bg: string; text: string; sub: string; line: string; bowl: string};
const LIGHT: Theme = {bg: '#FFFFFF', text: COLORS.ink, sub: COLORS.inkSoft, line: '#4A3424', bowl: '#FFFFFF'};
const DARK: Theme = {bg: '#0E0C0A', text: '#F5F1EA', sub: '#A9A39A', line: '#D9D3C9', bowl: '#1A1714'};
const ThemeCtx = React.createContext(LIGHT);
const useTheme = () => React.useContext(ThemeCtx);

const GOLD_A = '#F6C453';
const GOLD_B = '#C9821A';
const STEAM = '#8E8A84';

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
        <stop offset="0" stopColor="#EFE6C2" />
        <stop offset="1" stopColor="#D8CB97" />
      </linearGradient>
      <filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <radialGradient id="shadow">
        <stop offset="0" stopColor="#26170D" stopOpacity="0.14" />
        <stop offset="1" stopColor="#26170D" stopOpacity="0" />
      </radialGradient>
    </defs>
    {children}
  </svg>
);

const dropD = (r: number) => `M 0 ${-r * 2.7} C ${r * 0.25} ${-r * 2.05} ${r} ${-r * 1.45} ${r} ${-r * 0.95} A ${r} ${r} 0 1 1 ${-r} ${-r * 0.95} C ${-r} ${-r * 1.45} ${-r * 0.25} ${-r * 2.05} 0 ${-r * 2.7} Z`;
const Drop: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={dropD(r)} fill="url(#gold)" />
    <ellipse cx={-r * 0.42} cy={-r * 1.15} rx={r * 0.16} ry={r * 0.34} fill="#fff" opacity={0.5} transform={`rotate(18 ${-r * 0.42} ${-r * 1.15})`} />
  </g>
);

const Label: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; color?: string; weight?: 'medium' | 'regular'}> = ({x, y, children, size = 42, color, weight = 'regular'}) => {
  const t = useTheme();
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT[weight]} fontSize={size} fill={color ?? t.sub}>
      {children}
    </text>
  );
};

// Vitamin E token: a small golden coin with E; ghost = dashed outline of a lost one.
const VitE: React.FC<{x: number; y: number; r?: number; ghost?: boolean; pale?: boolean}> = ({x, y, r = 24, ghost, pale}) => {
  const t = useTheme();
  if (ghost) return <circle cx={x} cy={y} r={r} fill="none" stroke={GOLD_B} strokeWidth={3.5} strokeDasharray="7 7" />;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={pale ? '#F3EAC6' : '#FFF6DC'} stroke={GOLD_B} strokeWidth={3} />
      <text x={x} y={y + r * 0.42} textAnchor="middle" fontFamily={FONT.medium} fontSize={r * 1.25} fill={GOLD_B}>
        E
      </text>
    </g>
  );
};

// Tablespoon from above, bowl up; fill 0..1; tokens = vitamin E coins inside the bowl.
const Spoon: React.FC<{x: number; y: number; fill: number; pale?: boolean; handle?: number; tokens?: ('on' | 'ghost')[]; s?: number}> = ({x, y, fill, pale, handle = 300, tokens = [], s = 1}) => {
  const t = useTheme();
  const rx = 92;
  const ry = 124;
  const id = `bowl${x}${y}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {t === LIGHT ? <ellipse cx={0} cy={ry + handle} rx={90} ry={14} fill="url(#shadow)" /> : null}
      <rect x={-16} y={ry - 12} width={32} height={handle} rx={16} fill={t.bowl} stroke={t.line} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={t.bowl} stroke={t.line} strokeWidth={4} />
      <clipPath id={id}>
        <ellipse cx={0} cy={0} rx={rx - 11} ry={ry - 11} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-rx} y={ry - 11 - fill * (ry * 2 - 22)} width={rx * 2} height={ry * 2} fill={pale ? 'url(#pale)' : 'url(#gold)'} />
      </g>
      {fill > 0.9 ? <ellipse cx={-34} cy={-56} rx={12} ry={28} fill="#fff" opacity={0.4} transform="rotate(16 -34 -56)" /> : null}
      {tokens.map((k, i) => (
        <VitE key={i} x={0} y={(i - (tokens.length - 1) / 2) * 62} ghost={k === 'ghost'} pale={pale} />
      ))}
    </g>
  );
};

// Aroma: golden curls rising (never straight, so they can't be mistaken for steam).
const Aroma: React.FC<{x: number; y: number; faded?: boolean}> = ({x, y, faded}) => {
  const t = useTheme();
  return (
    <g fill="none" stroke={faded ? t.line : GOLD_B} strokeOpacity={faded ? 0.35 : 1} strokeWidth={7} strokeLinecap="round" strokeDasharray={faded ? '4 16' : undefined}>
      {[-70, 0, 70].map((dx, i) => (
        <path key={i} d={`M ${x + dx} ${y} c -34 -30 34 -60 0 -90 c -34 -30 30 -54 6 -84 c -14 -18 4 -30 18 -22`} />
      ))}
    </g>
  );
};

// Steam: soft blurred plumes rising (hazy and straight, so it can't be mistaken for the crisp golden aroma curls).
const Steam: React.FC<{x: number; y: number; h: number}> = ({x, y, h}) => (
  <g filter="url(#steamBlur)" fill="#CFCBC4">
    {[-70, 0, 70].map((dx, i) => (
      <path key={i} d={`M ${x + dx - 14} ${y} C ${x + dx - 30} ${y - h * 0.4} ${x + dx + 26} ${y - h * 0.6} ${x + dx - 4} ${y - h - (i % 2) * 40} C ${x + dx + 40} ${y - h * 0.6} ${x + dx + 10} ${y - h * 0.3} ${x + dx + 14} ${y} Z`} fillOpacity={0.55} />
    ))}
  </g>
);

const Press: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`} stroke={t.line} strokeWidth={4} fill="#EDE8E0">
      <rect x={-22} y={-110} width={44} height={70} rx={10} />
      <rect x={-150} y={-44} width={300} height={44} rx={14} />
      <g fill="#3A2C22" stroke="none">
        {Array.from({length: 9}, (_, i) => (
          <ellipse key={i} cx={-120 + i * 30} cy={14} rx={14} ry={7} />
        ))}
      </g>
      <rect x={-150} y={28} width={300} height={24} rx={10} />
    </g>
  );
};

const BottleIcon: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`} stroke={t.line} strokeWidth={5} strokeLinejoin="round">
      <rect x={-26} y={-300} width={52} height={40} rx={8} fill="#3A2C22" />
      <path d="M -22 -260 L -22 -200 C -22 -160 -95 -150 -95 -90 L -95 210 Q -95 240 -65 240 L 65 240 Q 95 240 95 210 L 95 -90 C 95 -150 22 -160 22 -200 L 22 -260 Z" fill="url(#gold)" />
      <rect x={-84} y={-20} width={168} height={180} rx={10} fill="#FFFFFF" />
      <line x1={-54} y1={30} x2={54} y2={30} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <line x1={-54} y1={64} x2={30} y2={64} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <rect x={-72} y={92} width={144} height={44} rx={8} fill="#FFF1D0" stroke={GOLD_B} strokeWidth={4} />
      <text x={0} y={122} textAnchor="middle" fontFamily={FONT.medium} fontSize={21} fill={GOLD_B} stroke="none">
        дата отжима
      </text>
    </g>
  );
};

// --- scenes -------------------------------------------------------------------------

const S1 = () => (
  <>
    <Text lines={['Холодный отжим', 'или рафинированное?']} />
    <Svg>
      <Spoon x={540} y={1020} fill={0} />
    </Svg>
  </>
);

const S2 = () => (
  <>
    <Text lines={['Холодный отжим:', 'пресс, до 30 °C']} />
    <Svg>
      <Press x={540} y={760} />
      <Drop x={540} y={900} r={18} />
      <Spoon x={540} y={1130} fill={0.45} handle={280} />
    </Svg>
  </>
);

const S3 = () => (
  <>
    <Text lines={['Аромат семян', 'и мягкий вкус']} />
    <Svg>
      <Aroma x={540} y={930} />
      <Spoon x={540} y={1110} fill={1} handle={300} />
    </Svg>
  </>
);

const S4 = () => (
  <>
    <Text lines={['В столовой ложке', 'около трети нормы', 'витамина E']} sub={['он помогает защищать клетки']} />
    <Svg>
      <Spoon x={290} y={920} fill={1} handle={240} s={0.92} tokens={['on', 'on', 'on']} />
      <Spoon x={540} y={920} fill={0} handle={240} s={0.92} />
      <Spoon x={790} y={920} fill={0} handle={240} s={0.92} />
      <path d="M 190 1300 Q 190 1326 216 1326 L 864 1326 Q 890 1326 890 1300" fill="none" stroke={LIGHT.line} strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" />
      <Label x={540} y={1392}>дневная норма 15 мг</Label>
    </Svg>
  </>
);

const S5 = () => (
  <>
    <Text lines={['Рафинированное масло', 'обрабатывают паром', 'больше 200 °C']} />
    <Svg>
      <Steam x={540} y={1000} h={190} />
      <Spoon x={540} y={1180} fill={1} pale handle={260} />
    </Svg>
  </>
);

const S6 = () => (
  <>
    <Text lines={['Так уходят вкус, аромат', 'и около трети', 'витамина E']} />
    <Svg>
      <Aroma x={540} y={980} faded />
      <Spoon x={540} y={1180} fill={1} pale handle={260} tokens={['on', 'on', 'ghost']} />
    </Svg>
  </>
);

const S7 = () => (
  <>
    <Text lines={['Отжим под заказ:', 'от заказа до стола', 'за 48 часов']} />
    <Svg>
      <BottleIcon x={540} y={950} />
    </Svg>
    <Text top={1290} lines={[]} sub={['Заказывайте на']} />
    <div style={{position: 'absolute', top: 1366, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: TYPE.title.size, letterSpacing: '-0.03em', color: COLORS.ink}}>maslarada.ru</div>
  </>
);

const SCENES: {C: React.FC; theme: Theme}[] = [
  {C: S1, theme: LIGHT},
  {C: S2, theme: LIGHT},
  {C: S3, theme: LIGHT},
  {C: S4, theme: LIGHT},
  {C: S5, theme: DARK},
  {C: S6, theme: DARK},
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
