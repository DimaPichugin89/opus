// Reel "Pressed to order": the producer's voice, benefits one per screen, then the order.
// Script: the client's konspekt (first person, Vladivostok delivery). Design and motion are the
// sunflower reel's: white screens, gold accents, monoline icons that draw themselves, calm lifts.
import React from 'react';
import {Easing, Freeze, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {MixGain, Sfx} from '../../sfx';
import {COLORS, FONT, OIL} from '../../theme';
import {Bottle, Draw, dropD, Frame, GOLD, Glow, H, Head, LEFT, LIGHT, Overline, ramp, reelFrames, ReelSeries, Scene, SeedLine, Sub, Svg, useFill, useLine} from '../sun/SunFrames';

const DRAW = Easing.bezier(0.45, 0, 0.2, 1);

// Our bottle as a monoline drawing; `fill` 0..1 raises the oil inside it.
const BOTTLE_D = 'M -22 -260 L -22 -200 C -22 -160 -95 -150 -95 -90 L -95 210 Q -95 240 -65 240 L 65 240 Q 95 240 95 210 L 95 -90 C 95 -150 22 -160 22 -200 L 22 -260 Z';
const LineBottle: React.FC<{x: number; y: number; s: number; fill: number; id: string}> = ({x, y, s, fill, id}) => {
  const line = useLine(COLORS.ink, 4 / s);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <clipPath id={id}>
        <path d={BOTTLE_D} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-100} y={240 - 500 * fill} width={200} height={520} fill="url(#gold)" />
        <path d={`M -100 ${240 - 500 * fill} q 50 -8 100 0 t 100 0`} fill="#FFD873" opacity={fill > 0.02 && fill < 0.98 ? 0.8 : 0} />
      </g>
      <path d={BOTTLE_D} {...line} />
      <rect x={-27} y={-300} width={54} height={40} rx={8} {...line} />
    </g>
  );
};

// --- 1. Hook: a drop falls and the bottle gathers around it ------------------------------------------

const HookArt: React.FC = () => {
  const f = useCurrentFrame();
  const fall = ramp(f, 0, 22, Easing.in(Easing.quad));
  const landed = f >= 22;
  const ring = ramp(f, 22, 42);
  const fill = ramp(f, 34, 78, Easing.bezier(0.33, 0, 0.2, 1));
  return (
    <g>
      <Glow cx={540} cy={1160} r={420} opacity={0.8} />
      <Draw at={22} dur={30}>
        <LineBottle x={540} y={1200} s={1.25} fill={fill} id="hookBottle" />
      </Draw>
      {!landed ? (
        <g transform={`translate(540 ${700 + fall * 560}) scale(1 ${1 + fall * 0.25})`}>
          <path d={dropD(90)} fill="url(#gold)" />
        </g>
      ) : null}
      <ellipse cx={540} cy={1290} rx={60 + 140 * ring} ry={(60 + 140 * ring) * 0.25} fill="none" stroke={GOLD} strokeWidth={4} opacity={landed ? 1 - ring : 0} />
    </g>
  );
};

const S1 = () => (
  <>
    <Svg>
      <HookArt />
    </Svg>
    <Overline top={300} at={26}>Масларада</Overline>
    <Head top={H} at={30} lines={['Отжимаю это масло', 'сам, под каждый', 'заказ']} />
    <Sfx name="plop" at={22} gain={0.8} />
    <Sfx name="tap" at={30} gain={0.5} />
  </>
);

// --- 2. Cold pressing: a cold thermometer, the flame struck out -----------------------------------------

