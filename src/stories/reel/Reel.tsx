// The full reel: one continuous film built from scenes joined by varied transitions.
// Copy follows docs/scenario_reel.md. Every phrase gets about 0.5 s per word on screen.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {KineticText, TextLine} from '../../components/KineticText';
import {LogoPlate} from '../../components/LogoPlate';
import {SeedDrift, SeedRain} from '../../components/Seeds';
import {Stage} from '../../components/Stage';
import {HeroBg, StudioBg} from '../../components/StudioBg';
import {BottleHero, StudioBottle} from '../../components/StudioBottle';
import {ChapterCard} from '../../components/ChapterCard';
import {bottleMask, card, flood, liquid, press, splash, whip, zoomThrough, Fx} from '../../fx/presentations';
import {OmegaPlate, Organs, VitaminE} from '../../illus/benefit';
import {Grow, TimeScale} from '../../illus/kit';
import {OmegaJars} from '../../illus/olive';
import {OrderToPress, ShipIn2Days} from '../../illus/order';
import {PressCutaway} from '../../illus/press';
import {BleachFlasks, HeatTray, ShelfBottleArt, SteamTank} from '../../illus/shelf';
import {ReadyDishes, SpoonFill} from '../../illus/usage';
import {Sfx} from '../../sfx';
import {COLORS, OIL, Oil} from '../../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A phrase split over lines: the first line taps, words rise one after another.
const phrase = (lines: string[], at: number, color?: string): TextLine[] =>
  lines.map((text, i) => ({text, at: at + i * 6, role: 'para', color, sound: i === 0, stagger: 2}));
const Text: React.FC<{lines: string[]; at: number; top?: number; out?: number; color?: string}> = ({lines, at, top = 290, out, color}) => (
  <KineticText top={top} out={out} lines={phrase(lines, at, color)} />
);

// Quick internal beats inside a scene: each beat pushes in from the side and leaves the other way.
const Beat: React.FC<{from: number; dur: number; children: React.ReactNode; last?: boolean}> = ({from, dur, children, last}) => (
  <Sequence from={from} durationInFrames={dur}>
    <BeatMotion dur={dur} last={last}>
      {children}
    </BeatMotion>
  </Sequence>
);
const BeatMotion: React.FC<{dur: number; last?: boolean; children: React.ReactNode}> = ({dur, last, children}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const outP = last ? 0 : interpolate(f, [dur - 8, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return <AbsoluteFill style={{transform: `translateX(${inP * 220 - outP * 220}px)`, opacity: 1 - Math.max(inP, outP)}}>{children}</AbsoluteFill>;
};

// Keeps the bottle clear of the text: fully hidden above `clear`, faded in over the next 140 px.
const heroMask = (clear: number): React.CSSProperties => {
  const m = `linear-gradient(180deg, rgba(0,0,0,0) ${clear}px, rgba(0,0,0,1) ${clear + 140}px)`;
  return {WebkitMaskImage: m, maskImage: m};
};

// Close-up of a real bottle on a dark backdrop in its label colour.
const HeroShot: React.FC<{oil: Oil; dur: number; lines: string[]; at?: number; focus: [number, number]; scale: [number, number]; tilt?: [number, number]; x?: [number, number]}> = ({oil, dur, lines, at = 10, focus, scale, tilt, x}) => (
  <AbsoluteFill>
    <HeroBg color={OIL[oil]} seed={oil} />
    <AbsoluteFill style={heroMask(290 + lines.length * 81 + 70)}>
      <BottleHero oil={oil} dur={dur} focus={focus} scale={scale} tilt={tilt} x={x} />
    </AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,10,5,0.82) 0%, rgba(16,10,5,0.45) 36%, rgba(16,10,5,0) 52%)'}} />
    <Text lines={lines} at={at} color={COLORS.cream} />
  </AbsoluteFill>
);

// 1. Hook: what is cold-pressed oil good for?
const Hook: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1420} />
    <SeedDrift count={18} seed="h1" kinds={['sunflower', 'flax', 'sesame', 'hemp']} size={[16, 30]} speed={5} opacity={0.5} />
    <SeedRain count={64} seed="h2" kinds={['sunflower', 'sunflower', 'pumpkin', 'flax', 'sesame', 'hemp']} floor={[1440, 1780]} spread={34} />
    <Sfx name="seeds" at={2} gain={0.8} />
    <KineticText top={700} lines={[{text: 'Чем полезно', at: 8, role: 'lead'}, {text: 'сыродавленное масло?', at: 14, role: 'lead', sound: false}]} />
  </AbsoluteFill>
);

