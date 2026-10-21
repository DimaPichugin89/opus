// Chapter title: a large outlined number fills with oil from the bottom, the title rises under it.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {KineticText} from './KineticText';
import {StudioBg} from './StudioBg';
import {Sfx} from '../sfx';
import {COLORS, W} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ChapterCard: React.FC<{n: number; title: string[]; total?: number}> = ({n, title, total = 5}) => {
  const f = useCurrentFrame();
  const fill = interpolate(f, [8, 34], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const rise = interpolate(f, [0, 14], [60, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const label = String(n).padStart(2, '0');
  const top = 520;
  const size = 330;
  const wave = 10 * Math.sin(f / 4);
  const level = top + size * 0.98 - fill * size * 0.78;
  return (
    <AbsoluteFill>
      <StudioBg />
      <svg width={W} height={1100} style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${rise}px)`, opacity: interpolate(f, [0, 8], [0, 1], clamp)}}>
        <defs>
          <linearGradient id={`ch-oil-${n}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COLORS.amberLight} />
            <stop offset="1" stopColor={COLORS.amber} />
          </linearGradient>
          <clipPath id={`ch-level-${n}`}>
            <path d={`M 0 ${level} Q ${W / 4} ${level - wave} ${W / 2} ${level} T ${W} ${level} L ${W} 1100 L 0 1100 Z`} />
          </clipPath>
        </defs>
        <text x={W / 2} y={top + size * 0.8} textAnchor="middle" fontFamily="MasMedium" fontSize={size} letterSpacing="-12" fill="none" stroke={COLORS.amber} strokeWidth={4}>
          {label}
        </text>
        <text x={W / 2} y={top + size * 0.8} textAnchor="middle" fontFamily="MasMedium" fontSize={size} letterSpacing="-12" fill={`url(#ch-oil-${n})`} clipPath={`url(#ch-level-${n})`}>
          {label}
        </text>
      </svg>
      <KineticText top={960} lines={title.map((t, i) => ({text: t, at: 12 + i * 5, role: 'title', sound: i === 0}))} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, display: 'flex', justifyContent: 'center', gap: 22}}>
        {new Array(total).fill(0).map((_, i) => (
          <div key={i} style={{width: i + 1 === n ? 46 : 14, height: 14, borderRadius: 7, background: i + 1 <= n ? COLORS.amber : 'rgba(38,23,13,0.18)'}} />
        ))}
      </div>
      <Sfx name="pour" at={8} gain={0.5} />
    </AbsoluteFill>
  );
};