const ColdArt: React.FC = () => {
  const f = useCurrentFrame();
  const line = useLine();
  const fill = useFill();
  const slash = ramp(f, 46, 62, DRAW);
  return (
    <g>
      <Glow cx={540} cy={1080} r={380} />
      {/* thermometer, barely warm */}
      <path d="M 340 1220 L 340 860 A 22 22 0 0 1 384 860 L 384 1220" {...line} />
      <circle cx={362} cy={1262} r={46} {...line} />
      <circle cx={362} cy={1262} r={30} fill={GOLD} opacity={fill} />
      <rect x={354} y={1240 - 90 * fill} width={16} height={90 * fill} rx={8} fill={GOLD} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={400} y1={900 + k * 80} x2={424} y2={900 + k * 80} {...line} strokeOpacity={0.5} />
      ))}
      {/* the flame, struck out */}
      <path d="M 700 900 C 750 950 790 1000 776 1070 C 766 1120 730 1150 700 1150 C 670 1150 634 1120 624 1070 C 612 1010 646 980 662 950 C 668 984 684 994 692 990 C 680 956 684 926 700 900 Z" {...line} />
      <line x1={600} y1={1170} x2={600 + 200 * slash} y2={1170 - 300 * slash} stroke="#E2312A" strokeWidth={8} strokeLinecap="round" opacity={slash > 0 ? 1 : 0} />
    </g>
  );
};

const S2 = () => (
  <>
    <Overline top={300}>Холодный отжим</Overline>
    <Head top={H} lines={['Отжим на холодную,', 'без нагрева']} />
    <Draw at={14} dur={32}>
      <Svg>
        <ColdArt />
      </Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
  </>
);

// --- 3. What stays: the kernel turns into a drop, tags float up around it ----------------------------------

const Tag: React.FC<{x: number; y: number; label: string; at: number}> = ({x, y, label, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 12, stiffness: 140}});
  const w = label.length * 25 + 64;
  const bob = Math.sin(f / 16 + x) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${p})`} opacity={Math.min(1, p * 1.5)}>
      <rect x={-w / 2} y={-38} width={w} height={76} rx={38} fill="#FFFFFF" stroke={GOLD} strokeWidth={4} />
      <text x={0} y={15} textAnchor="middle" fontFamily={FONT.medium} fontSize={42} fill={COLORS.ink}>
        {label}
      </text>
    </g>
  );
};

const KeepArt: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seed = 1 - ramp(f, 34, 48);
  const drop = spring({frame: f - 38, fps, config: {damping: 13, stiffness: 110}});
  return (
    <g>
      <Glow cx={540} cy={1130} r={400} />
      <g opacity={seed} transform={`translate(540 1110) scale(${2.4 * (0.8 + 0.2 * seed)}) translate(-540 -1110)`}>
        <SeedLine x={540} y={1110} rot={0} />
      </g>
      <g transform={`translate(540 1300) scale(${drop})`}>
        <path d={dropD(360)} fill="url(#gold)" />
        <ellipse cx={-48} cy={-150} rx={20} ry={44} fill="#fff" opacity={0.45} transform="rotate(18 -48 -150)" />
      </g>
      <Tag x={290} y={900} label="витамины" at={56} />
      <Tag x={810} y={1010} label="омега" at={66} />
      <Tag x={540} y={1440} label="антиоксиданты" at={76} />
    </g>
  );
};

const S3 = () => (
  <>
    <Overline top={300}>Что остаётся в масле</Overline>
    <Head top={H} lines={['Витамины, омега', 'и антиоксиданты', 'остаются в масле']} />
    <Draw at={14} dur={24}>
      <Svg>
        <KeepArt />
      </Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
    <Sfx name="plop" at={40} gain={0.6} />
    {[56, 66, 76].map((t) => (
      <Sfx key={t} name="tick" at={t} gain={0.8} />
    ))}
  </>
);

// --- 4. Fresh: pressed on the day of the order -----------------------------------------------------------

const Calendar: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const line = useLine();
  const fill = useFill();
  const pulse = 1 + 0.08 * Math.sin(Math.max(0, f - 40) / 5) * ramp(f, 40, 50);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-130} y={-120} width={260} height={250} rx={24} {...line} />
      <line x1={-130} y1={-50} x2={130} y2={-50} {...line} />
      <line x1={-70} y1={-150} x2={-70} y2={-90} {...line} />
      <line x1={70} y1={-150} x2={70} y2={-90} {...line} />
      {Array.from({length: 9}, (_, i) => {
        const cx = -80 + (i % 3) * 80;
        const cy = -5 + Math.floor(i / 3) * 50;
        return i === 4 ? (
          <rect key={i} x={cx - 26 * pulse} y={cy - 18 * pulse} width={52 * pulse} height={36 * pulse} rx={8} fill={GOLD} opacity={fill} />
        ) : (
          <rect key={i} x={cx - 22} y={cy - 14} width={44} height={28} rx={6} fill={COLORS.ink} opacity={0.12 * fill} />
        );
      })}
    </g>
  );
};

const FreshArt: React.FC = () => {
  const f = useCurrentFrame();
  const arrow = ramp(f, 40, 56);
  const fill = ramp(f, 52, 96, Easing.bezier(0.33, 0, 0.2, 1));
  return (
    <g>
      <Glow cx={540} cy={940} r={420} />
      <Calendar x={290} y={920} />
      <g opacity={arrow} stroke={COLORS.ink} strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" fill="none">
        <line x1={450} y1={940} x2={450 + 150 * arrow} y2={940} strokeDasharray="2 16" />
        <path d="M 588 922 L 606 940 L 588 958" />
      </g>
      <LineBottle x={790} y={950} s={0.72} fill={fill} id="freshBottle" />
    </g>
  );
};

const FreshBar: React.FC = () => {
  const f = useCurrentFrame();
  const p = ramp(f, 70, 110, Easing.bezier(0.33, 0, 0.2, 1));
  const show = ramp(f, 62, 74);
  const w = 1080 - LEFT * 2;
  return (
    <div style={{position: 'absolute', top: 1360, left: LEFT, width: w, opacity: show}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.medium, fontSize: 38, color: LIGHT.sub}}>
        <span>свежесть</span>
        <span style={{color: GOLD, opacity: ramp(f, 104, 116)}}>на максимуме</span>
      </div>
      <div style={{marginTop: 18, height: 14, borderRadius: 7, background: 'rgba(38,23,13,0.08)'}}>
        <div style={{width: `${p * 100}%`, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${OIL.peanut}, ${GOLD})`}} />
      </div>
    </div>
  );
};