// 2. What it is
const WhatItIs: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Text lines={['Сыродавленное масло', 'получают прессованием', 'семян без нагрева,', 'не выше 30 °C']} at={12} />
    <TimeScale k={1.3}>
      <PressCutaway cx={540} cy={1180} at={0} scale={1.0} />
    </TimeScale>
  </AbsoluteFill>
);

// 3. Raw material
const RawMaterial: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1380} light={[50, 55]} />
    <SeedDrift count={26} seed="raw" kinds={['sunflower', 'sunflower', 'flax', 'pumpkin']} size={[24, 60]} speed={2.5} area={[0, 560, 1080, 1700]} />
    <StudioBottle oil="sun" x={540} bottom={1420} height={720} reflect glossAt={20} />
    <Text lines={['Масларада делает масло', 'только из первоклассного', 'сырья']} at={10} />
  </AbsoluteFill>
);

// 4. Oil from shop shelves, step by step
const SHELF_STEPS: {lines: string[]; dur: number; art: React.ReactNode; cy: number}[] = [
  {lines: ['Семена прогревают,', 'чтобы выжать', 'больше масла'], dur: 84, art: <HeatTray cx={540} cy={1120} at={0} />, cy: 1120},
  {lines: ['Затем масло очищают', 'и осветляют'], dur: 72, art: <BleachFlasks cx={540} cy={1100} at={0} />, cy: 1100},
  {lines: ['Запах убирают', 'горячим паром', 'при 200 °C и выше'], dur: 90, art: <SteamTank cx={540} cy={1160} at={0} />, cy: 1160},
];
const SHELF_INTRO = 96;
const SHELF_RESULT = 120;
const SHELF_DUR = SHELF_INTRO + SHELF_STEPS.reduce((s, x) => s + x.dur, 0) + SHELF_RESULT;
const Shelf: React.FC = () => {
  let t = SHELF_INTRO;
  return (
    <AbsoluteFill>
      <StudioBg />
      <Beat from={0} dur={SHELF_INTRO}>
        <Text lines={['А масло с полок', 'магазинов часто', 'делают иначе']} at={10} />
        <Grow cy={1150}>
          <ShelfBottleArt cx={540} cy={1150} at={0} />
        </Grow>
      </Beat>
      {SHELF_STEPS.map((s, i) => {
        const from = t;
        t += s.dur;
        return (
          <Beat key={i} from={from} dur={s.dur}>
            <KineticText top={290} lines={[{text: `${i + 1} / 3`, at: 2, role: 'sub', color: COLORS.amber, sound: false}, ...phrase(s.lines, 6)]} />
            <Grow cy={s.cy} s={1.12}>
              <TimeScale k={1.4}>{s.art}</TimeScale>
            </Grow>
          </Beat>
        );
      })}
      <Beat from={t} dur={SHELF_RESULT} last>
        <StudioBg floor={1390} />
        <Text lines={['Так масло теряет', 'природный вкус, запах', 'и часть витамина E']} at={8} />
        {/* both bottles 700 px tall, standing on the same line; captions well below their shadows */}
        <ShelfBottleArt cx={330} cy={1040} at={0} />
        <StudioBottle oil="sun" x={740} bottom={1400} height={700} reflect glossAt={20} />
        <div style={{position: 'absolute', left: 130, width: 400, top: 1460, textAlign: 'center', fontFamily: 'MasRegular', fontSize: 40, color: COLORS.inkSoft}}>с полки магазина</div>
        <div style={{position: 'absolute', left: 540, width: 400, top: 1460, textAlign: 'center', fontFamily: 'MasRegular', fontSize: 40, color: COLORS.inkSoft}}>сыродавленное</div>
      </Beat>
    </AbsoluteFill>
  );
};

// 5. Taste and aroma
const Taste: React.FC = () => (
  <HeroShot oil="sesame" dur={180} focus={[0.38, 0.52]} scale={[1.9, 1.55]} tilt={[-2, 2]} lines={['Сыродавленное масло', 'пахнет семенами,', 'из которых его сделали,', 'и имеет мягкий', 'естественный вкус']} />
);

