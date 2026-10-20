// The full reel: one continuous film built from scenes joined by varied transitions.
// Copy follows docs/scenario_reel.md (facts from docs/factbase.md).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {KineticText, TextLine} from '../../components/KineticText';
import {LogoPlate} from '../../components/LogoPlate';
import {SeedDrift, SeedRain} from '../../components/Seeds';
import {Stage} from '../../components/Stage';
import {BottleHero, StudioBottle} from '../../components/StudioBottle';
import {bottleMask, card, flood, liquid, press, splash, whip, zoomThrough, Fx} from '../../fx/presentations';
import {OmegaPlate, VitaminE} from '../../illus/benefit';
import {Grow, TimeScale} from '../../illus/kit';
import {OmegaJars} from '../../illus/olive';
import {OrderToPress, ShipIn2Days} from '../../illus/order';
import {PressCutaway} from '../../illus/press';
import {BleachFlasks, CompareBottles, HeatTray, ShelfBottleArt, SolventPour, SteamTank} from '../../illus/shelf';
import {NoFrying, ReadyDishes, SpoonFill} from '../../illus/usage';
import {Sfx} from '../../sfx';
import {COLORS, OIL, Oil} from '../../theme';

const lead = (text: string, at: number, sound = false, color?: string): TextLine => ({text, at, role: 'lead', sound, color});
const sub = (text: string, at: number, color: string = COLORS.inkSoft): TextLine => ({text, at, role: 'sub', color, sound: false});
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Quick internal beats inside a scene: each slide pushes in from the side and out the other way.
const Beat: React.FC<{from: number; dur: number; children: React.ReactNode; last?: boolean}> = ({from, dur, children, last}) => (
  <Sequence from={from} durationInFrames={dur}>
    <BeatMotion dur={dur} last={last}>
      {children}
    </BeatMotion>
  </Sequence>
);
const BeatMotion: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 9], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const outP = last ? 0 : interpolate(f, [dur - 8, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return <AbsoluteFill style={{transform: `translateX(${inP * 260 - outP * 260}px)`, opacity: 1 - Math.max(inP, outP)}}>{children}</AbsoluteFill>;
};

const Bg: React.FC<{color: string; glow?: string}> = ({color, glow}) => (
  <AbsoluteFill style={{background: glow ? `radial-gradient(ellipse at 50% 55%, ${glow} 0%, ${color} 70%)` : color}} />
);

// 1. Hook
const Hook: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <SeedDrift count={22} seed="r1b" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={6} opacity={0.6} />
    <SeedRain count={60} seed="r1f" kinds={['sunflower', 'sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1330, 1760]} spread={30} />
    <Sfx name="seeds" at={2} gain={0.8} />
    <KineticText top={740} lines={[lead('Почему масло с полки', 6, true), lead('ничем не пахнет?', 12)]} />
  </AbsoluteFill>
);

// 2. What it is: seeds and pressure only, under 30 °C
const WhatItIs: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <KineticText top={290} lines={[lead('Сыродавленное:', 12, true), lead('только семена и давление', 17), sub('не выше 30 °C', 44)]} />
    <TimeScale k={1.8}>
      <PressCutaway cx={540} cy={1110} at={0} scale={1.1} />
    </TimeScale>
  </AbsoluteFill>
);

// 3. Close-up of the real bottle
const HeroShot: React.FC<{oil: Oil; dur: number; lines: TextLine[]; focus: [number, number]; scale: [number, number]; tilt?: [number, number]; x?: [number, number]; textTop?: number}> = ({oil, dur, lines, focus, scale, tilt, x, textTop = 290}) => (
  <AbsoluteFill>
    <Bg color={darken(OIL[oil])} glow={OIL[oil]} />
    <BottleHero oil={oil} dur={dur} focus={focus} scale={scale} tilt={tilt} x={x} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,12,6,0.7) 0%, rgba(20,12,6,0) 38%)'}} />
    <KineticText top={textTop} lines={lines} />
  </AbsoluteFill>
);
const darken = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * 0.35).toString(16).padStart(2, '0');
  return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
};