const S4 = () => (
  <>
    <Overline top={300}>Свежесть</Overline>
    <Head top={H} lines={['Отжимаю', 'в день заказа']} />
    <Draw at={14} dur={30}>
      <Svg>
        <FreshArt />
      </Svg>
    </Draw>
    <Sub top={1190} size={52} at={46} lines={['Бутылка с максимальной', 'питательной ценностью']} />
    <FreshBar />
    <Sfx name="tap" at={6} gain={0.5} />
    <Sfx name="pour" at={52} gain={0.4} />
  </>
);

// --- 5. Composition: seeds = oil ----------------------------------------------------------------------------

const RawArt: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eq = ramp(f, 36, 50);
  const drop = spring({frame: f - 46, fps, config: {damping: 13, stiffness: 120}});
  return (
    <g>
      <Glow cx={540} cy={1000} r={420} />
      <g transform="translate(300 1000) scale(2) translate(-300 -1000)">
        <SeedLine x={300} y={1000} rot={-14} />
      </g>
      <g opacity={eq} stroke={GOLD} strokeWidth={10} strokeLinecap="round">
        <line x1={490} y1={975} x2={590} y2={975} />
        <line x1={490} y1={1025} x2={590} y2={1025} />
      </g>
      <g transform={`translate(780 1130) scale(${drop})`}>
        <path d={dropD(280)} fill="url(#gold)" />
      </g>
    </g>
  );
};

const S5 = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Overline top={300}>Состав</Overline>
      <Head top={H} lines={['В составе', 'только сырьё']} />
      <Draw at={14} dur={26}>
        <Svg>
          <RawArt />
        </Svg>
      </Draw>
      <div style={{position: 'absolute', top: 1190, left: 0, width: 1080, fontFamily: FONT.medium, fontSize: 44, color: LIGHT.sub}}>
        <span style={{position: 'absolute', left: 300 - 150, width: 300, textAlign: 'center', opacity: ramp(f, 30, 44)}}>семена</span>
        <span style={{position: 'absolute', left: 780 - 150, width: 300, textAlign: 'center', opacity: ramp(f, 54, 68)}}>масло</span>
      </div>
      <Sub top={1320} size={52} at={64} lines={['Ничего не добавляю']} />
      <Sfx name="tap" at={6} gain={0.5} />
      <Sfx name="plop" at={48} gain={0.6} />
    </>
  );
};

