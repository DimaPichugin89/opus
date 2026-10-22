// Sunflower reel, 25 s: vitamin E, taste of real seeds, how shelf oil differs, price and order.
// Script: docs/scenario_sunflower.md. Calm 22-frame transitions between all text shots.
import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { KineticText } from "../../components/KineticText";
import { LogoPlate } from "../../components/LogoPlate";
import { SeedDrift, SeedRain } from "../../components/Seeds";
import { Stage } from "../../components/Stage";
import { StudioBg } from "../../components/StudioBg";
import { StudioBottle } from "../../components/StudioBottle";
import {
  bottleMask,
  card,
  flood,
  liquid,
  press,
  Fx,
} from "../../fx/presentations";
import { VitaminE } from "../../illus/benefit";
import { Grow, TimeScale } from "../../illus/kit";
import {
  BleachFlasks,
  HeatTray,
  ShelfBottleArt,
  SteamTank,
} from "../../illus/shelf";
import { SpoonFill } from "../../illus/usage";
import { MixGain, Sfx } from "../../sfx";
import { COLORS } from "../../theme";
import { Beat, Fraction, HeroShot, phrase, Text } from "../reel/Reel";

const Hook: React.FC = () => (
  <HeroShot
    oil="sun"
    dur={110}
    focus={[0.5, 0.6]}
    scale={[1.7, 1.4]}
    tilt={[-2, 1]}
    lines={["Сыродавленное", "подсолнечное масло", "отжим не выше 30 °C"]}
  />
);

const Spoon: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Text
      lines={["В ложке больше трети", "дневной нормы", "витамина E"]}
      at={12}
    />
    <Grow cy={1120}>
      <TimeScale k={1.3}>
        <SpoonFill cx={540} cy={1120} at={0} />
      </TimeScale>
    </Grow>
    <Fraction at={50} />
  </AbsoluteFill>
);

const Cells: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Text lines={["Витамин E помогает", "защищать клетки"]} at={12} />
    <TimeScale k={1.3}>
      <VitaminE cx={540} cy={1130} at={0} />
    </TimeScale>
  </AbsoluteFill>
);

const Taste: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1400} light={[50, 55]} />
    <SeedDrift
      count={22}
      seed="st"
      kinds={["sunflower"]}
      size={[24, 56]}
      speed={2.5}
      area={[0, 620, 1080, 1700]}
    />
    <SeedRain
      count={40}
      seed="sr"
      kinds={["sunflower"]}
      floor={[1420, 1560]}
      spread={30}
      start={6}
    />
    <Sfx name="seeds" at={8} gain={0.7} />
    <StudioBottle
      oil="sun"
      x={540}
      bottom={1420}
      height={720}
      reflect
      glossAt={24}
    />
    <Text
      lines={["Мягкий вкус и запах", "настоящих семян", "подсолнечника"]}
      at={12}
    />
  </AbsoluteFill>
);

// Shelf oil: the phrase stays, the three steps play under it.
const STEPS = [
  { art: <HeatTray cx={540} cy={1140} at={0} />, cy: 1140 },
  { art: <BleachFlasks cx={540} cy={1120} at={0} />, cy: 1120 },
  { art: <SteamTank cx={540} cy={1170} at={0} />, cy: 1170 },
];
const STEP = 46;
const Shelf: React.FC = () => (
  <AbsoluteFill>
    <StudioBg />
    <Text
      lines={["Масло с полок часто", "прогревают, очищают", "и пропаривают"]}
      at={12}
    />
    {STEPS.map((s, i) => (
      <Beat
        key={i}
        from={10 + i * STEP}
        dur={i === 2 ? 150 - 10 - 2 * STEP : STEP}
        last={i === 2}
      >
        <Grow cy={s.cy} s={1.05}>
          <TimeScale k={1.6}>{s.art}</TimeScale>
        </Grow>
      </Beat>
    ))}
  </AbsoluteFill>
);

const Result: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1390} />
    <Text
      lines={["Так уходят природный", "вкус, запах", "и часть витамина E"]}
      at={12}
    />
    <ShelfBottleArt cx={330} cy={1040} at={0} />
    <StudioBottle
      oil="sun"
      x={740}
      bottom={1400}
      height={700}
      reflect
      glossAt={20}
    />
    <div
      style={{
        position: "absolute",
        left: 130,
        width: 400,
        top: 1460,
        textAlign: "center",
        fontFamily: "MasRegular",
        fontSize: 40,
        color: COLORS.inkSoft,
      }}
    >
      с полки магазина
    </div>
    <div
      style={{
        position: "absolute",
        left: 540,
        width: 400,
        top: 1460,
        textAlign: "center",
        fontFamily: "MasRegular",
        fontSize: 40,
        color: COLORS.inkSoft,
      }}
    >
      сыродавленное
    </div>
  </AbsoluteFill>
);

const Price: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: f - at,
    fps,
    config: { damping: 14, stiffness: 150 },
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          textAlign: "center",
          fontFamily: "MasMedium",
          fontSize: 190,
          letterSpacing: "-0.03em",
          color: COLORS.amber,
          transform: `scale(${s})`,
        }}
      >
        600 руб.
      </div>
      <Sfx name="clink" at={at} />
    </>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill>
    <StudioBg floor={1560} />
    <LogoPlate at={8} cy={400} width={560} />
    <Price at={16} />
    <KineticText
      top={830}
      lines={phrase(["Заказывайте на"], 26, COLORS.inkSoft).concat({
        text: "maslarada.ru",
        at: 32,
        role: "title",
        sound: false,
      })}
    />
    <StudioBottle
      oil="sun"
      x={540}
      bottom={1570}
      height={480}
      reflect
      glossAt={40}
    />
  </AbsoluteFill>
);

type Item = { scene: React.ReactNode; dur: number; fx?: Fx };
const FX = 22;
const ITEMS: Item[] = [
  { scene: <Hook />, dur: 110, fx: liquid("s1") },
  { scene: <Spoon />, dur: 150, fx: flood("s2") },
  { scene: <Cells />, dur: 90, fx: bottleMask() },
  { scene: <Taste />, dur: 135, fx: card() },
  { scene: <Shelf />, dur: 150, fx: liquid("s3", true) },
  { scene: <Result />, dur: 145, fx: press("s4") },
  { scene: <Cta />, dur: 100 },
];
export const SUN_FRAMES = ITEMS.reduce(
  (s, it) => s + it.dur - (it.fx ? FX : 0),
  0,
);

export const SunReel: React.FC = () => (
  <MixGain.Provider value={0.8}>
    <Stage>
      <TransitionSeries>
        {ITEMS.map((it, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={it.dur}>
              {it.scene}
            </TransitionSeries.Sequence>
            {it.fx ? (
              <TransitionSeries.Transition
                presentation={it.fx}
                timing={linearTiming({ durationInFrames: FX })}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </Stage>
  </MixGain.Provider>
);
