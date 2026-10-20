// Single source of truth for the series look: canvas, safe zones, colours, type, timing.

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const STORY_FRAMES = 10 * FPS;

// Instagram UI overlays: keep text and logo out of these bands.
export const SAFE = {top: 250, bottom: 340, side: 64};
export const SAFE_BOTTOM_Y = H - SAFE.bottom;

export const COLORS = {
  cream: '#F3EBDD',
  creamDeep: '#E8DBC3',
  ink: '#26170D',
  inkSoft: '#6B5543',
  amber: '#C9821A',
  amberLight: '#F2B640',
};

// Label colours, one per oil.
export const OIL = {
  sun: '#E2312A',
  peanut: '#F2C230',
  mustard: '#C5CF3A',
  hemp: '#1F7A3F',
  cedar: '#2F4A35',
  linen: '#4B57D6',
  sesame: '#EDE4D2',
  almond: '#9C9893',
  pumpkin: '#E0612B',
} as const;
export type Oil = keyof typeof OIL;

export const FONT = {
  black: 'MasBlack',
  bold: 'MasBold',
  semi: 'MasSemi',
};

// Reading time: 0.3 s per word, never under 1.2 s per phrase.
export const readFrames = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(Math.max(1.2, words * 0.3) * FPS);
};