// --- 6. Taste: a drop with its aroma rising -------------------------------------------------------------------

const TasteArt: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = spring({frame: f - 14, fps, config: {damping: 14, stiffness: 110}});
  const curl = useLine(GOLD, 8);
  return (
    <g>
      <Glow cx={540} cy={1150} r={420} />
      <g transform={`translate(540 1430) scale(${drop})`}>
        <path d={dropD(400)} fill="url(#gold)" />
        <ellipse cx={-54} cy={-170} rx={22} ry={50} fill="#fff" opacity={0.45} transform="rotate(18 -54 -170)" />
      </g>
      {[-90, 0, 90].map((dx, k) => (
        <path key={k} d={`M ${540 + dx} 960 c -44 -40 44 -80 0 -120 c -44 -40 40 -72 8 -110 c -18 -22 4 -40 24 -28`} transform={`translate(${Math.sin(f / 14 + k) * 7} ${-Math.sin(f / 22 + k) * 7})`} {...curl} opacity={0.6 + k * 0.2} />
      ))}
    </g>
  );
};

const S6 = () => (
  <>
    <Overline top={300}>Вкус и аромат</Overline>
    <Head top={H} lines={['Живой вкус', 'и аромат культуры']} />
    <Draw at={30} dur={36}>
      <Svg>
        <TasteArt />
      </Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
  </>
);

// --- 7. Free from: four badges ------------------------------------------------------------------------------

const BadgeIcon: React.FC<{kind: 'gluten' | 'lactose' | 'vegan' | 'raw'}> = ({kind}) => {
  const g = useLine(GOLD, 6);
  if (kind === 'gluten')
    return (
      <g>
        <path d="M 0 60 L 0 -60" {...g} />
        {[-36, -6, 24].map((y) => (
          <g key={y}>
            <ellipse cx={-16} cy={y} rx={12} ry={20} transform={`rotate(-30 -16 ${y})`} {...g} />
            <ellipse cx={16} cy={y} rx={12} ry={20} transform={`rotate(30 16 ${y})`} {...g} />
          </g>
        ))}
        <line x1={-64} y1={64} x2={64} y2={-64} {...g} />
      </g>
    );
  if (kind === 'lactose')
    return (
      <g>
        <path d="M -16 -66 L 16 -66 L 16 -40 L 36 -10 L 36 62 L -36 62 L -36 -10 L -16 -40 Z" {...g} />
        <line x1={-36} y1={10} x2={36} y2={10} {...g} />
        <line x1={-64} y1={64} x2={64} y2={-64} {...g} />
      </g>
    );
  if (kind === 'vegan')
    return (
      <g>
        <path d="M -50 50 C -60 -20 0 -70 60 -60 C 70 0 20 60 -50 50 Z" {...g} />
        <path d="M -50 50 L 30 -30" {...g} />
      </g>
    );
  return (
    <g>
      <path d="M 0 66 L 0 -6" {...g} />
      <path d="M 0 -6 C -10 -50 -50 -60 -66 -44 C -60 -14 -30 0 0 -6 Z" {...g} />
      <path d="M 0 -20 C 10 -64 50 -74 66 -58 C 60 -28 30 -14 0 -20 Z" {...g} />
    </g>
  );
};

const BADGES: {kind: 'gluten' | 'lactose' | 'vegan' | 'raw'; label: string; x: number; y: number}[] = [
  {kind: 'gluten', label: 'без глютена', x: 330, y: 930},
  {kind: 'lactose', label: 'без лактозы', x: 750, y: 930},
  {kind: 'vegan', label: 'веганам', x: 330, y: 1320},
  {kind: 'raw', label: 'сыроедам', x: 750, y: 1320},
];

const Badge: React.FC<{b: (typeof BADGES)[number]; at: number}> = ({b, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 13, stiffness: 130}});
  return (
    <Draw at={at + 4} dur={26}>
      <g transform={`translate(${b.x} ${b.y}) scale(${0.6 + 0.4 * p})`} opacity={Math.min(1, p * 1.4)}>
        <circle r={120} fill="#FFF8EA" />
        <BadgeIcon kind={b.kind} />
        <text y={185} textAnchor="middle" fontFamily={FONT.medium} fontSize={42} fill={COLORS.ink}>
          {b.label}
        </text>
      </g>
    </Draw>
  );
};