// 4. How refined oil is made, in quick beats
const STEP = 46;
const Refined: React.FC = () => {
  const steps: [string[], React.ReactNode][] = [
    [['Семена прогревают'], <HeatTray key="h" cx={540} cy={1100} at={0} />],
    [['Остатки вымывают', 'специальной жидкостью'], <SolventPour key="s" cx={540} cy={1140} at={0} />],
    [['Осветляют глиной'], <BleachFlasks key="b" cx={540} cy={1080} at={0} />],
    [['Запах убирают паром,', '200+ °C'], <SteamTank key="t" cx={540} cy={1150} at={0} />],
  ];
  return (
    <AbsoluteFill>
      <Bg color={COLORS.cream} />
      <Beat from={0} dur={52}>
        <KineticText top={290} lines={[lead('А рафинированное', 8, true), lead('делают иначе', 13)]} />
        <Grow cy={1110}>
          <ShelfBottleArt cx={540} cy={1110} at={0} />
        </Grow>
      </Beat>
      {steps.map(([text, art], i) => (
        <Beat key={i} from={52 + i * STEP} dur={STEP}>
          <KineticText top={290} lines={[{text: `${i + 1} / 4`, at: 2, role: 'sub', color: COLORS.amber}, ...text.map((t, k) => lead(t, 4 + k * 4, k === 0))]} />
          <Grow cy={1120} s={1.15}>
            <TimeScale k={2.2}>{art}</TimeScale>
          </Grow>
        </Beat>
      ))}
      <Beat from={52 + 4 * STEP} dur={300 - 52 - 4 * STEP} last>
        <KineticText top={290} lines={[lead('Без вкуса и запаха', 6, true), sub('часть витамина E теряется', 22)]} />
        <Grow cy={1130}>
          <TimeScale k={1.5}>
            <CompareBottles cx={540} cy={1130} at={0} />
          </TimeScale>
        </Grow>
      </Beat>
    </AbsoluteFill>
  );
};

// 5. Olive oil, honestly
const Olive: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <KineticText top={290} out={52} lines={[lead('Extra Virgin тоже', 10, true), lead('получают механически', 15)]} />
    <KineticText top={290} lines={[lead('Омега-3: меньше 1 %', 60, true), sub('в льняном больше половины', 78)]} />
    <Grow cy={1150} s={1.1}>
      <TimeScale k={1.4}>
        <OmegaJars cx={540} cy={1150} at={14} />
      </TimeScale>
    </Grow>
  </AbsoluteFill>
);

// 6. Benefits
const Benefits: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <Beat from={0} dur={66}>
      <KineticText top={290} lines={[lead('Витамин E помогает', 12, true), lead('защищать клетки', 17)]} />
      <TimeScale k={1.5}>
        <VitaminE cx={540} cy={1120} at={4} />
      </TimeScale>
    </Beat>
    <Beat from={66} dur={64}>
      <KineticText top={290} lines={[lead('Ложка подсолнечного:', 6, true), lead('больше трети нормы', 11)]} />
      <Grow cy={1080}>
        <TimeScale k={1.6}>
          <SpoonFill cx={540} cy={1080} at={0} />
        </TimeScale>
      </Grow>
      <BigFraction at={30} />
    </Beat>
    <Beat from={130} dur={65} last>
      <KineticText top={290} lines={[lead('Омега-3 и омега-6', 6, true), sub('организм сам не делает,', 18), sub('они приходят только с едой', 22)]} />
      <Grow cy={1160} s={1.05}>
        <TimeScale k={1.6}>
          <OmegaPlate cx={540} cy={1160} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
  </AbsoluteFill>
);
const BigFraction: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 160}});
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center', fontFamily: 'MasMedium', fontSize: 170, color: COLORS.amber, transform: `scale(${s})`}}>&gt; 1/3</div>
      <Sfx name="clink" at={at} />
    </>
  );
};

// 7. Where to use it
const Uses: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <Sequence from={0} durationInFrames={245} layout="none">
      <Grow cy={1150} s={1.22}>
        <TimeScale k={1.2}>
          <ReadyDishes cx={540} cy={1150} at={10} />
        </TimeScale>
      </Grow>
    </Sequence>
    <Beat from={0} dur={56}>
      <KineticText top={290} lines={[lead('Только в готовое блюдо', 10, true)]} />
    </Beat>
    <Beat from={56} dur={50}>
      <KineticText top={290} lines={[lead('Салат, винегрет,', 4, true), lead('квашеная капуста', 8)]} />
    </Beat>
    <Beat from={106} dur={50}>
      <KineticText top={290} lines={[lead('Каша, творог,', 4, true), lead('картошка', 8)]} />
    </Beat>
    <Beat from={156} dur={50}>
      <KineticText top={290} lines={[lead('Суп в тарелке,', 4, true), lead('соус, хлеб', 8)]} />
    </Beat>
    <Beat from={206} dur={40}>
      <KineticText top={290} lines={[lead('1–2 ложки в день', 4, true)]} />
    </Beat>
    <Beat from={246} dur={54} last>
      <Bg color={COLORS.cream} />
      <KineticText top={290} lines={[lead('На нём не жарят', 4, true)]} />
      <TimeScale k={1.8}>
        <NoFrying cx={540} cy={1100} at={0} />
      </TimeScale>
    </Beat>
  </AbsoluteFill>
);

// 8. Freshness and delivery
const Fresh: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <Beat from={0} dur={76}>
      <KineticText top={290} lines={[lead('Отжим только', 10, true), lead('после заказа', 15)]} />
      <Grow cy={1100}>
        <TimeScale k={1.6}>
          <OrderToPress cx={540} cy={1100} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={76} dur={72}>
      <KineticText top={290} lines={[lead('До доставки', 6, true), lead('не больше 2 дней', 11)]} />
      <Grow cy={1100}>
        <TimeScale k={1.6}>
          <ShipIn2Days cx={540} cy={1100} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={148} dur={72} last>
      <HeroShot oil="peanut" dur={72} focus={[0.82, 0.87]} scale={[2.2, 3.0]} x={[-150, -240]} lines={[lead('Дата отжима', 8, true, COLORS.cream), lead('на каждой бутылке', 13, false, COLORS.cream)]} />
    </Beat>
  </AbsoluteFill>
);

