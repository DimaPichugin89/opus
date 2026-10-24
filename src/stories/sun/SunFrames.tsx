// Style frames for the sunflower reel: one still per scene, frame n shows scene n.
// Black: why shop sunflower oil has no smell, three reasons. White: our bottle, how it is made,
// what it is rich in, order-to-table time, the range and the call to order.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT} from '../../theme';

type Theme = {bg: string; text: string; sub: string; line: string; ghost: string};
const LIGHT: Theme = {bg: '#FFFFFF', text: COLORS.ink, sub: '#8A7868', line: COLORS.ink, ghost: 'rgba(38,23,13,0.035)'};
const DARK: Theme = {bg: '#0D0B09', text: '#F5F1EA', sub: '#9A938A', line: '#EDE7DD', ghost: 'rgba(255,255,255,0.045)'};
const ThemeCtx = React.createContext(LIGHT);
const useTheme = () => React.useContext(ThemeCtx);

const GOLD = '#C9821A';
const GOLD_L = '#F2B640';
const LEFT = 96;

// --- type --------------------------------------------------------------------------------

const Overline: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', top, left: LEFT, fontFamily: FONT.medium, fontSize: 38, letterSpacing: '0.01em', color: GOLD}}>{children}</div>
);

const Head: React.FC<{top: number; lines: string[]; size?: number; color?: string}> = ({top, lines, size = 84, color}) => {
  const t = useTheme();
  return (
    <div style={{position: 'absolute', top, left: LEFT, right: LEFT, fontFamily: FONT.medium, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.03em', color: color ?? t.text}}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
};

const Sub: React.FC<{top: number; lines: string[]; size?: number}> = ({top, lines, size = 46}) => {
  const t = useTheme();
  return (
    <div style={{position: 'absolute', top, left: LEFT, right: LEFT, fontFamily: FONT.regular, fontSize: size, lineHeight: 1.22, letterSpacing: '-0.01em', color: t.sub}}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
};

// Huge background numeral, cropped by the frame edge: depth without noise.
const Ghost: React.FC<{children: React.ReactNode; right?: number; bottom?: number; size?: number}> = ({children, right = -60, bottom = 120, size = 1250}) => {
  const t = useTheme();
  return <div style={{position: 'absolute', right, bottom, fontFamily: FONT.medium, fontSize: size, lineHeight: 0.8, letterSpacing: '-0.06em', color: t.ghost}}>{children}</div>;
};

// Big gold figure used for the key numbers.
const Figure: React.FC<{top: number; children: React.ReactNode; size?: number}> = ({top, children, size = 330}) => (
  <div style={{position: 'absolute', top, left: LEFT - 12, fontFamily: FONT.medium, fontSize: size, lineHeight: 0.9, letterSpacing: '-0.055em', color: GOLD, whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"'}}>{children}</div>
);

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="gold" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor={GOLD_L} />
        <stop offset="1" stopColor={GOLD} />
      </linearGradient>
      <linearGradient id="fadeUp" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#EDE7DD" stopOpacity="0.9" />
        <stop offset="1" stopColor="#EDE7DD" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={GOLD} stopOpacity="0.16" />
        <stop offset="1" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="contact" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#26170D" stopOpacity="0.28" />
        <stop offset="1" stopColor="#26170D" stopOpacity="0" />
      </radialGradient>
    </defs>
    {children}
  </svg>
);

// --- monoline icons (one stroke weight, one amber accent each) -----------------------------

const STROKE = 4;
const mono = (t: Theme) => ({fill: 'none', stroke: t.line, strokeWidth: STROKE, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

const SeedLine: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} {...mono(t)}>
      <path d="M 0 -62 C 30 -46 34 22 0 62 C -34 22 -30 -46 0 -62 Z" />
      <path d="M -9 -36 C -11 -8 -10 18 -5 40 M 9 -36 C 11 -8 10 18 5 40" strokeOpacity={0.5} strokeWidth={3} />
    </g>
  );
};

// Ordinary shop bottle: tall, ribbed, clear plastic.
const ShopBottle: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useTheme();
  return (
    <g transform={`translate(${x} ${y})`} {...mono(t)}>
      <rect x={-34} y={-430} width={68} height={44} rx={10} />
      <path d="M -26 -386 L -26 -330 C -26 -290 -120 -280 -120 -200 L -120 -120 C -100 -100 -100 -80 -120 -60 L -120 330 Q -120 370 -80 370 L 80 370 Q 120 370 120 330 L 120 -60 C 100 -80 100 -100 120 -120 L 120 -200 C 120 -280 26 -290 26 -330 L 26 -386" />
      <path d="M -120 40 L 120 40" strokeOpacity={0.35} />
      <path d="M -96 -40 L -96 320" strokeOpacity={0.25} strokeWidth={10} />
    </g>
  );
};

const Reason1Icon: React.FC = () => {
  const t = useTheme();
  return (
    <g>
      <circle cx={540} cy={1250} r={330} fill="url(#glow)" />
      <SeedLine x={420} y={1130} rot={-28} />
      <SeedLine x={540} y={1110} rot={4} />
      <SeedLine x={660} y={1130} rot={30} />
      <line x1={310} y1={1210} x2={770} y2={1210} {...mono(t)} />
      {[400, 540, 680].map((x, i) => (
        <path key={x} d={`M ${x} 1450 c -26 -32 26 -64 0 -96 c -26 -32 26 -64 0 -96`} fill="none" stroke={GOLD} strokeWidth={STROKE + 1} strokeLinecap="round" opacity={i === 1 ? 1 : 0.75} />
      ))}
    </g>
  );
};

const dropD = (h: number) => {
  const r = h / 2.7;
  return `M 0 ${-h} C ${r * 0.25} ${-h + r * 0.65} ${r} ${-r * 1.45} ${r} ${-r * 0.95} A ${r} ${r} 0 1 1 ${-r} ${-r * 0.95} C ${-r} ${-r * 1.45} ${-r * 0.25} ${-h + r * 0.65} 0 ${-h} Z`;
};

const Reason2Icon: React.FC = () => {
  const t = useTheme();
  return (
    <g>
      <circle cx={360} cy={1250} r={260} fill="url(#glow)" />
      <g transform="translate(330 1400)">
        <path d={dropD(300)} fill="url(#gold)" />
        <path d={dropD(300)} {...mono(t)} />
      </g>
      <g {...mono(t)} strokeOpacity={0.6}>
        <line x1={460} y1={1290} x2={610} y2={1290} strokeDasharray="2 16" />
        <path d="M 592 1272 L 612 1290 L 592 1308" />
      </g>
      <g transform="translate(750 1400)">
        <path d={dropD(300)} {...mono(t)} />
        <path d={`M ${-300 / 2.7 * 0.55} ${-300 / 2.7 * 0.5} A ${300 / 2.7 * 0.6} ${300 / 2.7 * 0.6} 0 0 0 ${-300 / 2.7 * 0.1} ${-300 / 2.7 * 0.05}`} {...mono(t)} strokeOpacity={0.45} />
      </g>
    </g>
  );
};

const Reason3Icon: React.FC = () => {
  const t = useTheme();
  return (
    <g>
      <circle cx={540} cy={1260} r={330} fill="url(#glow)" />
      {/* steam rising off the oil surface */}
      {[-120, 0, 120].map((dx, i) => (
        <path key={dx} d={`M ${540 + dx} 1390 c -40 -50 40 -100 0 -150 c -40 -50 40 -100 0 -150`} fill="none" stroke="url(#fadeUp)" strokeWidth={STROKE + 2} strokeLinecap="round" opacity={i === 1 ? 1 : 0.8} />
      ))}
      <path d="M 300 1420 Q 420 1400 540 1420 T 780 1420" {...mono(t)} />
      <path d="M 300 1460 Q 420 1440 540 1460 T 780 1460" {...mono(t)} strokeOpacity={0.35} />
      {/* thermometer with the amber bulb */}
      <g {...mono(t)}>
        <path d="M 850 1110 L 850 1330 M 886 1110 L 886 1330" />
        <path d="M 850 1110 A 18 18 0 0 1 886 1110" />
      </g>
      <circle cx={868} cy={1362} r={36} fill={GOLD} />
      <rect x={860} y={1140} width={16} height={200} rx={8} fill={GOLD} />
    </g>
  );
};

// Product cutout standing on a soft contact shadow; height in px, bottom at y.
const Bottle: React.FC<{oil: string; x: number; bottom: number; height: number}> = ({oil, x, bottom, height}) => {
  const w = height * 0.2527;
  return (
    <>
      <div style={{position: 'absolute', left: x - w * 1.1, top: bottom - w * 0.18, width: w * 2.2, height: w * 0.36, background: 'radial-gradient(closest-side, rgba(38,23,13,0.28), rgba(38,23,13,0))'}} />
      <Img src={staticFile(`cut/studio/${oil}.png`)} style={{position: 'absolute', left: x - w / 2, top: bottom - height, width: w, height}} />
    </>
  );
};

// --- scenes ---------------------------------------------------------------------------------

const S1 = () => (
  <>
    <Head top={300} size={92} lines={['Почему подсолнечное', 'масло из магазина', 'ничем не пахнет?']} />
    <Svg>
      <ShopBottle x={540} y={1200} />
    </Svg>
  </>
);

const S2 = () => (
  <>
    <Head top={300} size={92} lines={['Вот 3 причины']} />
    <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: 1100, lineHeight: 1, letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: `3px ${GOLD}`}}>3</div>
  </>
);

const Reason: React.FC<{n: number; lines: string[]; icon: React.ReactNode}> = ({n, lines, icon}) => (
  <>
    <Ghost>{n}</Ghost>
    <Overline top={300}>{`Причина ${n} из 3`}</Overline>
    <Head top={360} lines={lines} />
    <Svg>{icon}</Svg>
  </>
);

const S3 = () => <Reason n={1} lines={['Семена прогревают,', 'чтобы выжать', 'больше масла']} icon={<Reason1Icon />} />;
const S4 = () => <Reason n={2} lines={['Масло очищают', 'и осветляют']} icon={<Reason2Icon />} />;
const S5 = () => <Reason n={3} lines={['Запах убирают паром', 'при 200 °C и выше']} icon={<Reason3Icon />} />;

const S6 = () => (
  <>
    <Overline top={300}>Масларада</Overline>
    <Head top={360} lines={['Сыродавленное масло', 'холодного отжима']} />
    <Svg>
      <ellipse cx={540} cy={1200} rx={360} ry={420} fill="url(#glow)" opacity={0.6} />
    </Svg>
    <Bottle oil="sun" x={540} bottom={1560} height={930} />
  </>
);

const S7 = () => (
  <>
    <Overline top={300}>Как его делают</Overline>
    <Head top={360} lines={['Семена давят прессом', 'при температуре']} />
    <Figure top={560} size={250}>до 30 °C</Figure>
    <Sub top={860} lines={['Масло не прогревают,', 'не очищают и не пропаривают']} />
    <Svg>
      <g transform="translate(540 1330)">
        <SeedLine x={-150} y={0} rot={-90} s={0.9} />
        <SeedLine x={-50} y={0} rot={-90} s={0.9} />
        <SeedLine x={50} y={0} rot={-90} s={0.9} />
        <SeedLine x={150} y={0} rot={-90} s={0.9} />
        <line x1={-260} y1={-62} x2={260} y2={-62} {...mono(LIGHT)} />
        <line x1={-260} y1={62} x2={260} y2={62} {...mono(LIGHT)} />
        <g transform="translate(0 150)">
          <path d={dropD(110)} fill="url(#gold)" />
        </g>
      </g>
    </Svg>
  </>
);

// A row of a spec list: gold icon, title, one explaining line, hairline divider above.
const Row: React.FC<{y: number; icon: React.ReactNode; title: string; note: string; first?: boolean}> = ({y, icon, title, note, first}) => (
  <>
    {first ? null : <div style={{position: 'absolute', top: y - 40, left: LEFT, right: LEFT, height: 2, background: 'rgba(38,23,13,0.1)'}} />}
    <svg width={120} height={120} viewBox="-60 -60 120 120" style={{position: 'absolute', left: LEFT - 20, top: y - 10}}>
      {icon}
    </svg>
    <div style={{position: 'absolute', top: y, left: LEFT + 130, right: LEFT, fontFamily: FONT.medium, fontSize: 60, lineHeight: 1.05, letterSpacing: '-0.025em', color: COLORS.ink}}>{title}</div>
    <div style={{position: 'absolute', top: y + 78, left: LEFT + 130, right: LEFT - 20, fontFamily: FONT.regular, fontSize: 40, lineHeight: 1.22, color: LIGHT.sub}}>{note}</div>
  </>
);

const iconStroke = {fill: 'none', stroke: GOLD, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

const S8 = () => (
  <>
    <Overline top={300}>Чем оно богато</Overline>
    <Head top={360} lines={['Что остаётся в масле']} />
    <Row
      first
      y={600}
      title="Витамин E"
      note="около трети дневной нормы в столовой ложке, помогает защищать клетки"
      icon={
        <g>
          <circle r={40} {...iconStroke} />
          <text y={17} textAnchor="middle" fontFamily={FONT.medium} fontSize={48} fill={GOLD}>
            E
          </text>
        </g>
      }
    />
    <Row
      y={900}
      title="Лецитин"
      note="при очистке масла его удаляют почти полностью"
      icon={
        <g {...iconStroke}>
          <circle cx={-16} cy={-14} r={16} />
          <circle cx={20} cy={-6} r={12} />
          <circle cx={-2} cy={24} r={14} />
        </g>
      }
    />
    <Row
      y={1200}
      title="Запах и вкус семян"
      note="очистка паром убирает их, холодный отжим сохраняет"
      icon={
        <g {...iconStroke}>
          <path d="M 0 -42 C 20 -31 23 15 0 42 C -23 15 -20 -31 0 -42 Z" />
          <path d="M -6 -24 C -7 -5 -7 12 -3 27 M 6 -24 C 7 -5 7 12 3 27" strokeWidth={3} strokeOpacity={0.6} />
        </g>
      }
    />
  </>
);

const S9 = () => (
  <>
    <Overline top={300}>Чего в нём нет</Overline>
    <Head top={360} lines={['Трансжиров от нагрева']} />
    <Figure top={560} size={200}>
      <span style={{color: '#B9AFA4'}}>200 °C</span>
    </Figure>
    <Sub top={770} lines={['при очистке паром', 'в масле образуются трансжиры']} />
    <div style={{position: 'absolute', top: 960, left: LEFT, right: LEFT, height: 2, background: 'rgba(38,23,13,0.1)'}} />
    <Figure top={1020} size={200}>
      30 °C
    </Figure>
    <Sub top={1230} lines={['при холодном отжиме', 'они не образуются']} />
  </>
);

const S10 = () => (
  <>
    <Overline top={300}>Отжим только после заказа</Overline>
    <Head top={360} lines={['От заказа до стола']} />
    <Figure top={470} size={230}>
      48 часов
    </Figure>
    <Img src={staticFile('photo/nabor2.jpg')} style={{position: 'absolute', left: 64, top: 790, width: 952, height: 770, objectFit: 'cover', objectPosition: '30% 50%', borderRadius: 28}} />
  </>
);

const RANGE = ['almond', 'camelina', 'sun', 'thistle', 'pumpkin'];
const S11 = () => (
  <>
    <Sub top={300} size={52} lines={['Заказывайте на']} />
    <Head top={370} size={120} lines={['maslarada.ru']} />
    <Svg>
      <ellipse cx={540} cy={1200} rx={520} ry={360} fill="url(#glow)" />
    </Svg>
    {RANGE.map((oil, i) => (
      <Bottle key={oil} oil={oil} x={140 + i * 200} bottom={1560} height={700} />
    ))}
  </>
);

const SCENES: {C: React.FC; theme: Theme}[] = [
  {C: S1, theme: DARK},
  {C: S2, theme: DARK},
  {C: S3, theme: DARK},
  {C: S4, theme: DARK},
  {C: S5, theme: DARK},
  {C: S6, theme: LIGHT},
  {C: S7, theme: LIGHT},
  {C: S8, theme: LIGHT},
  {C: S9, theme: LIGHT},
  {C: S10, theme: LIGHT},
  {C: S11, theme: LIGHT},
];
export const SUN_FRAMES_COUNT = SCENES.length;

export const SunFrames: React.FC = () => {
  const {C, theme} = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return (
    <ThemeCtx.Provider value={theme}>
      <AbsoluteFill style={{background: theme.bg, overflow: 'hidden'}}>
        <C />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
