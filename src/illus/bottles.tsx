// Drawn bottles. IllustratedBottle follows the Maslarada bottle (square amber glass, black cap,
// coloured label with a date field) without any label text; ShelfBottle is a generic store bottle.
import React from 'react';
import {INK, LINE} from './kit';

// (x, y) is the bottom centre; h the full height including the cap.
export const IllustratedBottle: React.FC<{x: number; y: number; h: number; label: string; motif?: string}> = ({x, y, h, label, motif = 'rgba(38,23,13,0.35)'}) => {
  const w = h * 0.3;
  const capH = h * 0.11;
  const neckW = w * 0.5;
  const shoulderY = y - h * 0.6;
  const top = y - h;
  const body = `M ${x - neckW / 2} ${top + capH} L ${x - neckW / 2} ${shoulderY - h * 0.12}
    Q ${x - neckW / 2} ${shoulderY - h * 0.04} ${x - w / 2} ${shoulderY + h * 0.05}
    L ${x - w / 2} ${y - h * 0.03} Q ${x - w / 2} ${y} ${x - w / 2 + h * 0.03} ${y}
    L ${x + w / 2 - h * 0.03} ${y} Q ${x + w / 2} ${y} ${x + w / 2} ${y - h * 0.03}
    L ${x + w / 2} ${shoulderY + h * 0.05} Q ${x + neckW / 2} ${shoulderY - h * 0.04} ${x + neckW / 2} ${shoulderY - h * 0.12}
    L ${x + neckW / 2} ${top + capH} Z`;
  const labelTop = y - h * 0.5;
  const labelBottom = y - h * 0.07;
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx={w * 0.75} ry={h * 0.025} fill="#26170D" opacity={0.18} />
      <path d={body} fill="url(#k-amber-glass)" />
      <rect x={x - w / 2} y={labelTop} width={w} height={labelBottom - labelTop} fill={label} />
      <circle cx={x + w * 0.08} cy={labelTop + (labelBottom - labelTop) * 0.45} r={w * 0.28} fill="none" stroke={motif} strokeWidth={Math.max(2, h * 0.006)} />
      <rect x={x + w * 0.08} y={labelBottom - h * 0.06} width={w * 0.34} height={h * 0.035} fill="#FFFFFF" opacity={0.9} />
      <rect x={x - neckW / 2 + w * 0.08} y={top + capH + h * 0.04} width={w * 0.07} height={h * 0.28} rx={w * 0.035} fill="#FFFFFF" opacity={0.28} />
      <rect x={x - w * 0.38} y={shoulderY + h * 0.08} width={w * 0.08} height={labelTop - shoulderY - h * 0.12} rx={w * 0.04} fill="#FFFFFF" opacity={0.18} />
      <rect x={x - neckW * 0.62} y={top} width={neckW * 1.24} height={capH} rx={h * 0.015} fill="#1E1914" />
      {[0.3, 0.5, 0.7].map((k) => (
        <rect key={k} x={x - neckW * 0.62} y={top + capH * k} width={neckW * 1.24} height={Math.max(2, h * 0.005)} fill="#4A4038" />
      ))}
    </g>
  );
};

// A generic round store bottle of pale refined oil.
export const ShelfBottle: React.FC<{x: number; y: number; h: number}> = ({x, y, h}) => {
  const w = h * 0.34;
  const top = y - h;
  const capH = h * 0.08;
  const neck = w * 0.36;
  const path = `M ${x - neck / 2} ${top + capH} L ${x - neck / 2} ${top + h * 0.16}
    C ${x - w / 2} ${top + h * 0.24} ${x - w / 2} ${top + h * 0.3} ${x - w / 2} ${top + h * 0.36}
    L ${x - w / 2} ${top + h * 0.5} Q ${x - w * 0.42} ${top + h * 0.56} ${x - w / 2} ${top + h * 0.62}
    L ${x - w / 2} ${y - h * 0.04} Q ${x - w / 2} ${y} ${x - w * 0.4} ${y}
    L ${x + w * 0.4} ${y} Q ${x + w / 2} ${y} ${x + w / 2} ${y - h * 0.04}
    L ${x + w / 2} ${top + h * 0.62} Q ${x + w * 0.42} ${top + h * 0.56} ${x + w / 2} ${top + h * 0.5}
    L ${x + w / 2} ${top + h * 0.36} C ${x + w / 2} ${top + h * 0.3} ${x + w / 2} ${top + h * 0.24} ${x + neck / 2} ${top + h * 0.16}
    L ${x + neck / 2} ${top + capH} Z`;
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx={w * 0.7} ry={h * 0.025} fill="#26170D" opacity={0.15} />
      <path d={path} fill="url(#k-pale-oil)" stroke={INK} strokeWidth={LINE * 0.8} strokeLinejoin="round" />
      <rect x={x - w * 0.36} y={top + h * 0.3} width={w * 0.1} height={h * 0.55} rx={w * 0.05} fill="#FFFFFF" opacity={0.6} />
      <rect x={x - neck * 0.62} y={top} width={neck * 1.24} height={capH} rx={h * 0.012} fill="#C9C2A8" stroke={INK} strokeWidth={LINE * 0.8} />
    </g>
  );
};
