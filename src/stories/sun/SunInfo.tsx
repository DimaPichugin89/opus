// Sunflower reel, 25 s, infographics only: taste and aroma shown as sound volume.
// One continuous shape travels through the whole cut: seeds -> equalizer bars -> flat line ->
// thermometer -> drop with a ring chart -> norm scale -> petals around the price.
// Concept and facts: docs/sun_concept.md.
import React from 'react';
import {Easing, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText, TextLine} from '../../components/KineticText';
import {Stage} from '../../components/Stage';
import {MixGain, Sfx} from '../../sfx';
import {COLORS} from '../../theme';
import {phrase} from '../reel/Reel';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo out
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const IN = Easing.bezier(0.6, 0, 0.9, 0.4);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TAU = Math.PI * 2;

const INK = COLORS.ink;
const AMBER = COLORS.amber;
const GOLD = COLORS.amberLight;
const RED = '#E2312A';
const GHOST = 'rgba(38,23,13,0.12)';
const NUM: React.CSSProperties = {fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums'};

// Timeline (frames). Every text shot holds about 14 frames per word.
const T = {
  toBars: 104,
  s2Text: 128,
  drop: 150,
  flat: 196,
  s2Out: 240,
  toTherm: 236,
  s3Text: 256,
  fill: 264,
  s3Out: 330,
  toDrop: 326,
  s4Text: 346,
  ring: 362,
  s4Out: 472,
  unroll: 468,
  s5Text: 490,
  count: 520,
  s5Out: 616,
  toPetals: 612,
  price: 646,
  cta: 690,
};
export const SUN_INFO_FRAMES = 750;

// --- shared geometry ----------------------------------------------------------

const FLOWER = {x: 540, y: 1060};
const SEEDS = Array.from({length: 144}, (_, k) => {
  const a = k * 2.39996; // golden angle
  const rad = 16.2 * Math.sqrt(k + 0.6);
  const size = 5 + 3.2 * Math.sqrt(k / 144);
  return {k, a, rad, size, col: k % 9, row: Math.floor(k / 9)};
});

const BAR = {x0: 148, step: 90, w: 64, base: 1460, max: 640};
const BAR_BASE = [0.55, 0.72, 0.86, 0.93, 0.8, 0.9, 0.75, 0.62, 0.7];
const barX = (i: number) => BAR.x0 + i * BAR.step;
const alive = (i: number, f: number) => BAR_BASE[i] + 0.07 * Math.sin(f / 6 + i * 1.7) + 0.045 * Math.sin(f / 2.7 + i * 0.9);

const THERMO = {x: 330, bottom: 1400, top: 760, w: 52, bulbY: 1432, bulbR: 58};
const tempY = (c: number) => 1380 - c * 10;

const DROP = {x: 540, y: 1150, r: 300};
const RING = {r: 200, w: 72};
const SCALE = {x0: 110, x1: 970, y: 1290, w: 28};
const NORM = 15; // mg of vitamin E per day
const SPOON_MG = 5.6;

const END = {x: 540, y: 720, R: 235};

// Drop outline: t = 0 is a circle, t = 1 a drop with its tip up.
const dropPath = (cx: number, cy: number, rad: number, t: number) => {
  const e = t * rad * 0.55;
  const top = cy - rad - e;
  const c1x = rad * lerp(0.552, 0.3, t);
  const c1y = top + lerp(0, 0.32 * (rad + e), t);
  const c2y = cy - rad * lerp(0.552, 0.6, t);
  return [
    `M ${cx} ${top}`,
    `C ${cx + c1x} ${c1y} ${cx + rad} ${c2y} ${cx + rad} ${cy}`,
    `A ${rad} ${rad} 0 0 1 ${cx - rad} ${cy}`,
    `C ${cx - rad} ${c2y} ${cx - c1x} ${c1y} ${cx} ${top}`,
    'Z',
  ].join(' ');
};

const petalPath = (len: number, w: number) => `M 0 0 C ${w / 2} ${-len * 0.22} ${w / 2} ${-len * 0.78} 0 ${-len} C ${-w / 2} ${-len * 0.78} ${-w / 2} ${-len * 0.22} 0 0 Z`;

// --- 1. sunflower, seeds fly into the equalizer ------------------------------

const Flower: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f > T.s2Text + 12) return null;
  const rot = 8 * r(f, 0, T.toBars, Easing.linear) * (Math.PI / 180);
  const petalsGone = r(f, T.toBars - 6, T.toBars + 10, IN);
  const core = 1 - r(f, T.toBars, T.toBars + 14, IN);
  return (
    <g>
      {[0, 1].map((layer) =>
        Array.from({length: 21}, (_, i) => {
          const ang = (i + layer * 0.5) * (360 / 21) + rot * (180 / Math.PI);
          const g = spring({frame: f - 12 - i * 0.9 - layer * 4, fps, config: {damping: 13, stiffness: 120}});
          const s = g * (1 - petalsGone);
          if (s <= 0.001) return null;
          return (
            <g key={`${layer}-${i}`} transform={`translate(${FLOWER.x} ${FLOWER.y}) rotate(${ang}) translate(0 ${-192 + layer * 8}) scale(${s})`}>
              <path d={petalPath(layer ? 176 : 204, layer ? 66 : 76)} fill={layer ? AMBER : 'url(#petal)'} />
            </g>
          );
        }),
      )}
      <circle cx={FLOWER.x} cy={FLOWER.y} r={208 * spring({frame: f - 2, fps, config: {damping: 16, stiffness: 140}}) * core} fill={COLORS.creamDeep} />
      {SEEDS.map((s) => {
        const appear = spring({frame: f - s.k * 0.17, fps, config: {damping: 11, stiffness: 170}});
        const a = s.a + rot;
        const x0 = FLOWER.x + Math.cos(a) * s.rad;
        const y0 = FLOWER.y + Math.sin(a) * s.rad;
        const h = alive(s.col, T.s2Text) * BAR.max;
        const x1 = barX(s.col) + BAR.w / 2;
        const y1 = BAR.base - 20 - s.row * ((h - 34) / 15);
        const start = T.toBars + s.col * 1.3 + s.row * 0.35;
        const p = r(f, start, start + 18, INOUT);
        const x = lerp(x0, x1, p);
        const y = lerp(y0, y1, p) - Math.sin(Math.PI * p) * 90;
        const ang = lerp((a * 180) / Math.PI + 90, 0, p);
        const fade = 1 - r(f, T.s2Text - 4, T.s2Text + 8, Easing.linear);
        const shade = s.k < 70 ? INK : s.k % 3 === 0 ? AMBER : COLORS.inkSoft;
        return (
          <ellipse
            key={s.k}
            cx={0}
            cy={0}
            rx={s.size * lerp(1, 1.5, p)}
            ry={s.size * 1.55 * lerp(1, 0.75, p)}
            fill={interpolateColors(p, [0, 1], [shade, AMBER])}
            opacity={fade}
            transform={`translate(${x} ${y}) rotate(${ang}) scale(${appear})`}
          />
        );
      })}
    </g>
  );
};