// 6. Omega-3 compared
const Omega: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Text lines={['В подсолнечном', 'и оливковом масле', 'с полок магазинов', 'омега-3 меньше 1 %']} at={10} out={150} />
    <Text lines={['А в сыродавленном', 'льняном омега-3', 'больше половины', 'всего состава']} at={162} />
    <Grow cy={1220} s={1.0}>
      <TimeScale k={0.9}>
        <OmegaJars cx={540} cy={1220} at={30} labels={[['с полок', 'магазинов'], ['сыродавленное', 'льняное']]} />
      </TimeScale>
    </Grow>
  </AbsoluteFill>
);

// 7. Vitamin E, explained
const VitE: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Beat from={0} dur={170}>
      <Text lines={['В одной ложке', 'сыродавленного', 'подсолнечного масла', 'больше трети дневной', 'нормы витамина E']} at={10} />
      <Grow cy={1180}>
        <TimeScale k={1.2}>
          <SpoonFill cx={540} cy={1180} at={0} />
        </TimeScale>
      </Grow>
      <Fraction at={60} />
    </Beat>
    <Beat from={170} dur={100} last>
      <Text lines={['Витамин E помогает', 'защищать клетки', 'организма']} at={6} />
      <TimeScale k={1.3}>
        <VitaminE cx={540} cy={1160} at={0} />
      </TimeScale>
    </Beat>
  </AbsoluteFill>
);
const Fraction: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 160}});
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: 'MasMedium', fontSize: 150, color: COLORS.amber, transform: `scale(${s})`}}>&gt; 1/3 нормы</div>
      <Sfx name="clink" at={at} />
    </>
  );
};

// 8. Health support
const Health: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Beat from={0} dur={110}>
      <Text lines={['Омега-3 и омега-6', 'организм', 'не вырабатывает сам']} at={10} />
      <Grow cy={1200} s={1.05}>
        <TimeScale k={1.3}>
          <OmegaPlate cx={540} cy={1200} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={110} dur={180} last>
      <Text lines={['Сыродавленные масла', 'способствуют работе', 'сердца, сосудов,', 'иммунной системы', 'и обмену веществ']} at={6} />
      <Grow cy={1240} s={0.95}>
        <Organs cx={540} cy={1240} at={30} />
      </Grow>
    </Beat>
  </AbsoluteFill>
);

// 9. How to use
const Use: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Beat from={0} dur={120}>
      <Text lines={['Его добавляют', 'в готовые блюда', 'и не нагревают']} at={10} />
      <Grow cy={1180} s={1.2}>
        <TimeScale k={0.9}>
          <ReadyDishes cx={540} cy={1180} at={10} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={120} dur={100} last>
      <Text lines={['Достаточно', '1–2 ложек в день']} at={6} />
      <Grow cy={1140}>
        <TimeScale k={1.3}>
          <SpoonFill cx={540} cy={1140} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
  </AbsoluteFill>
);

// 10. Why pressed to order, delivery, date
const Fresh: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Beat from={0} dur={90}>
      <Text lines={['Почему отжим', 'только под заказ?']} at={10} top={760} />
    </Beat>
    <Beat from={90} dur={175}>
      <Text lines={['Масло не лежит', 'на складе, не теряет', 'свойств и сохраняет', 'омега-3']} at={6} />
      <Grow cy={1180}>
        <TimeScale k={1.2}>
          <OrderToPress cx={540} cy={1180} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={265} dur={115}>
      <Text lines={['От маслопресса', 'до вашего стола', 'за 48 часов']} at={6} />
      <Grow cy={1200}>
        <TimeScale k={1.2}>
          <ShipIn2Days cx={540} cy={1200} at={0} />
        </TimeScale>
      </Grow>
    </Beat>
    <Beat from={380} dur={100} last>
      <StudioBg floor={1440} />
      <Text lines={['Дата отжима', 'на каждой бутылке']} at={6} />
      <StudioBottle oil="peanut" x={540} bottom={1460} height={900} reflect glossAt={10} />
      <DateRing at={30} />
    </Beat>
  </AbsoluteFill>
);
// Pulsing ring around the date field on the peanut bottle label (field sits low, right of centre).
const DateRing: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const pulse = 1 + 0.05 * Math.sin((f - at) / 4);
  const h = 900;
  const w = h * 0.2527;
  const cx = 540 - w / 2 + w * 0.81;
  const cy = 1460 - h + h * 0.9;
  return (
    <>
      <div style={{position: 'absolute', left: cx - 80, top: cy - 40, width: 160, height: 80, borderRadius: 40, border: `8px solid ${COLORS.amber}`, transform: `scale(${p * pulse})`, boxShadow: '0 0 30px rgba(201,130,26,0.55)'}} />
      <Sfx name="tap" at={at} />
    </>
  );
};