// 9. Close-ups, then all ten bottles
const LINE: {oil: Oil; name: string}[] = [
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
const DropIn: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 170, mass: 0.7}});
  return <AbsoluteFill style={{opacity: f >= at ? 1 : 0, transform: `translateY(${(1 - s) * -160}px)`}}>{children}</AbsoluteFill>;
};
const Lineup: React.FC = () => {
  const heroes: {oil: Oil; name: string}[] = [
    {oil: 'linen', name: 'Льняное'},
    {oil: 'sesame', name: 'Кунжутное'},
    {oil: 'almond', name: 'Миндальное'},
  ];
  return (
    <AbsoluteFill>
      <Bg color={COLORS.cream} />
      {heroes.map((h, i) => (
        <Beat key={h.oil} from={i * 42} dur={42}>
          <HeroShot oil={h.oil} dur={42} focus={[0.45, 0.6]} scale={[1.9, 1.6]} tilt={[i % 2 ? 3 : -3, 0]} lines={[lead(h.name, 4, true, COLORS.cream)]} />
        </Beat>
      ))}
      <Beat from={126} dur={124} last>
        <Bg color={COLORS.cream} />
        <KineticText top={290} lines={[lead('10 масел,', 6, true), lead('у каждого свой вкус', 11)]} />
        {LINE.map((b, i) => {
          const row = Math.floor(i / 5);
          const x = 140 + (i % 5) * 200;
          const bottom = row ? 1500 : 1010;
          return (
            <DropIn key={b.oil} at={14 + i * 5}>
              <StudioBottle oil={b.oil} x={x} bottom={bottom} height={430} glossAt={20 + i * 3} />
              <div style={{position: 'absolute', left: x - 110, width: 220, top: bottom + 22, textAlign: 'center', fontFamily: 'MasRegular', fontSize: 34, color: COLORS.ink}}>{b.name}</div>
              {i % 3 === 0 ? <Sfx name="thud" at={14 + i * 5} gain={0.35} /> : null}
            </DropIn>
          );
        })}
      </Beat>
    </AbsoluteFill>
  );
};

// 10. Call to order
const Cta: React.FC = () => (
  <AbsoluteFill>
    <Bg color={COLORS.cream} />
    <LogoPlate at={10} cy={460} width={660} />
    <KineticText top={640} lines={[sub('Заказывайте на', 22, COLORS.inkSoft), lead('maslarada.ru', 26, true), sub('Отжим под ваш заказ', 44)]} />
    {LINE.map((b, i) => (
      <DropIn key={b.oil} at={30 + i * 3}>
        <StudioBottle oil={b.oil} x={99 + i * 98} bottom={1520} height={330} gloss={false} />
      </DropIn>
    ))}
  </AbsoluteFill>
);

// Timeline: scenes and the transitions between them.
type Item = {scene: React.ReactNode; dur: number; fx?: Fx; fxDur?: number};
const ITEMS: Item[] = [
  {scene: <Hook />, dur: 100, fx: press('r1'), fxDur: 22},
  {scene: <WhatItIs />, dur: 115, fx: liquid('r2'), fxDur: 24},
  {scene: <HeroShot oil="sun" dur={90} focus={[0.3, 0.62]} scale={[2.3, 1.55]} tilt={[-3, 2]} lines={[lead('Сохраняет вкус,', 12, true, COLORS.cream), lead('цвет и запах семян', 17, false, COLORS.cream)]} />, dur: 90, fx: whip(1), fxDur: 12},
  {scene: <Refined />, dur: 300, fx: zoomThrough(540, 1130), fxDur: 16},
  {scene: <Olive />, dur: 115, fx: bottleMask(), fxDur: 22},
  {scene: <Benefits />, dur: 195, fx: splash(540, 1000), fxDur: 22},
  {scene: <Uses />, dur: 300, fx: flood('r7'), fxDur: 24},
  {scene: <Fresh />, dur: 220, fx: card(), fxDur: 16},
  {scene: <Lineup />, dur: 250, fx: whip(-1), fxDur: 12},
  {scene: <Cta />, dur: 130},
];
export const REEL_FRAMES = ITEMS.reduce((s, it) => s + it.dur - (it.fxDur ?? 0), 0);

export const Reel: React.FC = () => (
  <Stage>
    <TransitionSeries>
      {ITEMS.map((it, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={it.dur}>{it.scene}</TransitionSeries.Sequence>
          {it.fx ? <TransitionSeries.Transition presentation={it.fx} timing={linearTiming({durationInFrames: it.fxDur ?? 16})} /> : null}
        </React.Fragment>
      ))}
    </TransitionSeries>
  </Stage>
);
