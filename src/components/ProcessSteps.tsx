// How it is made, without showing the machine: three round steps in a row.
// Seeds hop into the press, the plates squeeze a seed, oil drips across into a filling circle.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from './KineticText';
import {DropShape} from './OilDrop';
import {SeedShape} from './Seeds';
import {Sfx} from '../sfx';
import {COLORS, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const D = 290;
const COL = W / 3;
const cx = (i: number) => COL * i + COL / 2;

const Badge: React.FC<{i: number; cy: number; at: number; children: React.ReactNode}> = ({i, cy, at, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - at, fps, config: {damping: 13, stiffness: 150, mass: 0.7}});
  return (
    <div
      style={{
        position: 'absolute',
        left: cx(i) - D / 2,
        top: cy - D / 2,
        width: D,
        height: D,
        borderRadius: '50%',
        overflow: 'hidden',
        background: COLORS.creamDeep,
        transform: `scale(${pop})`,
      }}
    >
      {children}
    </div>
  );
};

const SeedsIcon: React.FC = () => {
  const f = useCurrentFrame();
  const spots: [number, number, number][] = [[95, 120, -30], [150, 105, 15], [195, 140, 60], [120, 175, 100], [175, 190, -60]];
  return (
    <>
      {spots.map(([x, y, r], k) => (
        <div key={k} style={{position: 'absolute', left: x, top: y + Math.sin(f / 9 + k) * 4, transform: `translate(-50%, -50%) rotate(${r}deg)`}}>
          <SeedShape kind="sunflower" size={86} />
        </div>
      ))}
    </>
  );
};

const PressIcon: React.FC<{at: number}> = ({at}) => {
  const f = Math.max(0, useCurrentFrame() - at);
  const squeeze = 0.5 - 0.5 * Math.cos((f / 22) * Math.PI * 2); // 0 open .. 1 closed
  const gap = 96 - 54 * squeeze;
  const mid = D / 2;
  const plate = (y: number) => (
    <div style={{position: 'absolute', left: 40, top: y, width: D - 80, height: 44, borderRadius: 18, background: `linear-gradient(${COLORS.steelLight}, ${COLORS.steel} 70%, ${COLORS.steelDeep})`}} />
  );
  return (
    <>
      {plate(mid - gap / 2 - 44)}
      {plate(mid + gap / 2)}
      <div style={{position: 'absolute', left: mid, top: mid, transform: `translate(-50%, -50%) scale(${1 + 0.3 * squeeze}, ${gap / 96})`}}>
        <div style={{transform: 'rotate(90deg)'}}>
          <SeedShape kind="sunflower" size={120} />
        </div>
      </div>
      {[-1, 1].map((s) => (
        <div key={s} style={{position: 'absolute', left: mid + s * (70 + 16 * squeeze) - 14, top: mid - 14, width: 28, height: 28, borderRadius: '50%', background: COLORS.amberLight, transform: `scale(${squeeze})`}} />
      ))}
    </>
  );
};

const OilIcon: React.FC<{at: number; fillFrom: number}> = ({fillFrom}) => {
  const f = useCurrentFrame();
  const level = interpolate(f, [fillFrom, fillFrom + 40], [0.12, 0.7], {...clamp, easing: Easing.out(Easing.quad)});
  const y = D * (1 - level);
  const wave = `M 0 ${y} Q ${D * 0.25} ${y - 10 * Math.sin(f / 5)} ${D * 0.5} ${y} T ${D} ${y} L ${D} ${D} L 0 ${D} Z`;
  return (
    <svg width={D} height={D} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="oil-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.amberLight} />
          <stop offset="1" stopColor={COLORS.amber} />
        </linearGradient>
      </defs>
      <path d={wave} fill="url(#oil-fill)" />
      <ellipse cx={D * 0.32} cy={y + 40} rx={18} ry={10} fill="#FFF3D6" opacity={0.5} />
    </svg>
  );
};

// Something hopping from one badge to the next along a soft arc.
const Hop: React.FC<{from: number; to: number; cy: number; start: number; every: number; count: number; children: React.ReactNode}> = ({from, to, cy, start, every, count, children}) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, k) => {
        const t0 = start + k * every;
        const q = interpolate(f, [t0, t0 + 14], [0, 1], clamp);
        if (q <= 0 || q >= 1) return null;
        const x = cx(from) + D * 0.32 + (cx(to) - cx(from) - D * 0.64) * q;
        const y = cy - 40 - Math.sin(q * Math.PI) * 120;
        return (
          <div key={k} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${q * 200}deg)`, zIndex: 5}}>
            {children}
          </div>
        );
      })}
    </>
  );
};

export const ProcessSteps: React.FC<{cy: number; at: number; labels: string[][]}> = ({cy, at, labels}) => {
  const steps = [at, at + 10, at + 20];
  return (
    <>
      <Badge i={0} cy={cy} at={steps[0]}>
        <SeedsIcon />
      </Badge>
      <Badge i={1} cy={cy} at={steps[1]}>
        <PressIcon at={steps[1]} />
      </Badge>
      <Badge i={2} cy={cy} at={steps[2]}>
        <OilIcon at={steps[2]} fillFrom={steps[2] + 14} />
      </Badge>
      <Hop from={0} to={1} cy={cy} start={steps[1] + 2} every={9} count={6}>
        <SeedShape kind="sunflower" size={46} />
      </Hop>
      <Hop from={1} to={2} cy={cy} start={steps[2] + 2} every={11} count={5}>
        <DropShape size={34} />
      </Hop>
      {labels.map((lines, i) => (
        <KineticText
          key={i}
          top={cy + D / 2 + 30}
          left={cx(i) - COL / 2 + 8}
          width={COL - 16}
          lines={lines.map((text, k) => ({text, at: steps[i] + 4 + k * 4, role: 'note', color: k ? COLORS.inkSoft : COLORS.ink, sound: k === 0}))}
        />
      ))}
      <Sfx name="plop" at={steps[2] + 16} gain={0.7} />
    </>
  );
};