// 11. Close-ups, then all ten bottles
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
  return <AbsoluteFill style={{opacity: f >= at ? Math.min(1, (f - at) / 4) : 0, transform: `translateY(${(1 - s) * -140}px)`}}>{children}</AbsoluteFill>;
};
const Lineup: React.FC = () => {
  const heroes: {oil: Oil; name: string}[] = [
    {oil: 'linen', name: 'Льняное'},
    {oil: 'mustard', name: 'Горчичное'},
    {oil: 'almond', name: 'Миндальное'},
  ];
  return (
    <AbsoluteFill>
      {heroes.map((h, i) => (
        <Beat key={h.oil} from={i * 48} dur={48}>
          <HeroShot oil={h.oil} dur={48} at={4} focus={[0.4, 0.5]} scale={[2.1, 1.8]} tilt={[i % 2 ? 3 : -3, 0]} lines={[h.name]} />
        </Beat>
      ))}
      <Beat from={144} dur={150} last>
        <StudioBg />
        <Text lines={['10 сыродавленных', 'масел, у каждого', 'свой вкус']} at={6} />
        {LINE.map((b, i) => {
          const row = Math.floor(i / 5);
          const x = 120 + (i % 5) * 210;
          const bottom = row ? 1480 : 980;
          return (
            <DropIn key={b.oil} at={24 + i * 5}>
              <StudioBottle oil={b.oil} x={x} bottom={bottom} height={340} glossAt={30 + i * 3} />
              <div style={{position: 'absolute', left: x - 105, width: 210, top: bottom + 26, textAlign: 'center', fontFamily: 'MasRegular', fontSize: 28, color: COLORS.ink}}>{b.name}</div>
              {i % 3 === 0 ? <Sfx name="thud" at={24 + i * 5} gain={0.35} /> : null}
            </DropIn>
          );
        })}
      </Beat>
    </AbsoluteFill>
  );
};

// 12. Call to order
const Cta: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1300} />
    <LogoPlate at={10} cy={470} width={680} />
    <KineticText top={660} lines={[{text: 'Заказывайте на', at: 22, role: 'sub', color: COLORS.inkSoft}, {text: 'maslarada.ru', at: 28, role: 'title', sound: false}]} />
    {LINE.map((b, i) => (
      <DropIn key={b.oil} at={34 + i * 3}>
        <StudioBottle oil={b.oil} x={99 + i * 98} bottom={1320} height={340} gloss={false} reflect />
      </DropIn>
    ))}
  </AbsoluteFill>
);

// Timeline: scenes and the transitions between them.
type Item = {scene: React.ReactNode; dur: number; fx?: Fx; fxDur?: number};
const CH = 60; // chapter title card
const ITEMS: Item[] = [
  {scene: <ChapterCard n={1} title={['Польза']} />, dur: CH, fx: zoomThrough(540, 700), fxDur: 16},
  {scene: <Hook />, dur: 110, fx: press('p1'), fxDur: 22},
  {scene: <ChapterCard n={2} title={['Процесс', 'производства']} />, dur: CH, fx: whip(1), fxDur: 12},
  {scene: <WhatItIs />, dur: 200, fx: liquid('w1'), fxDur: 24},
  {scene: <RawMaterial />, dur: 140, fx: whip(-1), fxDur: 12},
  {scene: <Shelf />, dur: SHELF_DUR, fx: zoomThrough(540, 1150), fxDur: 16},
  {scene: <ChapterCard n={3} title={['Вкус и запах']} />, dur: CH, fx: bottleMask(), fxDur: 22},
  {scene: <Taste />, dur: 180, fx: card(), fxDur: 16},
  {scene: <ChapterCard n={4} title={['Витамины']} />, dur: CH, fx: whip(1), fxDur: 12},
  {scene: <Omega />, dur: 300, fx: splash(540, 1100), fxDur: 22},
  {scene: <VitE />, dur: 270, fx: flood('f1'), fxDur: 24},
  {scene: <Health />, dur: 290, fx: card(), fxDur: 16},
  {scene: <ChapterCard n={5} title={['Как употреблять', 'в пищу']} />, dur: CH, fx: liquid('w3'), fxDur: 24},
  {scene: <Use />, dur: 220, fx: whip(-1), fxDur: 12},
  {scene: <Fresh />, dur: 480, fx: press('p2'), fxDur: 22},
  {scene: <Lineup />, dur: 294, fx: zoomThrough(540, 900), fxDur: 16},
  {scene: <Cta />, dur: 140},
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
