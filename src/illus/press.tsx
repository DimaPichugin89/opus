// Story 1 illustrations: a cut-away press (seeds, piston, oil dripping into a jar, thermometer)
// and a jar filling from a stream of oil. The press is a diagram, not the real machine.
import React from 'react';
import {random} from 'remotion';
import {Art, Drop, INK, LINE, ramp, Seed, Thermometer, useT, wavePath} from './kit';
import {Sfx} from '../sfx';
import {COLORS} from '../theme';

const CH = {x0: 205, x1: 495, top: 250, bottom: 750}; // chamber interior
const BED_TOP = 380;
const JAR = {x: 230, y: 840, w: 240, h: 150};

const bedSeeds = new Array(46).fill(0).map((_, i) => ({
  x: CH.x0 + 22 + random(`bed-x${i}`) * (CH.x1 - CH.x0 - 44),
  y: BED_TOP + 20 + random(`bed-y${i}`) * (CH.bottom - BED_TOP - 40),
  rot: random(`bed-r${i}`) * 360,
  delay: random(`bed-d${i}`) * 26,
}));

export const PressCutaway: React.FC<{cx: number; cy: number; at?: number; scale?: number}> = ({cx, cy, at = 0, scale = 1}) => {
  const t = useT(at);
  const pistonBottom = ramp(t, 26, 140, 300, 610);
  const bedH = CH.bottom - Math.max(BED_TOP, pistonBottom);
  const squash = bedH / (CH.bottom - BED_TOP);
  const pressed = 1 - squash;
  const drops = [64, 80, 94, 108, 120, 132, 144, 156, 168];
  const fill = ramp(t, 70, 178, 0.05, 0.62);
  const surface = JAR.y + JAR.h - 8 - fill * (JAR.h - 30);
  const temp = ramp(t, 6, 60, 16, 26);
  return (
    <>
      <Art cx={cx} cy={cy} w={860} h={1000} scale={scale}>
        <defs>
          <clipPath id="chamber">
            <rect x={CH.x0} y={CH.top} width={CH.x1 - CH.x0} height={CH.bottom - CH.top} rx={18} />
          </clipPath>
          <clipPath id="jar-in">
            <rect x={JAR.x + 8} y={JAR.y} width={JAR.w - 16} height={JAR.h - 8} rx={26} />
          </clipPath>
        </defs>

        {/* cylinder body and its cut-away chamber */}
        <rect x={170} y={230} width={360} height={540} rx={36} fill="url(#k-steel)" />
        <rect x={CH.x0} y={CH.top} width={CH.x1 - CH.x0} height={CH.bottom - CH.top} rx={18} fill={COLORS.creamDeep} />
        <g clipPath="url(#chamber)">
          {/* oil collecting at the bottom of the chamber as the seeds give it up */}
          <path d={wavePath(CH.x0, CH.x1 - CH.x0, CH.bottom - 10 - 40 * pressed, CH.bottom, t, 5)} fill="url(#k-oil)" opacity={0.95} />
          <g transform={`translate(0 ${CH.bottom}) scale(1 ${squash}) translate(0 ${-CH.bottom})`}>
            {bedSeeds.map((s, i) => {
              const fall = ramp(t, s.delay, s.delay + 14, -420, 0, (x) => x * x);
              return <Seed key={i} x={s.x} y={s.y + fall} len={58} rot={s.rot} />;
            })}
          </g>
          {/* piston and rod */}
          <rect x={320} y={-400} width={60} height={pistonBottom - 56 + 400} fill="url(#k-steel)" />
          <rect x={CH.x0 + 6} y={pistonBottom - 56} width={CH.x1 - CH.x0 - 12} height={56} rx={14} fill="url(#k-steel)" />
          <rect x={CH.x0 + 18} y={pistonBottom - 8} width={CH.x1 - CH.x0 - 36} height={5} rx={2.5} fill="#fff" opacity={0.7} />
        </g>
        <rect x={320} y={0} width={60} height={230} fill="url(#k-steel)" opacity={pistonBottom > 0 ? 1 : 0} />

        {/* outlet and drops into the jar */}
        <path d="M 330 768 L 370 768 L 364 800 Q 350 810 336 800 Z" fill={COLORS.steelDeep} />
        {drops.map((d, k) => {
          const q = ramp(t, d, d + 10, 0, 1, (x) => x * x);
          return q > 0 && q < 1 ? <Drop key={k} x={350} y={806 + (surface - 806) * q} r={10} stretch={1 + 0.3 * q} /> : null;
        })}
        <g clipPath="url(#jar-in)">
          <path d={wavePath(JAR.x, JAR.w, surface, JAR.y + JAR.h, t, 4)} fill="url(#k-oil)" />
        </g>
        <path d={`M ${JAR.x} ${JAR.y} L ${JAR.x} ${JAR.y + JAR.h - 30} Q ${JAR.x} ${JAR.y + JAR.h} ${JAR.x + 30} ${JAR.y + JAR.h} L ${JAR.x + JAR.w - 30} ${JAR.y + JAR.h} Q ${JAR.x + JAR.w} ${JAR.y + JAR.h} ${JAR.x + JAR.w} ${JAR.y + JAR.h - 30} L ${JAR.x + JAR.w} ${JAR.y}`} fill="none" stroke={INK} strokeWidth={LINE} strokeLinecap="round" />

        {/* temperature stays under 30 °C */}
        <Thermometer x={690} y={300} h={380} value={temp} max={40} marks={[30]} />
      </Art>
      <Sfx name="press" at={at + 30} />
      <Sfx name="plop" at={at + drops[0] + 10} gain={0.6} />
      <Sfx name="plop" at={at + drops[2] + 10} gain={0.45} />
    </>
  );
};