const S7 = () => (
  <>
    <Overline top={300}>Подойдёт всем</Overline>
    <Head top={H} lines={['Без глютена', 'и лактозы']} />
    <Sub top={H + 200} size={52} at={20} lines={['Подойдёт веганам и сыроедам']} />
    <Svg>
      {BADGES.map((b, i) => (
        <Badge key={b.kind} b={b} at={30 + i * 12} />
      ))}
    </Svg>
    <Sfx name="tap" at={6} gain={0.5} />
    {BADGES.map((_, i) => (
      <Sfx key={i} name="tick" at={30 + i * 12} gain={0.8} />
    ))}
  </>
);

// --- 8. Trust: Russian suppliers, each crop checked ---------------------------------------------------------

type Crop = {name: string; color: string; icon: (line: ReturnType<typeof useLine>) => React.ReactNode};
const CROPS: Crop[] = [
  {name: 'лён', color: OIL.linen, icon: (l) => [0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={0} cy={-18} rx={12} ry={20} transform={`rotate(${k * 72})`} {...l} />)},
  {name: 'конопля', color: OIL.hemp, icon: (l) => [-60, -30, 0, 30, 60].map((a) => <path key={a} d="M 0 26 C -8 0 -6 -26 0 -40 C 6 -26 8 0 0 26 Z" transform={`rotate(${a} 0 26)`} {...l} />)},
  {name: 'кунжут', color: '#B79A5E', icon: (l) => [-22, 0, 22].map((x, i) => <path key={x} d="M 0 -18 C 10 -12 10 10 0 18 C -10 10 -10 -12 0 -18 Z" transform={`translate(${x} ${i === 1 ? -10 : 8})`} {...l} />)},
  {name: 'тыква', color: OIL.pumpkin, icon: (l) => [<ellipse key="a" cx={0} cy={8} rx={34} ry={26} {...l} />, <path key="b" d="M 0 -18 L 0 34 M -16 -14 C -24 10 -24 20 -14 32 M 16 -14 C 24 10 24 20 14 32" {...l} />, <path key="c" d="M 0 -18 C 4 -30 12 -34 18 -34" {...l} />]},
  {name: 'подсолнечник', color: OIL.sun, icon: (l) => [<path key="a" d="M 0 -36 C 18 -26 20 14 0 36 C -20 14 -18 -26 0 -36 Z" {...l} />, <path key="b" d="M -6 -20 C -7 -4 -7 10 -3 22 M 6 -20 C 7 -4 7 10 3 22" {...l} />]},
  {name: 'горчица', color: '#9DA62E', icon: (l) => [[-18, 10], [16, 14], [0, -16]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r={13} {...l} />)},
];

const CropBadge: React.FC<{c: Crop; x: number; y: number; at: number}> = ({c, x, y, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 13, stiffness: 130}});
  const check = ramp(f, at + 14, at + 26, DRAW);
  const line = {fill: 'none', stroke: c.color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      <circle r={74} fill="#FFFFFF" stroke={c.color} strokeOpacity={0.35} strokeWidth={3} />
      {c.icon(line as ReturnType<typeof useLine>)}
      <g transform="translate(52 -52)" opacity={check > 0 ? 1 : 0}>
        <circle r={22} fill={GOLD} />
        <path d="M -9 1 L -2 8 L 10 -6" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
      </g>
      <text y={112} textAnchor="middle" fontFamily={FONT.regular} fontSize={32} fill={LIGHT.sub}>
        {c.name}
      </text>
    </g>
  );
};

const ShieldArt: React.FC = () => {
  const g = useLine(GOLD, 8);
  return (
    <g transform="translate(540 1110)">
      <path d="M 0 -110 L 90 -76 L 90 0 C 90 60 50 96 0 116 C -50 96 -90 60 -90 0 L -90 -76 Z" {...g} />
      <path d="M -36 4 L -8 32 L 42 -24" {...g} />
    </g>
  );
};

