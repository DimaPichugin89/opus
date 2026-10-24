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

// Alkali step: a lab flask with liquid and rising bubbles.
const FlaskIcon: React.FC = () => {
  const t = useTheme();
  return (
    <g>
      <circle cx={540} cy={1250} r={330} fill="url(#glow)" />
      <path d="M 490 1020 L 490 1150 L 380 1400 Q 370 1440 410 1440 L 670 1440 Q 710 1440 700 1400 L 590 1150 L 590 1020" {...mono(t)} />
      <line x1={470} y1={1020} x2={610} y2={1020} {...mono(t)} />
      <path d="M 426 1320 L 654 1320 L 690 1404 Q 696 1426 672 1426 L 408 1426 Q 384 1426 390 1404 Z" fill={GOLD} opacity={0.85} />
      {[[500, 1270, 12], [560, 1230, 9], [530, 1180, 7]].map(([x, y, r]) => (
        <circle key={y} cx={x} cy={y} r={r} {...mono(t)} />
      ))}
    </g>
  );
};

const S1 = () => (
  <>
    {/* the factory line of ordinary refined oil, cooled and dimmed */}
    <Img src={staticFile('photo/refined_line.webp')} style={{position: 'absolute', left: 0, bottom: 0, width: 1080, height: 720, objectFit: 'cover', filter: 'saturate(0.75) brightness(0.8)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1200, height: 260, background: 'linear-gradient(#0D0B09, rgba(13,11,9,0))'}} />
    <Head top={300} size={80} lines={['Почему подсолнечное', 'масло из магазина', 'ничем не пахнет', 'и не имеет вкуса?']} />
  </>
);

const S2 = () => (
  <>
    <div style={{position: 'absolute', top: 640, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: 1100, lineHeight: 1, letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '3px #5E5850'}}>4</div>
    <Sub top={300} size={52} lines={['Потому что это']} />
    <Head top={370} size={140} lines={['Рафинация']} />
    <Sub top={540} size={46} lines={['4 этапа, которые масло проходит', 'на заводе, прежде чем попасть на полку']} />
  </>
);

// Overline sits 100 px above the headline: a clear gap, not glued to it.
const H = 400;

const Step: React.FC<{n: number; name: string; lines: string[]; icon: React.ReactNode}> = ({n, name, lines, icon}) => (
  <>
    <Ghost>{n}</Ghost>
    <Overline top={300}>{name}</Overline>
    <Head top={H} lines={lines} />
    <Svg>{icon}</Svg>
  </>
);

const S3 = () => <Step n={1} name="Жарка" lines={['Семена жарят,', 'чтобы выжать', 'больше масла']} icon={<Reason1Icon />} />;
const S4 = () => <Step n={2} name="Нейтрализация" lines={['Масло обрабатывают', 'щёлочью']} icon={<FlaskIcon />} />;
const S5 = () => <Step n={3} name="Отбеливание" lines={['Масло отбеливают,', 'чтобы убрать цвет']} icon={<Reason2Icon />} />;
const S5b = () => <Step n={4} name="Дезодорация" lines={['Пропаривают', 'при 200 °C и выше,', 'чтобы убрать', 'запах и вкус']} icon={<Reason3Icon />} />;

// What reaches the shelf: four losses, each with a red cross.
const LossRow: React.FC<{y: number; title: string; note: string; first?: boolean}> = ({y, title, note, first}) => (
  <>
    {first ? null : <div style={{position: 'absolute', top: y - 36, left: LEFT, right: LEFT, height: 2, background: 'rgba(255,255,255,0.1)'}} />}
    <svg width={80} height={80} viewBox="-40 -40 80 80" style={{position: 'absolute', left: LEFT - 6, top: y - 2}}>
      <circle r={30} fill="none" stroke="#E2312A" strokeWidth={4} />
      <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke="#E2312A" strokeWidth={4} strokeLinecap="round" />
    </svg>
    <div style={{position: 'absolute', top: y, left: LEFT + 110, right: LEFT, fontFamily: FONT.medium, fontSize: 58, lineHeight: 1.05, letterSpacing: '-0.025em', color: DARK.text}}>{title}</div>
    <div style={{position: 'absolute', top: y + 74, left: LEFT + 110, right: LEFT - 20, fontFamily: FONT.regular, fontSize: 40, lineHeight: 1.22, color: DARK.sub}}>{note}</div>
  </>
);

const S5c = () => (
  <>
    <Overline top={300}>Что в итоге</Overline>
    <Head top={H} lines={['Какое масло продают', 'в магазинах']} />
    <LossRow first y={680} title="Ни запаха, ни вкуса" note="их убирают паром специально" />
    <LossRow y={910} title="Витамина E на треть меньше" note="теряется при рафинации" />
    <LossRow y={1140} title="Лецитин удалён" note="его убирают почти полностью" />
    <LossRow y={1370} title="Появляются трансжиры" note="при нагреве выше 200 °C" />
  </>
);

// First white screen: the turn to the real benefit, with our bottle.
const S6 = () => (
  <>
    <Overline top={300}>Масларада</Overline>
    <Head top={H} lines={['В чём настоящая', 'польза', 'сыродавленного масла']} />
    <Sub top={H + 290} lines={['подсолнечное, холодного отжима']} />
    <Svg>
      <ellipse cx={540} cy={1260} rx={340} ry={360} fill="url(#glow)" opacity={0.6} />
    </Svg>
    <Bottle oil="sun" x={540} bottom={1570} height={720} />
  </>
);

const S7 = () => (
  <>
    <Overline top={300}>Как его делают</Overline>
    <Head top={H} lines={['Очищенные семена', 'давят прессом', 'при температуре']} />
    <Figure top={H + 280} size={250}>до 30 °C</Figure>
    <Sub top={H + 560} size={56} lines={['Без жарки, щёлочи,', 'отбеливания и пара']} />
    <Svg>
      <g transform="translate(540 1400)">
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

// One benefit per screen: name, a big gold sign, two short lines.
const Benefit: React.FC<{overline?: string; title: string; art: React.ReactNode; lines: string[]; linesTop?: number}> = ({overline = 'Что содержится в масле', title, art, lines, linesTop = 1180}) => (
  <>
    <Overline top={300}>{overline}</Overline>
    <Head top={H} size={110} lines={[title]} />
    <Svg>{art}</Svg>
    <Sub top={linesTop} size={54} lines={lines} />
  </>
);

const goldStroke = {fill: 'none', stroke: GOLD, strokeWidth: 8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

const S8 = () => (
  <Benefit
    title="Витамин E"
    art={
      <g>
        <text x={LEFT + 10} y={870} fontFamily={FONT.medium} fontSize={300} letterSpacing="-0.05em" fill={GOLD}>
          1
        </text>
        <line x1={LEFT + 210} y1={980} x2={LEFT + 400} y2={640} stroke={GOLD} strokeWidth={14} strokeLinecap="round" />
        <text x={LEFT + 380} y={1080} fontFamily={FONT.medium} fontSize={300} letterSpacing="-0.05em" fill={GOLD}>
          3
        </text>
      </g>
    }
    lines={['дневной нормы в одной', 'столовой ложке. Помогает', 'защищать клетки']}
  />
);

const S8b = () => (
  <Benefit
    title="Лецитин"
    art={
      <g transform="translate(330 860)" {...goldStroke}>
        <circle cx={-60} cy={-50} r={80} />
        <circle cx={110} cy={-10} r={60} />
        <circle cx={10} cy={120} r={70} />
        <line x1={-4} y1={-20} x2={58} y2={-14} />
        <line x1={-30} y1={26} x2={-12} y2={58} />
        <line x1={84} y1={44} x2={60} y2={72} />
      </g>
    }
    lines={['При рафинации его удаляют', 'почти полностью.', 'В холодном отжиме он остаётся']}
  />
);

const S8c = () => (
  <Benefit
    title="Запах и вкус семян"
    art={
      <g>
        <g transform="translate(330 900) rotate(-18)" {...goldStroke}>
          <path d="M 0 -170 C 80 -126 92 60 0 170 C -92 60 -80 -126 0 -170 Z" />
          <path d="M -24 -98 C -28 -22 -28 48 -12 108 M 24 -98 C 28 -22 28 48 12 108" strokeWidth={5} strokeOpacity={0.55} />
        </g>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${560 + k * 90} 1000 c -40 -36 40 -72 0 -108 c -40 -36 36 -66 8 -100 c -16 -20 4 -36 22 -26`} {...goldStroke} strokeWidth={7} opacity={0.6 + k * 0.2} />
        ))}
      </g>
    }
    lines={['Рафинация убирает их паром.', 'Холодный отжим сохраняет']}
  />
);

const S9 = () => (
  <>
    <Overline top={300}>Чего в масле нет</Overline>
    <Head top={H} size={110} lines={['Трансжиров']} />
    <Figure top={620} size={200}>
      <span style={{color: '#B9AFA4'}}>200 °C</span>
    </Figure>
    <Sub top={830} lines={['при рафинации паром', 'в масле образуются трансжиры']} />
    <div style={{position: 'absolute', top: 1010, left: LEFT, right: LEFT, height: 2, background: 'rgba(38,23,13,0.1)'}} />
    <Figure top={1070} size={200}>
      30 °C
    </Figure>
    <Sub top={1280} lines={['при холодном отжиме', 'они не образуются']} />
  </>
);

const S10 = () => (
  <>
    <Overline top={300}>Отжим только после заказа</Overline>
    <Head top={H} lines={['От заказа до стола']} />
    <Figure top={H + 110} size={230}>
      48 часов
    </Figure>
    {/* full photo, uncropped, flush with the sides and the bottom */}
    <Img src={staticFile('photo/nabor2.jpg')} style={{position: 'absolute', left: 0, bottom: 0, width: 1080, height: 810}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1110, height: 140, background: 'linear-gradient(#FFFFFF, rgba(255,255,255,0))'}} />
  </>
);

const RANGE = ['almond', 'camelina', 'sun', 'thistle', 'pumpkin'];
const S11 = () => (
  <>
    <Sub top={300} size={52} lines={['Заказывайте на']} />
    <Head top={370} size={120} lines={['maslarada.ru']} />
    <Svg>
      <ellipse cx={540} cy={1060} rx={520} ry={340} fill="url(#glow)" />
    </Svg>
    {RANGE.map((oil, i) => (
      <Bottle key={oil} oil={oil} x={140 + i * 200} bottom={1370} height={640} />
    ))}
    <Sub top={1430} size={50} lines={['10 сыродавленных масел', 'из разных культур']} />
  </>
);

const SCENES: {C: React.FC; theme: Theme}[] = [
  {C: S1, theme: DARK},
  {C: S2, theme: DARK},
  {C: S3, theme: DARK},
  {C: S4, theme: DARK},
  {C: S5, theme: DARK},
  {C: S5b, theme: DARK},
  {C: S5c, theme: DARK},
  {C: S6, theme: LIGHT},
  {C: S7, theme: LIGHT},
  {C: S8, theme: LIGHT},
  {C: S8b, theme: LIGHT},
  {C: S8c, theme: LIGHT},
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