// --- volume slider on the right edge -------------------------------------------

const Slider: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const show = r(f, 10, 26) * (1 - r(f, T.fill + 8, T.fill + 20, IN));
  if (show <= 0) return null;
  const up1 = r(f, 22, 72, INOUT);
  const down = r(f, T.drop, T.drop + 46, INOUT);
  const up2 = spring({frame: f - T.toTherm - 2, fps, config: {damping: 12, stiffness: 90}});
  const level = f < T.toTherm ? up1 * (1 - down * 0.96) : lerp(0.04, 1, up2);
  const x = 994;
  const y0 = 1360;
  const y1 = 800;
  const ky = lerp(y0, y1, level);
  return (
    <g opacity={show}>
      <line x1={x} y1={y0} x2={x} y2={y1} stroke={GHOST} strokeWidth={6} strokeLinecap="round" />
      <line x1={x} y1={y0} x2={x} y2={ky} stroke={RED} strokeWidth={6} strokeLinecap="round" />
      <path d={dropPath(x, ky, 20, 1)} fill={RED} />
      {/* speaker: the waves fill in with the level */}
      <g transform={`translate(${x - 14} 740)`}>
        <path d="M 0 -10 L 10 -10 L 22 -22 L 22 22 L 10 10 L 0 10 Z" fill={INK} />
        {[0, 1, 2].map((w) => (
          <path key={w} d={`M ${30 + w * 10} -${10 + w * 7} Q ${40 + w * 13} 0 ${30 + w * 10} ${10 + w * 7}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={interpolate(level, [w / 3, (w + 1) / 3], [0.12, 1], cl)} />
        ))}
      </g>
    </g>
  );
};

// --- 2. equalizer falls silent ---------------------------------------------------

const LABELS = [
  {text: 'вкус', i: 1},
  {text: 'запах', i: 4},
  {text: 'витамин E', i: 7},
];

const Equalizer: React.FC<{f: number}> = ({f}) => {
  if (f < T.s2Text - 6 || f > T.toTherm + 4) return null;
  const on = r(f, T.s2Text - 6, T.s2Text + 6, Easing.linear);
  const flat = r(f, T.flat, T.flat + 16, INOUT);
  const labels = r(f, T.s2Text + 6, T.s2Text + 20) * (1 - r(f, T.toTherm - 6, T.toTherm + 4, Easing.linear));
  return (
    <g>
      {BAR_BASE.map((_, i) => {
        const d = r(f, T.drop + i * 4, T.drop + 22 + i * 4, IN);
        const life = 1 - d;
        const h = lerp(alive(i, T.s2Text + (f - T.s2Text) * life), 0, d) * BAR.max * life + 6 * d;
        const w = lerp(BAR.w, BAR.step + 2, flat);
        const x = barX(i) + BAR.w / 2 - w / 2;
        return (
          <g key={i} opacity={on * (1 - flat)}>
            <rect x={x} y={BAR.base - h} width={w} height={h} rx={Math.min(w, h) / 2} fill={GHOST} />
            <rect x={x} y={BAR.base - h} width={w} height={h} rx={Math.min(w, h) / 2} fill="url(#bar)" opacity={life} />
          </g>
        );
      })}
      <rect x={BAR.x0} y={BAR.base - 4} width={(barX(8) + BAR.w - BAR.x0) * flat} height={4} fill="rgba(38,23,13,0.35)" opacity={f < T.toTherm ? 1 : 0} />
      {LABELS.map((l) => (
        <text key={l.text} x={barX(l.i) + BAR.w / 2} y={BAR.base + 64} textAnchor="middle" fontFamily="MasRegular" fontSize={40} fill={INK} opacity={labels * lerp(1, 0.4, r(f, T.drop, T.drop + 40, Easing.linear))}>
          {l.text}
        </text>
      ))}
    </g>
  );
};

// --- 3. the flat line stands up into a thermometer --------------------------------

const Thermo: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f < T.toTherm || f > T.toDrop + 34) return null;
  const a = r(f, T.toTherm, T.toTherm + 14, INOUT);
  const b = r(f, T.toTherm + 10, T.toTherm + 28, OUT);
  const shrink = r(f, T.toDrop, T.toDrop + 14, IN);
  const cx = lerp(540, THERMO.x, a);
  const w = lerp(barX(8) + BAR.w - BAR.x0, THERMO.w, a);
  const bottom = lerp(BAR.base, THERMO.bottom, a);
  const h = lerp(4, THERMO.bottom - THERMO.top, b) * (1 - shrink);
  const stroke = interpolate(a, [0, 1], [0, 4], cl);
  const level = 30 * spring({frame: f - T.fill, fps, config: {damping: 13, stiffness: 46}});
  const fillTop = Math.min(tempY(level), THERMO.bulbY);
  const ui = r(f, T.fill - 6, T.fill + 10) * (1 - r(f, T.toDrop, T.toDrop + 10, IN));
  const limit = r(f, T.fill + 30, T.fill + 44, INOUT);
  return (
    <g>
      <rect x={cx - w / 2} y={bottom - h} width={w} height={Math.max(h, 4)} rx={Math.min(w, Math.max(h, 4)) / 2} fill={a < 0.05 ? 'rgba(38,23,13,0.35)' : COLORS.cream} stroke={INK} strokeWidth={stroke} />
      {/* oil column; the bulb itself is drawn by Bulb so it can travel on */}
      {h > 20 ? <rect x={cx - w / 2 + 10} y={Math.max(fillTop, bottom - h + 10)} width={w - 20} height={Math.max(0, THERMO.bulbY - Math.max(fillTop, bottom - h + 10))} rx={(w - 20) / 2} fill={AMBER} /> : null}
      <g opacity={ui}>
        {[10, 20, 30, 40, 50].map((c, i) => {
          const o = r(f, T.fill - 4 + i * 3, T.fill + 8 + i * 3);
          return (
            <g key={c} opacity={o}>
              <line x1={THERMO.x - 50} y1={tempY(c)} x2={THERMO.x - 34} y2={tempY(c)} stroke={INK} strokeWidth={3} />
              <text x={THERMO.x - 62} y={tempY(c) + 11} textAnchor="end" fontFamily="MasRegular" fontSize={32} fill={COLORS.inkSoft} style={NUM}>
                {c}
              </text>
            </g>
          );
        })}
        {/* the limit: a red mark at 30 that reaches across to the number */}
        <line x1={THERMO.x - 40} y1={tempY(30)} x2={lerp(THERMO.x - 40, 600, limit)} y2={tempY(30)} stroke={RED} strokeWidth={4} strokeLinecap="round" />
        <text x={620} y={tempY(30) - 150} fontFamily="MasRegular" fontSize={52} fill={COLORS.inkSoft}>
          не выше
        </text>
        <text x={612} y={tempY(30) + 64} fontFamily="MasMedium" fontSize={220} letterSpacing="-0.03em" fill={RED} style={NUM}>
          {Math.round(Math.min(level, 30))}
          <tspan fontSize={110} dx={10}>
            °C
          </tspan>
        </text>
      </g>
    </g>
  );
};

// Thermometer bulb that becomes the big drop of scene 4.
const Bulb: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f < T.toTherm + 8 || f > T.unroll + 16) return null;
  const grow = spring({frame: f - T.toTherm - 14, fps, config: {damping: 12, stiffness: 150}});
  const m = r(f, T.toDrop + 6, T.toDrop + 30, INOUT);
  const cx = lerp(THERMO.x, DROP.x, m);
  const cy = lerp(THERMO.bulbY, DROP.y, m);
  const rad = lerp(THERMO.bulbR * grow, DROP.r, m);
  const tip = r(f, T.toDrop + 14, T.toDrop + 34, OUT);
  const clear = r(f, T.toDrop + 26, T.toDrop + 42, Easing.linear);
  const gone = r(f, T.unroll, T.unroll + 14, IN);
  const d = dropPath(cx, cy, rad * (1 - gone * 0.1), tip);
  return (
    <g opacity={1 - gone}>
      <path d={d} fill={interpolateColors(clear, [0, 1], [AMBER, '#FBF4E6'])} stroke={INK} strokeWidth={4} />
      {m < 0.02 ? <circle cx={cx} cy={cy} r={Math.max(0, rad - 8)} fill={AMBER} /> : null}
    </g>
  );
};

// --- 4. ring chart inside the drop, then it unrolls into the norm scale ------------

const ringPts = (u: number, from: number, to: number, n = 90) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = from + ((to - from) * i) / n;
    const a = TAU * (s - 1 / 3);
    const cx = DROP.x + RING.r * Math.sin(a);
    const cy = DROP.y - RING.r * Math.cos(a);
    const lx = SCALE.x0 + (SCALE.x1 - SCALE.x0) * s;
    pts.push(`${lerp(cx, lx, u).toFixed(1)},${lerp(cy, SCALE.y, u).toFixed(1)}`);
  }
  return pts.join(' ');
};

const Ring: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f < T.ring - 6 || f > T.toPetals) return null;
  const track = r(f, T.ring - 6, T.ring + 6, Easing.linear);
  const arc = r(f, T.ring, T.ring + 40, INOUT);
  const u = r(f, T.unroll + 2, T.unroll + 26, INOUT);
  const drain = r(f, T.unroll + 6, T.unroll + 26, INOUT);
  const breathe = 1 + 0.06 * Math.sin((f - T.ring - 40) / 4.5) * r(f, T.ring + 40, T.ring + 56) * (1 - u);
  const width = lerp(RING.w * breathe, SCALE.w, u);
  // vitamin E scale fill after the unroll
  const c = r(f, T.count, T.count + 46, Easing.bezier(0.33, 0, 0.2, 1));
  const frac = f < T.s5Text ? (2 / 3) * arc * (1 - drain) : (SPOON_MG / NORM) * c;
  const hideForPetals = f >= T.toPetals - 1;
  const labels = r(f, T.ring + 36, T.ring + 50) * (1 - r(f, T.unroll, T.unroll + 6, Easing.linear));
  const center = 1 - r(f, T.unroll, T.unroll + 8, IN);
  const two = spring({frame: f - T.ring - 18, fps, config: {damping: 12, stiffness: 150}});
  const three = spring({frame: f - T.ring - 22, fps, config: {damping: 12, stiffness: 150}});
  const bar = r(f, T.ring + 26, T.ring + 38, INOUT);
  if (hideForPetals) return null;
  return (
    <g>
      <defs>
        <path id="ringTop" d={`M ${DROP.x - RING.r * 0.866} ${DROP.y + RING.r / 2} A ${RING.r} ${RING.r} 0 1 1 ${DROP.x + RING.r * 0.866} ${DROP.y + RING.r / 2}`} />
        <path id="ringBottom" d={`M ${DROP.x - RING.r * 0.866} ${DROP.y + RING.r / 2} A ${RING.r} ${RING.r} 0 0 0 ${DROP.x + RING.r * 0.866} ${DROP.y + RING.r / 2}`} />
      </defs>
      <polyline points={ringPts(u, 0, 1)} fill="none" stroke={GHOST} strokeWidth={width} strokeLinecap={u > 0.02 ? 'round' : 'butt'} strokeLinejoin="round" opacity={track} />
      {frac > 0.002 ? <polyline points={ringPts(u, 0, frac, Math.max(4, Math.round(90 * frac)))} fill="none" stroke="url(#ringGrad)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" /> : null}
      <g opacity={labels}>
        <text fontFamily="MasMedium" fontSize={38} fill={COLORS.cream} letterSpacing="0.02em">
          <textPath href="#ringTop" startOffset="50%" textAnchor="middle" dominantBaseline="central">
            омега-6
          </textPath>
        </text>
        <text fontFamily="MasRegular" fontSize={30} fill={COLORS.inkSoft}>
          <textPath href="#ringBottom" startOffset="50%" textAnchor="middle" dominantBaseline="central">
            другие жиры
          </textPath>
        </text>
      </g>
      <g opacity={center} fontFamily="MasMedium" fill={RED} textAnchor="middle" style={NUM}>
        <text x={DROP.x} y={lerp(DROP.y - 90, DROP.y - 22, two)} fontSize={120} opacity={two}>
          2
        </text>
        <rect x={DROP.x - 46 * bar} y={DROP.y - 4} width={92 * bar} height={8} rx={4} />
        <text x={DROP.x} y={lerp(DROP.y + 200, DROP.y + 112, three)} fontSize={120} opacity={three}>
          3
        </text>
      </g>
    </g>
  );
};

// Bubbles drifting up inside the drop.
const Bubbles: React.FC<{f: number}> = ({f}) => {
  const on = r(f, T.ring, T.ring + 20) * (1 - r(f, T.unroll, T.unroll + 8, Easing.linear));
  if (on <= 0) return null;
  return (
    <g opacity={on} clipPath="url(#dropClip)">
      {Array.from({length: 12}, (_, i) => {
        const sp = 2.2 + (i % 4) * 0.7;
        const y = DROP.y + 280 - ((f * sp + i * 97) % 560);
        const x = DROP.x - 230 + ((i * 131) % 460) + Math.sin(f / 9 + i) * 8;
        return <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 4} fill={AMBER} opacity={0.28} />;
      })}
    </g>
  );
};

// --- 5. vitamin E: spoon, counter, the norm scale ------------------------------------

const VitaminScale: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f < T.s5Text - 4 || f > T.toPetals + 16) return null;
  const leave = r(f, T.toPetals, T.toPetals + 12, IN);
  const marks = r(f, T.s5Text + 2, T.s5Text + 18);
  const spoon = r(f, T.s5Text, T.s5Text + 22);
  const oil = spring({frame: f - T.s5Text - 16, fps, config: {damping: 12, stiffness: 120}});
  const c = r(f, T.count, T.count + 46, Easing.bezier(0.33, 0, 0.2, 1));
  const num = r(f, T.s5Text + 18, T.s5Text + 32);
  const pct = r(f, T.count + 36, T.count + 50);
  const shine = r(f, T.count + 20, T.count + 50, Easing.linear);
  return (
    <g opacity={1 - leave} transform={`translate(0 ${-60 * leave})`}>
      {/* spoon from above, slides in from the left */}
      <g transform={`translate(${lerp(-420, 0, spoon)} 0) rotate(-8 480 700)`}>
        <rect x={590} y={686} width={330} height={30} rx={15} fill={COLORS.cream} stroke={INK} strokeWidth={4} />
        <ellipse cx={460} cy={700} rx={150} ry={96} fill={COLORS.cream} stroke={INK} strokeWidth={4} />
        <ellipse cx={460} cy={704} rx={126 * oil} ry={76 * oil} fill="url(#oilRad)" />
        <ellipse cx={420} cy={676} rx={38 * oil} ry={12 * oil} fill="#fff" opacity={0.45} />
        <rect x={360 + shine * 160} y={660} width={14} height={90} rx={7} fill="#fff" opacity={0.25 * Math.sin(Math.PI * shine)} transform="rotate(20 460 700)" />
      </g>
      <text x={540} y={1110} textAnchor="middle" fontFamily="MasMedium" fontSize={210} letterSpacing="-0.03em" fill={RED} opacity={num} style={NUM}>
        {(SPOON_MG * c).toFixed(1).replace('.', ',')}
        <tspan fontSize={96} dx={14}>
          мг
        </tspan>
      </text>
      {/* notches split the track into 15 mg */}
      {Array.from({length: NORM - 1}, (_, k) => {
        const x = SCALE.x0 + ((SCALE.x1 - SCALE.x0) * (k + 1)) / NORM;
        return <rect key={k} x={x - 2} y={SCALE.y - SCALE.w / 2 - 1} width={4} height={(SCALE.w + 2) * r(f, T.s5Text + 4 + k, T.s5Text + 14 + k)} fill={COLORS.cream} />;
      })}
      <g opacity={marks} fontFamily="MasRegular" fontSize={34} fill={COLORS.inkSoft}>
        <text x={SCALE.x0} y={SCALE.y - 40}>
          0
        </text>
        <text x={SCALE.x1} y={SCALE.y - 40} textAnchor="end">
          15 мг
        </text>
      </g>
      <text x={540} y={SCALE.y + 120} textAnchor="middle" fontFamily="MasMedium" fontSize={64} fill={INK} opacity={pct} style={NUM}>
        <tspan fill={RED}>{Math.round(37 * pct)}%</tspan> дневной нормы
      </text>
    </g>
  );
};

// --- 7. the scale breaks into petals; price and order -----------------------------

const PETALS = 24;
const Finale: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  if (f < T.toPetals - 1) return null;
  const spin = 6 * r(f, T.toPetals + 30, SUN_INFO_FRAMES, Easing.linear);
  const back = spring({frame: f - T.toPetals - 18, fps, config: {damping: 13, stiffness: 110}});
  const core = spring({frame: f - T.toPetals - 16, fps, config: {damping: 13, stiffness: 140}});
  const reveal = r(f, T.toPetals + 26, T.toPetals + 46, INOUT);
  const filled = SPOON_MG / NORM;
  return (
    <g>
      {Array.from({length: PETALS}, (_, k) => {
        const g = spring({frame: f - T.toPetals - 22 - k * 0.5, fps, config: {damping: 13, stiffness: 110}});
        const ang = (k + 0.5) * (360 / PETALS) + spin;
        return (
          <g key={`b${k}`} transform={`translate(${END.x} ${END.y}) rotate(${ang}) translate(0 ${-END.R + 22}) scale(${back * g})`}>
            <ellipse cx={0} cy={0} rx={30} ry={82} fill={AMBER} />
          </g>
        );
      })}
      {Array.from({length: PETALS}, (_, k) => {
        const p = r(f, T.toPetals + k * 0.6, T.toPetals + 24 + k * 0.6, INOUT);
        const s = (k + 0.5) / PETALS;
        const x0 = SCALE.x0 + (SCALE.x1 - SCALE.x0) * s;
        const theta = k * (360 / PETALS) + spin;
        const tr = (theta * Math.PI) / 180;
        const x1 = END.x + Math.sin(tr) * END.R;
        const y1 = END.y - Math.cos(tr) * END.R;
        const x = lerp(x0, x1, p);
        const y = lerp(SCALE.y, y1, p) - Math.sin(Math.PI * p) * 120;
        const rot = lerp(90, theta > 180 ? theta - 360 : theta, p);
        const from = s < filled ? AMBER : 'rgba(38,23,13,0.12)';
        return (
          <ellipse
            key={k}
            cx={0}
            cy={0}
            rx={lerp(SCALE.w / 2, 34, p)}
            ry={lerp((SCALE.x1 - SCALE.x0) / PETALS / 2, 96, p)}
            fill={interpolateColors(p, [0, 0.6, 1], [from, GOLD, GOLD])}
            transform={`translate(${x} ${y}) rotate(${rot})`}
          />
        );
      })}
      <circle cx={END.x} cy={END.y} r={160 * core} fill={COLORS.creamDeep} />
      {SEEDS.slice(50, 118).map((s) => {
        const ap = spring({frame: f - T.toPetals - 20 - s.k * 0.12, fps, config: {damping: 11, stiffness: 170}});
        const a = s.a + (spin * Math.PI) / 180;
        const rad = 14.6 * Math.sqrt(s.k + 0.6);
        return <ellipse key={s.k} cx={0} cy={0} rx={s.size * 0.85} ry={s.size * 1.3} fill={s.k % 4 === 0 ? AMBER : INK} transform={`translate(${END.x + Math.cos(a) * rad} ${END.y + Math.sin(a) * rad}) rotate(${(a * 180) / Math.PI + 90}) scale(${ap})`} />;
      })}
      {/* the bottle shows through the heart of the flower */}
      <circle cx={END.x} cy={END.y} r={100 * reveal} fill="#FBF4E6" />
      <g clipPath="url(#coreClip)">
        <image href={staticFile('cut/studio/sun.png')} x={END.x - 26} y={END.y - 102 + (1 - reveal) * 40} width={52} height={204} opacity={reveal} />
      </g>
      <clipPath id="coreClip">
        <circle cx={END.x} cy={END.y} r={100 * reveal} />
      </clipPath>
    </g>
  );
};

const Price: React.FC<{f: number}> = ({f}) => {
  if (f < T.price) return null;
  const c = r(f, T.price, T.price + 34, Easing.bezier(0.1, 0.9, 0.2, 1));
  const o = r(f, T.price, T.price + 10);
  const unit = r(f, T.price + 22, T.price + 34);
  const line = r(f, T.cta + 14, T.cta + 38, INOUT);
  const drip = r(f, T.cta + 36, T.cta + 52, IN);
  const x1 = lerp(290, 790, line);
  return (
    <g>
      <text x={540} y={1250} textAnchor="middle" fontFamily="MasMedium" fontSize={200} letterSpacing="-0.03em" fill={RED} opacity={o} style={NUM}>
        {Math.round(600 * c)}
        <tspan fontSize={110} dx={16} opacity={unit}>
          руб.
        </tspan>
      </text>
      {/* oil underline under the address, ending in a drop */}
      {line > 0 ? (
        <>
          <line x1={290} y1={1508} x2={x1} y2={1508} stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
          <path d={dropPath(x1, 1508 + 4 + drip * 30, 9 + 3 * drip, 1)} fill={AMBER} opacity={1 - drip * 0.3} />
        </>
      ) : null}
    </g>
  );
};

// Warm glow behind the graphics, travelling with them.
const Glow: React.FC<{f: number}> = ({f}) => {
  const ks = [0, T.toBars + 20, T.toTherm + 20, T.toDrop + 30, T.unroll + 26, T.toPetals + 26];
  const x = interpolate(f, ks, [540, 540, 380, 540, 540, 540], cl);
  const y = interpolate(f, ks, [1060, 1200, 1100, 1150, 1100, 760], cl);
  return <circle cx={x} cy={y} r={620} fill="url(#glow)" />;
};

const Graphics: React.FC = () => {
  const f = useCurrentFrame();
  const push = 1 + 0.025 * (f / SUN_INFO_FRAMES);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={AMBER} />
          <stop offset="0.55" stopColor={GOLD} />
        </linearGradient>
        <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GOLD} />
          <stop offset="1" stopColor={AMBER} />
        </linearGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GOLD} />
          <stop offset="1" stopColor={AMBER} />
        </linearGradient>
        <radialGradient id="oilRad" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={GOLD} />
          <stop offset="1" stopColor={AMBER} />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor={GOLD} stopOpacity={0.22} />
          <stop offset="1" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
        <clipPath id="dropClip">
          <path d={dropPath(DROP.x, DROP.y, DROP.r - 6, 1)} />
        </clipPath>
      </defs>
      <Glow f={f} />
      <g transform={`translate(540 1000) scale(${push}) translate(-540 -1000)`}>
        <Flower f={f} />
        <Equalizer f={f} />
        <Thermo f={f} />
        <Bulb f={f} />
        <Bubbles f={f} />
        <Ring f={f} />
        <VitaminScale f={f} />
        <Finale f={f} />
        <Price f={f} />
        <Slider f={f} />
      </g>
    </svg>
  );
};

const say = (lines: string[], at: number, out?: number, sub?: {lines: string[]; at: number}): {lines: TextLine[]; out?: number} => ({
  lines: [...phrase(lines, at), ...(sub ? sub.lines.map((text, i) => ({text, at: sub.at + i * 6, role: 'sub' as const, color: COLORS.inkSoft, sound: false, stagger: 2})) : [])],
  out,
});

const TEXTS = [
  say(['Вкус и запах семян', 'подсолнечника', 'на полной громкости'], 16, T.toBars + 4),
  say(['Масло с полок магазинов', 'часто без вкуса', 'и запаха'], T.s2Text, T.s2Out),
  say(['Масларада отжимает', 'масло без нагрева'], T.s3Text, T.s3Out),
  say(['Две трети жиров', 'это омега-6'], T.s4Text, T.s4Out, {lines: ['организм не может', 'сделать её сам'], at: T.s4Text + 44}),
  say(['В одной ложке', 'витамина E'], T.s5Text, T.s5Out),
];

const Sounds: React.FC = () => (
  <>
    <Sfx name="seeds" at={0} gain={0.55} />
    <Sfx name="swish" at={12} gain={0.5} />
    <Sfx name="rise" at={22} />
    <Sfx name="swish" at={T.toBars + 2} gain={0.6} />
    <Sfx name="fall" at={T.drop} />
    <Sfx name="rise" at={T.toTherm} />
    <Sfx name="clink" at={T.fill + 26} gain={0.8} />
    <Sfx name="plop" at={T.toDrop + 26} />
    <Sfx name="pour" at={T.ring - 4} gain={0.45} />
    <Sfx name="tick" at={T.ring + 38} />
    <Sfx name="swish" at={T.unroll + 2} gain={0.55} />
    {[6, 13, 20, 27, 34].map((d) => (
      <Sfx key={d} name="tick" at={T.count + d} />
    ))}
    <Sfx name="clink" at={T.count + 44} gain={0.8} />
    <Sfx name="swish" at={T.toPetals + 2} gain={0.6} />
    <Sfx name="seeds" at={T.toPetals + 18} gain={0.4} />
    <Sfx name="clink" at={T.price + 24} />
    <Sfx name="chord" at={T.cta + 10} gain={0.8} />
  </>
);

export const SunInfo: React.FC = () => (
  <MixGain.Provider value={1.25}>
    <Stage>
      <Graphics />
      {TEXTS.map((t, i) => (
        <KineticText key={i} top={290} lines={t.lines} out={t.out} />
      ))}
      <KineticText
        top={1300}
        lines={[
          {text: 'Заказывайте на', at: T.cta, role: 'sub', color: COLORS.inkSoft},
          {text: 'maslarada.ru', at: T.cta + 6, role: 'title', sound: false},
        ]}
      />
      <Sounds />
    </Stage>
  </MixGain.Provider>
);