const S8 = () => (
  <>
    <Overline top={300}>Сырьё</Overline>
    <Head top={H} size={76} lines={['Проверенные', 'российские поставщики']} />
    <Sub top={H + 190} size={52} at={20} lines={['Отбор под каждую партию']} />
    <Draw at={20} dur={30}>
      <Svg>
        <Glow cx={540} cy={1110} r={360} />
        <ShieldArt />
        {CROPS.map((c, i) => {
          const a = (i / CROPS.length) * Math.PI * 2 - Math.PI / 2;
          return <CropBadge key={c.name} c={c} x={540 + Math.cos(a) * 300} y={1110 + Math.sin(a) * 290} at={40 + i * 10} />;
        })}
      </Svg>
    </Draw>
    <Sfx name="tap" at={6} gain={0.5} />
    {CROPS.map((_, i) => (
      <Sfx key={i} name="tick" at={54 + i * 10} gain={0.7} />
    ))}
  </>
);

// --- 9. Call to order ----------------------------------------------------------------------------------------

const LINEUP = ['linen', 'hemp', 'sesame', 'pumpkin', 'sun', 'mustard', 'camelina', 'almond', 'peanut', 'thistle'];

const Pin: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - 70, fps, config: {damping: 10, stiffness: 140}});
  return (
    <div style={{position: 'absolute', top: 1340, left: 0, width: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: Math.min(1, p * 1.4)}}>
      <svg width={52} height={70} viewBox="-26 -36 52 70" style={{transform: `translateY(${(1 - p) * -40}px)`}}>
        <path d="M 0 32 C -16 10 -24 -2 -24 -12 A 24 24 0 0 1 24 -12 C 24 -2 16 10 0 32 Z" fill={GOLD} />
        <circle cx={0} cy={-12} r={9} fill="#fff" />
      </svg>
      <span style={{fontFamily: FONT.medium, fontSize: 50, color: COLORS.ink, transform: `translateX(${(1 - p) * 20}px)`}}>Доставка по Владивостоку</span>
    </div>
  );
};

const S9 = () => {
  const f = useCurrentFrame();
  const logo = ramp(f, 24, 40);
  return (
    <>
      <Sub top={300} size={52} at={4} lines={['Заказывай на']} />
      <Head top={370} size={120} at={10} lines={['maslarada.ru']} />
      <Img src={staticFile('logo/logo_black.png')} style={{position: 'absolute', left: (1080 - 400) / 2, top: 590, width: 400, height: 400 / 2.527, opacity: logo, transform: `translateY(${(1 - logo) * 16}px)`}} />
      <Svg>
        <Glow cx={540} cy={1060} r={520} />
      </Svg>
      {LINEUP.map((oil, i) => (
        <Bottle key={oil} oil={oil} x={108 + i * 96} bottom={1250} height={380} at={34 + Math.abs(i - 4.5) * 4} />
      ))}
      <Pin />
      <Sfx name="tap" at={10} gain={0.5} />
      <Sfx name="thud" at={40} gain={0.5} />
    </>
  );
};

const SCENES: Scene[] = [
  {C: S1, theme: LIGHT, dur: 120},
  {C: S2, theme: LIGHT, dur: 105},
  {C: S3, theme: LIGHT, dur: 130},
  {C: S4, theme: LIGHT, dur: 135},
  {C: S5, theme: LIGHT, dur: 110},
  {C: S6, theme: LIGHT, dur: 105},
  {C: S7, theme: LIGHT, dur: 130},
  {C: S8, theme: LIGHT, dur: 140},
  {C: S9, theme: LIGHT, dur: 150},
];

export const BY_ORDER_FRAMES = reelFrames(SCENES);
export const ByOrder: React.FC = () => (
  <MixGain.Provider value={1.4}>
    <ReelSeries scenes={SCENES} />
  </MixGain.Provider>
);

// Style frames: frame n shows scene n, settled (the composition is longer than any scene).
export const BY_ORDER_STILLS = 300;
export const ByOrderFrames: React.FC = () => {
  const s = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return (
    <Freeze frame={s.dur - 1}>
      <Frame s={s} />
    </Freeze>
  );
};