// A big glass jar filling from a thin stream of oil, with a few seeds around it.
export const OilJar: React.FC<{cx: number; cy: number; at?: number; scale?: number}> = ({cx, cy, at = 0, scale = 1}) => {
  const t = useT(at);
  const J = {x: 150, y: 220, w: 400, h: 560};
  const fill = ramp(t, 6, 170, 0.08, 0.78, (x) => 1 - (1 - x) * (1 - x));
  const surface = J.y + J.h - 10 - fill * (J.h - 60);
  const streamOn = t >= 0 && t < 172;
  const wob = (y: number) => 6 * Math.sin(y / 40 + t / 3);
  const streamPts = new Array(24).fill(0).map((_, i) => {
    const y = 40 + (i / 23) * (surface - 40);
    return [350 + wob(y), y] as const;
  });
  return (
    <>
      <Art cx={cx} cy={cy} w={700} h={900} scale={scale}>
        <defs>
          <clipPath id="big-jar">
            <rect x={J.x + 10} y={J.y + 20} width={J.w - 20} height={J.h - 30} rx={56} />
          </clipPath>
        </defs>
        {streamOn ? (
          <g>
            <path d={`M ${streamPts.map(([x, y]) => `${x} ${y}`).join(' L ')}`} stroke={COLORS.amberLight} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={`M ${streamPts.map(([x, y]) => `${x - 4} ${y}`).join(' L ')}`} stroke="#FFF3D6" strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" fill="none" />
            <ellipse cx={350} cy={surface} rx={34} ry={10} fill={COLORS.amberLight} />
          </g>
        ) : null}
        <g clipPath="url(#big-jar)">
          <path d={wavePath(J.x, J.w, surface, J.y + J.h, t, 9)} fill="url(#k-oil)" />
          {[0, 1, 2, 3, 4].map((k) => {
            const life = (t * 1.3 + k * 37) % 120;
            return <circle key={k} cx={J.x + 70 + k * 62} cy={J.y + J.h - 20 - life * 3} r={5 + (k % 3)} fill="#FFF3D6" opacity={life * 3 < J.h - 60 && J.y + J.h - 20 - life * 3 > surface ? 0.5 : 0} />;
          })}
        </g>
        <rect x={J.x} y={J.y} width={J.w} height={J.h} rx={66} fill="url(#k-glass)" opacity={0.6} />
        <path d={`M ${J.x} ${J.y + 20} L ${J.x} ${J.y + J.h - 66} Q ${J.x} ${J.y + J.h} ${J.x + 66} ${J.y + J.h} L ${J.x + J.w - 66} ${J.y + J.h} Q ${J.x + J.w} ${J.y + J.h} ${J.x + J.w} ${J.y + J.h - 66} L ${J.x + J.w} ${J.y + 20}`} fill="none" stroke={INK} strokeWidth={LINE} strokeLinecap="round" />
        <rect x={J.x - 16} y={J.y} width={J.w + 32} height={24} rx={12} fill="none" stroke={INK} strokeWidth={LINE} />
        <rect x={J.x + 34} y={J.y + 70} width={18} height={J.h - 160} rx={9} fill="#fff" opacity={0.45} />
        {[[90, 830, 30], [140, 860, -40], [600, 840, 70], [560, 870, 10], [640, 875, -20]].map(([x, y, r], k) => (
          <Seed key={k} x={x} y={y} len={60} rot={r} />
        ))}
      </Art>
      <Sfx name="pour" at={at + 2} gain={0.8} />
    </>
  );
};
