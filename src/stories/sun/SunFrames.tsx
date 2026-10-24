// Sunflower reel, animated (SunCold) and as style frames (SunFrames, each scene frozen once settled).
// Black: why shop sunflower oil has no smell or taste, the four refining stages, what reaches the shelf.
// White: our bottle, how it is made, what it contains (one benefit per screen), 48 hours, the range.
import React from 'react';
import {AbsoluteFill, Easing, Freeze, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionPresentation, TransitionPresentationComponentProps, TransitionSeries} from '@remotion/transitions';
import {MixGain, Sfx} from '../../sfx';
import {COLORS, FONT} from '../../theme';

type Theme = {bg: string; text: string; sub: string; line: string; ghost: string};
const LIGHT: Theme = {bg: '#FFFFFF', text: COLORS.ink, sub: '#8A7868', line: COLORS.ink, ghost: 'rgba(38,23,13,0.035)'};
const DARK: Theme = {bg: '#0D0B09', text: '#F5F1EA', sub: '#9A938A', line: '#EDE7DD', ghost: 'rgba(255,255,255,0.045)'};
const ThemeCtx = React.createContext(LIGHT);
const useTheme = () => React.useContext(ThemeCtx);

const GOLD = '#C9821A';
const GOLD_L = '#F2B640';
const LEFT = 96;
const H = 400; // headline top; the overline sits 100 px above it

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const ramp = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

// --- type: everything enters on its own beat --------------------------------------------------

const Overline: React.FC<{top: number; at?: number; children: React.ReactNode}> = ({top, at = 2, children}) => {
  const p = ramp(useCurrentFrame(), at, at + 14);
  return <div style={{position: 'absolute', top, left: LEFT, fontFamily: FONT.medium, fontSize: 38, letterSpacing: '0.01em', color: GOLD, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>{children}</div>;
};

// Each line rises out of its own mask.
const Head: React.FC<{top: number; lines: string[]; size?: number; color?: string; at?: number}> = ({top, lines, size = 84, color, at = 6}) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top, left: LEFT, right: LEFT, fontFamily: FONT.medium, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.03em', color: color ?? t.text}}>
      {lines.map((l, i) => {
        const p = spring({frame: f - at - i * 5, fps, config: {damping: 200, stiffness: 150, mass: 0.8}});
        return (
          <div key={l} style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
            <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

const Sub: React.FC<{top: number; lines: string[]; size?: number; at?: number}> = ({top, lines, size = 46, at = 22}) => {
  const t = useTheme();
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top, left: LEFT, right: LEFT, fontFamily: FONT.regular, fontSize: size, lineHeight: 1.22, letterSpacing: '-0.01em', color: t.sub}}>
      {lines.map((l, i) => {
        const p = ramp(f, at + i * 4, at + i * 4 + 16);
        return (
          <div key={l} style={{opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

// Huge background numeral, cropped by the frame edge; it drifts in slowly.
const Ghost: React.FC<{children: React.ReactNode; right?: number; bottom?: number; size?: number}> = ({children, right = -60, bottom = 120, size = 1250}) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const p = ramp(f, 0, 40);
  return <div style={{position: 'absolute', right: right - (1 - p) * 140 - f * 0.4, bottom, fontFamily: FONT.medium, fontSize: size, lineHeight: 0.8, letterSpacing: '-0.06em', color: t.ghost, opacity: p}}>{children}</div>;
};

// Big gold figure for the key numbers.
const Figure: React.FC<{top: number; children: React.ReactNode; size?: number; at?: number; color?: string}> = ({top, children, size = 330, at = 16, color = GOLD}) => {
  const p = ramp(useCurrentFrame(), at, at + 18);
  return (
    <div style={{position: 'absolute', top, left: LEFT - 12, fontFamily: FONT.medium, fontSize: size, lineHeight: 0.9, letterSpacing: '-0.055em', color, whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      {children}
    </div>
  );
};

const Count: React.FC<{to: number; at: number; dur?: number}> = ({to, at, dur = 30}) => <>{Math.round(to * ramp(useCurrentFrame(), at, at + dur, Easing.bezier(0.25, 0.1, 0.25, 1)))}</>;

// --- drawing: strokes draw themselves on, fills follow -------------------------------------------

const DrawCtx = React.createContext(1);
const Draw: React.FC<{at: number; dur?: number; children: React.ReactNode}> = ({at, dur = 30, children}) => (
  <DrawCtx.Provider value={ramp(useCurrentFrame(), at, at + dur, Easing.bezier(0.45, 0, 0.2, 1))}>{children}</DrawCtx.Provider>
);
const STROKE = 4;
// Stroke props for one element, including the draw-on dash; spread it on every drawn element.
const useLine = (color?: string, width = STROKE) => {
  const t = useTheme();
  const p = React.useContext(DrawCtx);
  return {fill: 'none', stroke: color ?? t.line, strokeWidth: width, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
};
// Fills come in during the last part of the draw.
const useFill = () => interpolate(React.useContext(DrawCtx), [0.55, 1], [0, 1], clamp);

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
    </defs>
    {children}
  </svg>
);

const Glow: React.FC<{cx: number; cy: number; r: number; opacity?: number}> = ({cx, cy, r, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, 40);
  return <circle cx={cx} cy={cy} r={r * (0.9 + 0.1 * p) * (1 + 0.02 * Math.sin(f / 20))} fill="url(#glow)" opacity={p * opacity} />;
};

// --- icons ---------------------------------------------------------------------------------------

const SeedLine: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => {
  const a = useLine();
  const b = useLine(undefined, 3);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M 0 -62 C 30 -46 34 22 0 62 C -34 22 -30 -46 0 -62 Z" {...a} />
      <path d="M -9 -36 C -11 -8 -10 18 -5 40 M 9 -36 C 11 -8 10 18 5 40" {...b} strokeOpacity={0.5} />
    </g>
  );
};

// Roasting: seeds on a tray, heat rising under it.
const RoastIcon: React.FC = () => {
  const f = useCurrentFrame();
  const line = useLine();
  const heat = useLine(GOLD, STROKE + 1);
  return (
    <g>
      <Glow cx={540} cy={1250} r={330} />
      <SeedLine x={420} y={1130 + Math.sin(f / 5) * 2} rot={-28} />
      <SeedLine x={540} y={1110 + Math.sin(f / 5 + 1) * 2} rot={4} />
      <SeedLine x={660} y={1130 + Math.sin(f / 5 + 2) * 2} rot={30} />
      <line x1={310} y1={1210} x2={770} y2={1210} {...line} />
      {[400, 540, 680].map((x, i) => {
        const w = 26 * (1 + 0.25 * Math.sin(f / 4 + i * 2));
        return <path key={x} d={`M ${x} 1450 c ${-w} -32 ${w} -64 0 -96 c ${-w} -32 ${w} -64 0 -96`} {...heat} opacity={i === 1 ? 1 : 0.75} />;
      })}
    </g>
  );
};

// Neutralisation: a lab flask, bubbles rising through the liquid.
const FlaskIcon: React.FC = () => {
  const f = useCurrentFrame();
  const line = useLine();
  const fill = useFill();
  return (
    <g>
      <Glow cx={540} cy={1250} r={330} />
      <path d="M 426 1320 L 654 1320 L 690 1404 Q 696 1426 672 1426 L 408 1426 Q 384 1426 390 1404 Z" fill={GOLD} opacity={0.85 * fill} />
      <path d="M 490 1020 L 490 1150 L 380 1400 Q 370 1440 410 1440 L 670 1440 Q 710 1440 700 1400 L 590 1150 L 590 1020" {...line} />
      <line x1={470} y1={1020} x2={610} y2={1020} {...line} />
      {[0, 1, 2, 3].map((k) => {
        const life = ((f + k * 17) % 60) / 60;
        const x = 470 + k * 40 + Math.sin(f / 6 + k) * 6;
        return <circle key={k} cx={x} cy={1390 - life * 240} r={6 + k * 2} fill="none" stroke={DARK.line} strokeWidth={3} opacity={fill * Math.sin(Math.PI * life)} />;
      })}
    </g>
  );
};

const dropD = (h: number) => {
  const r = h / 2.7;
  return `M 0 ${-h} C ${r * 0.25} ${-h + r * 0.65} ${r} ${-r * 1.45} ${r} ${-r * 0.95} A ${r} ${r} 0 1 1 ${-r} ${-r * 0.95} C ${-r} ${-r * 1.45} ${-r * 0.25} ${-h + r * 0.65} 0 ${-h} Z`;
};

// Bleaching: the golden drop becomes an empty one.
const BleachIcon: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  const gold = ramp(f, 14, 30);
  const arrow = ramp(f, 30, 46);
  const clear = ramp(f, 40, 70, Easing.bezier(0.45, 0, 0.2, 1));
  const r = 300 / 2.7;
  return (
    <g>
      <Glow cx={360} cy={1250} r={260} />
      <g transform={`translate(330 ${1400 - (1 - gold) * 40})`} opacity={gold}>
        <path d={dropD(300)} fill="url(#gold)" />
      </g>
      <g opacity={arrow} stroke={t.line} strokeOpacity={0.6} strokeWidth={STROKE} strokeLinecap="round" fill="none">
        <line x1={460} y1={1290} x2={460 + 150 * arrow} y2={1290} strokeDasharray="2 16" />
        <path d="M 592 1272 L 612 1290 L 592 1308" />
      </g>
      <g transform="translate(750 1400)">
        <path d={dropD(300)} fill="none" stroke={t.line} strokeWidth={STROKE} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clear} />
        <path d={`M ${-r * 0.55} ${-r * 0.5} A ${r * 0.6} ${r * 0.6} 0 0 0 ${-r * 0.1} ${-r * 0.05}`} fill="none" stroke={t.line} strokeOpacity={0.45 * clear} strokeWidth={STROKE} strokeLinecap="round" />
      </g>
    </g>
  );
};

// Deodorisation: steam rising off the oil, thermometer climbing.
const SteamIcon: React.FC = () => {
  const f = useCurrentFrame();
  const line = useLine();
  const fill = useFill();
  return (
    <g>
      <Glow cx={540} cy={1260} r={330} />
      {[-120, 0, 120].map((dx, i) => {
        const life = ((f + i * 14) % 50) / 50;
        return (
          <path
            key={dx}
            d={`M ${540 + dx} 1390 c -40 -50 40 -100 0 -150 c -40 -50 40 -100 0 -150`}
            transform={`translate(0 ${-life * 50})`}
            fill="none"
            stroke="url(#fadeUp)"
            strokeWidth={STROKE + 2}
            strokeLinecap="round"
            opacity={fill * Math.sin(Math.PI * life)}
          />
        );
      })}
      <path d="M 300 1420 Q 420 1400 540 1420 T 780 1420" {...line} />
      <path d="M 300 1460 Q 420 1440 540 1460 T 780 1460" {...line} strokeOpacity={0.35} />
      <path d="M 850 1330 L 850 1110 A 18 18 0 0 1 886 1110 L 886 1330" {...line} />
      <circle cx={868} cy={1362} r={36} fill={GOLD} opacity={fill} />
      <rect x={860} y={1340 - 200 * fill} width={16} height={200 * fill} rx={8} fill={GOLD} />
    </g>
  );
};

// Product cutout on a soft contact shadow; rises in at `at`.
const Bottle: React.FC<{oil: string; x: number; bottom: number; height: number; at?: number}> = ({oil, x, bottom, height, at = 10}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 18, stiffness: 90}});
  const w = height * 0.2527;
  return (
    <>
      <div style={{position: 'absolute', left: x - w * 1.1, top: bottom - w * 0.18, width: w * 2.2, height: w * 0.36, background: 'radial-gradient(closest-side, rgba(38,23,13,0.28), rgba(38,23,13,0))', opacity: p}} />
      <Img src={staticFile(`cut/studio/${oil}.png`)} style={{position: 'absolute', left: x - w / 2, top: bottom - height + (1 - p) * 80, width: w, height, opacity: Math.min(1, p * 1.4)}} />
    </>
  );
};

// --- scenes ----------------------------------------------------------------------------------------

const S1 = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, 30);
  return (
    <>
      {/* the factory line of ordinary refined oil, dimmed, drifting slowly */}
      <Img src={staticFile('photo/refined_line.webp')} style={{position: 'absolute', left: 0, bottom: 0, width: 1080, height: 720, objectFit: 'cover', filter: 'saturate(0.75) brightness(0.8)', opacity: p, transform: `scale(${1.08 - 0.06 * ramp(f, 0, 150, Easing.linear)})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1200, height: 260, background: 'linear-gradient(#0D0B09, rgba(13,11,9,0))'}} />
      <Head top={300} size={80} at={10} lines={['Почему подсолнечное', 'масло из магазина', 'ничем не пахнет', 'и не имеет вкуса?']} />
      <Sfx name="tap" at={10} gain={0.6} />
    </>
  );
};

const S2 = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 14, 50);
  return (
    <>
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.medium, fontSize: 1100, lineHeight: 1, letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '3px #5E5850', opacity: p, transform: `scale(${1.12 - 0.12 * p})`}}>4</div>
      <Sub top={300} size={52} at={2} lines={['Потому что это']} />
      <Head top={370} size={140} at={8} lines={['Рафинация']} />
      <Sub top={540} size={46} at={26} lines={['4 этапа, которые масло проходит', 'на заводе, прежде чем попасть на полку']} />
      <Sfx name="tap" at={8} gain={0.6} />
    </>
  );
};

const Step: React.FC<{n: number; name: string; lines: string[]; icon: React.ReactNode; sound?: React.ReactNode}> = ({n, name, lines, icon, sound}) => (
  <>
    <Ghost>{n}</Ghost>
    <Overline top={300}>{name}</Overline>
    <Head top={H} lines={lines} />
    <Draw at={14} dur={34}>
      <Svg>{icon}</Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
    {sound}
  </>
);

const S3 = () => <Step n={1} name="Жарка" lines={['Семена жарят,', 'чтобы выжать', 'больше масла']} icon={<RoastIcon />} sound={<Sfx name="seeds" at={14} gain={0.5} />} />;
const S4 = () => <Step n={2} name="Нейтрализация" lines={['Масло обрабатывают', 'щёлочью']} icon={<FlaskIcon />} />;
const S5 = () => <Step n={3} name="Отбеливание" lines={['Масло отбеливают,', 'чтобы убрать цвет']} icon={<BleachIcon />} sound={<Sfx name="plop" at={16} gain={0.7} />} />;
const S5b = () => <Step n={4} name="Дезодорация" lines={['Пропаривают', 'при 200 °C и выше,', 'чтобы убрать', 'запах и вкус']} icon={<SteamIcon />} />;

// What reaches the shelf: four losses, each with a red cross drawing itself.
const LossRow: React.FC<{y: number; title: string; note: string; at: number; first?: boolean}> = ({y, title, note, at, first}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 16);
  const d = ramp(f, at + 4, at + 22, Easing.bezier(0.45, 0, 0.2, 1));
  const line = ramp(f, at - 6, at + 14);
  return (
    <>
      {first ? null : <div style={{position: 'absolute', top: y - 36, left: LEFT, width: (1080 - LEFT * 2) * line, height: 2, background: 'rgba(255,255,255,0.1)'}} />}
      <svg width={80} height={80} viewBox="-40 -40 80 80" style={{position: 'absolute', left: LEFT - 6, top: y - 2}}>
        <circle r={30} fill="none" stroke="#E2312A" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} transform="rotate(-90)" />
        <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke="#E2312A" strokeWidth={4} strokeLinecap="round" opacity={ramp(f, at + 14, at + 22)} />
      </svg>
      <div style={{position: 'absolute', top: y, left: LEFT + 110, right: LEFT, fontFamily: FONT.medium, fontSize: 58, lineHeight: 1.05, letterSpacing: '-0.025em', color: DARK.text, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>{title}</div>
      <div style={{position: 'absolute', top: y + 74, left: LEFT + 110, right: LEFT - 20, fontFamily: FONT.regular, fontSize: 40, lineHeight: 1.22, color: DARK.sub, opacity: ramp(f, at + 8, at + 24)}}>{note}</div>
      <Sfx name="tap" at={at + 4} gain={0.4} />
    </>
  );
};

const S5c = () => (
  <>
    <Overline top={300}>Что в итоге</Overline>
    <Head top={H} lines={['Какое масло продают', 'в магазинах']} />
    <LossRow first at={30} y={680} title="Ни запаха, ни вкуса" note="их убирают паром специально" />
    <LossRow at={66} y={910} title="Витамина E на треть меньше" note="теряется при рафинации" />
    <LossRow at={102} y={1140} title="Лецитин удалён" note="его убирают почти полностью" />
    <LossRow at={138} y={1370} title="Появляются трансжиры" note="при нагреве выше 200 °C" />
  </>
);

// First white screen: the turn to the real benefit, with our bottle.
const S6 = () => (
  <>
    <Overline top={300}>Масларада</Overline>
    <Head top={H} lines={['В чём настоящая', 'польза', 'сыродавленного масла']} />
    <Sub top={H + 290} at={26} lines={['подсолнечное, холодного отжима']} />
    <Svg>
      <Glow cx={540} cy={1260} r={360} opacity={0.6} />
    </Svg>
    <Bottle oil="sun" x={540} bottom={1570} height={720} at={18} />
    <Sfx name="thud" at={24} gain={0.6} />
  </>
);

const Press: React.FC = () => {
  const f = useCurrentFrame();
  const line = useLine(LIGHT.line);
  const squeeze = ramp(f, 40, 70, Easing.bezier(0.45, 0, 0.2, 1));
  const drop = ramp(f, 70, 100, Easing.in(Easing.quad));
  return (
    <g transform="translate(540 1400)">
      {[-150, -50, 50, 150].map((x) => (
        <g key={x} transform={`scale(1 ${1 - 0.25 * squeeze})`}>
          <SeedLine x={x} y={0} rot={-90} s={0.9} />
        </g>
      ))}
      <line x1={-260} y1={-62 + 16 * squeeze} x2={260} y2={-62 + 16 * squeeze} {...line} />
      <line x1={-260} y1={62} x2={260} y2={62} {...line} />
      <g transform={`translate(0 ${100 + 60 * drop}) scale(${0.4 + 0.6 * ramp(f, 60, 76)})`} opacity={ramp(f, 58, 68)}>
        <path d={dropD(110)} fill="url(#gold)" />
      </g>
    </g>
  );
};

const S7 = () => (
  <>
    <Overline top={300}>Как его делают</Overline>
    <Head top={H} lines={['Очищенные семена', 'давят прессом', 'при температуре']} />
    <Figure top={H + 280} size={250} at={22}>
      до <Count to={30} at={24} /> °C
    </Figure>
    <Sub top={H + 560} size={56} at={44} lines={['Без жарки, щёлочи,', 'отбеливания и пара']} />
    <Draw at={20} dur={30}>
      <Svg>
        <Press />
      </Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
    <Sfx name="clink" at={54} gain={0.7} />
    <Sfx name="plop" at={92} gain={0.6} />
  </>
);

// One benefit per screen: name, a big gold sign, a few short lines.
const Benefit: React.FC<{overline?: string; title: string; art: React.ReactNode; lines: string[]; linesTop?: number; sound?: React.ReactNode}> = ({overline = 'Что содержится в масле', title, art, lines, linesTop = 1180, sound}) => (
  <>
    <Overline top={300}>{overline}</Overline>
    <Head top={H} size={110} lines={[title]} />
    <Draw at={16} dur={36}>
      <Svg>{art}</Svg>
    </Draw>
    <Sub top={linesTop} size={54} at={40} lines={lines} />
    <Sfx name="tap" at={6} gain={0.5} />
    {sound}
  </>
);

const Fraction: React.FC = () => {
  const f = useCurrentFrame();
  const one = ramp(f, 16, 32);
  const slash = ramp(f, 26, 44, Easing.bezier(0.45, 0, 0.2, 1));
  const three = ramp(f, 38, 54);
  return (
    <g>
      <text x={LEFT + 10} y={870 - (1 - one) * 40} opacity={one} fontFamily={FONT.medium} fontSize={300} letterSpacing="-0.05em" fill={GOLD}>
        1
      </text>
      <line x1={LEFT + 210} y1={980} x2={LEFT + 210 + 190 * slash} y2={980 - 340 * slash} stroke={GOLD} strokeWidth={14} strokeLinecap="round" opacity={slash > 0 ? 1 : 0} />
      <text x={LEFT + 380} y={1080 + (1 - three) * 40} opacity={three} fontFamily={FONT.medium} fontSize={300} letterSpacing="-0.05em" fill={GOLD}>
        3
      </text>
    </g>
  );
};

// Vitamin E softgels: translucent golden capsules with an E, popping in and floating.
const CAPSULES = [
  {x: 820, y: 700, s: 1.1, r: -24, at: 30},
  {x: 940, y: 860, s: 0.8, r: 18, at: 38},
  {x: 790, y: 960, s: 0.95, r: 32, at: 46},
  {x: 930, y: 1080, s: 0.7, r: -12, at: 54},
  {x: 960, y: 620, s: 0.6, r: 8, at: 60},
];
const Capsules: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <g>
      <defs>
        <linearGradient id="softgel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD873" />
          <stop offset="0.55" stopColor="#F2B640" />
          <stop offset="1" stopColor="#C9821A" />
        </linearGradient>
      </defs>
      {CAPSULES.map((c, i) => {
        const p = spring({frame: f - c.at, fps, config: {damping: 11, stiffness: 120}});
        const bob = Math.sin(f / 18 + i * 1.3) * 10;
        return (
          <g key={i} transform={`translate(${c.x} ${c.y + bob}) rotate(${c.r + Math.sin(f / 26 + i) * 4}) scale(${c.s * p})`} opacity={Math.min(1, p * 1.5)}>
            <ellipse cx={4} cy={10} rx={92} ry={56} fill="#26170D" opacity={0.08} />
            <ellipse cx={0} cy={0} rx={92} ry={56} fill="url(#softgel)" />
            <ellipse cx={0} cy={0} rx={92} ry={56} fill="none" stroke="#B87516" strokeOpacity={0.35} strokeWidth={2} />
            <ellipse cx={-34} cy={-26} rx={36} ry={12} fill="#fff" opacity={0.55} transform="rotate(-8 -34 -26)" />
            <text x={0} y={22} textAnchor="middle" fontFamily={FONT.medium} fontSize={64} fill="#fff" opacity={0.95}>
              E
            </text>
          </g>
        );
      })}
    </g>
  );
};

const S8 = () => <Benefit title="Витамин E" art={<><Fraction /><Capsules /></>} sound={<Sfx name="clink" at={52} gain={0.7} />} lines={['дневной нормы в одной', 'столовой ложке. Помогает', 'защищать клетки']} />;

const LecithinArt: React.FC = () => {
  const f = useCurrentFrame();
  const g = useLine(GOLD, 8);
  return (
    <g transform={`translate(330 860) rotate(${Math.sin(f / 30) * 3})`}>
      <circle cx={-60} cy={-50} r={80} {...g} />
      <circle cx={110} cy={-10} r={60} {...g} />
      <circle cx={10} cy={120} r={70} {...g} />
      <line x1={-4} y1={-20} x2={58} y2={-14} {...g} />
      <line x1={-30} y1={26} x2={-12} y2={58} {...g} />
      <line x1={84} y1={44} x2={60} y2={72} {...g} />
    </g>
  );
};
const S8b = () => <Benefit title="Лецитин" art={<LecithinArt />} lines={['При рафинации его удаляют', 'почти полностью.', 'В холодном отжиме он остаётся']} />;

const S8c = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ph = spring({frame: f - 16, fps, config: {damping: 20, stiffness: 80}});
  return (
    <>
      <Overline top={300}>Что содержится в масле</Overline>
      <Head top={H} size={110} lines={['Запах и вкус', 'семян']} />
      {/* photo across the full width, sliding up into place */}
      <div style={{position: 'absolute', left: 0, top: 690, width: 1080, height: 719, overflow: 'hidden', opacity: Math.min(1, ph * 1.5), transform: `translateY(${(1 - ph) * 120}px)`}}>
        <Img src={staticFile('photo/seeds_oil.jpg')} style={{width: 1080, height: 719, transform: `scale(${1.06 - 0.06 * ramp(f, 16, 110, Easing.linear)})`}} />
      </div>
      <Sub top={1440} size={54} at={44} lines={['Рафинация убирает их паром.', 'Холодный отжим сохраняет']} />
      <Sfx name="tap" at={6} gain={0.5} />
    </>
  );
};

const S9 = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Overline top={300}>Холодный отжим</Overline>
      <Head top={H} size={110} lines={['Не содержит', 'трансжиров']} />
      <Figure top={700} size={200} at={18} color="#B9AFA4">
        <Count to={200} at={20} dur={26} /> °C
      </Figure>
      <Sub top={910} at={34} lines={['при рафинации паром', 'в масле образуются трансжиры']} />
      <div style={{position: 'absolute', top: 1080, left: LEFT, width: (1080 - LEFT * 2) * ramp(f, 54, 74), height: 2, background: 'rgba(38,23,13,0.1)'}} />
      <Figure top={1130} size={200} at={64}>
        <Count to={30} at={66} dur={20} /> °C
      </Figure>
      <Sub top={1340} at={80} lines={['при холодном отжиме', 'они не образуются']} />
      <Sfx name="tap" at={6} gain={0.5} />
      <Sfx name="clink" at={86} gain={0.7} />
    </>
  );
};

const S10 = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ph = spring({frame: f - 20, fps, config: {damping: 20, stiffness: 80}});
  return (
    <>
      <Overline top={300}>Отжим только после заказа</Overline>
      <Head top={H} lines={['От заказа до стола']} />
      <Figure top={H + 110} size={230} at={14}>
        <Count to={48} at={16} dur={26} /> часов
      </Figure>
      {/* full photo, uncropped, flush with the sides and the bottom; it slides up into place */}
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1080, height: 810, overflow: 'hidden', transform: `translateY(${(1 - ph) * 240}px)`, opacity: Math.min(1, ph * 1.5)}}>
        <Img src={staticFile('photo/nabor2.jpg')} style={{width: 1080, height: 810, transform: `scale(${1.06 - 0.06 * ramp(f, 20, 100, Easing.linear)})`}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, height: 140, background: 'linear-gradient(#FFFFFF, rgba(255,255,255,0))'}} />
      <Sfx name="tap" at={6} gain={0.5} />
      <Sfx name="clink" at={42} gain={0.7} />
    </>
  );
};

const RANGE = ['almond', 'camelina', 'sun', 'thistle', 'pumpkin'];
const S11 = () => (
  <>
    <Sub top={300} size={52} at={4} lines={['Заказывайте на']} />
    <Head top={370} size={120} at={10} lines={['maslarada.ru']} />
    <Svg>
      <Glow cx={540} cy={1060} r={520} />
    </Svg>
    {RANGE.map((oil, i) => (
      <Bottle key={oil} oil={oil} x={140 + i * 200} bottom={1370} height={640} at={22 + Math.abs(i - 2) * 6} />
    ))}
    <Sub top={1430} size={50} at={52} lines={['10 сыродавленных масел', 'из разных культур']} />
    <Sfx name="chord" at={12} gain={0.8} />
  </>
);

type Scene = {C: React.FC; theme: Theme; dur: number};
const SCENES: Scene[] = [
  {C: S1, theme: DARK, dur: 120},
  {C: S2, theme: DARK, dur: 105},
  {C: S3, theme: DARK, dur: 90},
  {C: S4, theme: DARK, dur: 78},
  {C: S5, theme: DARK, dur: 90},
  {C: S5b, theme: DARK, dur: 105},
  {C: S5c, theme: DARK, dur: 210},
  {C: S6, theme: LIGHT, dur: 105},
  {C: S7, theme: LIGHT, dur: 140},
  {C: S8, theme: LIGHT, dur: 125},
  {C: S8b, theme: LIGHT, dur: 125},
  {C: S8c, theme: LIGHT, dur: 110},
  {C: S9, theme: LIGHT, dur: 140},
  {C: S10, theme: LIGHT, dur: 105},
  {C: S11, theme: LIGHT, dur: 130},
];

// During a transition the background stays put (no dark bars): only the content lifts and fades.
type Motion = {bg: number; content: number; y: number};
const MotionCtx = React.createContext<Motion>({bg: 1, content: 1, y: 0});

const Frame: React.FC<{s: Scene}> = ({s}) => {
  const m = React.useContext(MotionCtx);
  return (
    <ThemeCtx.Provider value={s.theme}>
      <AbsoluteFill style={{background: s.theme.bg, opacity: m.bg}} />
      <AbsoluteFill style={{overflow: 'hidden', opacity: m.content, transform: `translateY(${m.y}px)`}}>
        <s.C />
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

// The outgoing screen keeps its background while its content lifts away; the incoming background
// fades in over it (invisible between two white screens) and its content rises into place.
const LiftView: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress}) => {
  const p = Easing.bezier(0.45, 0, 0.2, 1)(presentationProgress);
  const m: Motion = presentationDirection === 'entering' ? {bg: p, content: p, y: (1 - p) * 60} : {bg: 1, content: 1 - p, y: -p * 40};
  return (
    <AbsoluteFill>
      <MotionCtx.Provider value={m}>{children}</MotionCtx.Provider>
    </AbsoluteFill>
  );
};
const lift = (): TransitionPresentation<Record<string, never>> => ({component: LiftView, props: {}});
const FX = 16;

export const SUN_COLD_FRAMES = SCENES.reduce((sum, s) => sum + s.dur, 0) - FX * (SCENES.length - 1);

export const SunCold: React.FC = () => (
  <MixGain.Provider value={1.4}>
    <AbsoluteFill style={{background: DARK.bg}}>
      <TransitionSeries>
        {SCENES.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.dur}>
              <Frame s={s} />
            </TransitionSeries.Sequence>
            {i < SCENES.length - 1 ? <TransitionSeries.Transition presentation={lift()} timing={linearTiming({durationInFrames: FX})} /> : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  </MixGain.Provider>
);

// Style frames: frame n shows scene n, frozen after everything has settled.
// Frozen frames must lie inside the composition, so it is longer than any scene; render frames 0..14.
export const SUN_FRAMES_COUNT = 300;
export const SunFrames: React.FC = () => {
  const s = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return (
    <Freeze frame={s.dur - 1}>
      <Frame s={s} />
    </Freeze>
  );
};
