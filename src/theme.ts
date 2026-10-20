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
  steelLight: '#EEEEEB',
  steel: '#C9CAC6',
  steelDeep: '#9C9E99',
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
  medium: 'MasMedium',
  regular: 'MasRegular',
};

// Type scale. Restrained: sentence case, medium/regular weights, tight leading.
export type TypeRole = {font: keyof typeof FONT; size: number; lineHeight: number; tracking: number};
export const TYPE = {
  title: {font: 'medium', size: 120, lineHeight: 1.0, tracking: -0.03},
  lead: {font: 'medium', size: 90, lineHeight: 1.04, tracking: -0.025},
  body: {font: 'regular', size: 90, lineHeight: 1.04, tracking: -0.02},
  cta: {font: 'medium', size: 60, lineHeight: 1.1, tracking: -0.01},
  item: {font: 'medium', size: 80, lineHeight: 1.05, tracking: -0.02},
  note: {font: 'regular', size: 56, lineHeight: 1.15, tracking: -0.01},
  label: {font: 'regular', size: 46, lineHeight: 1.1, tracking: 0},
} satisfies Record<string, TypeRole>;

// Reading time: 0.3 s per word, never under 1.2 s per phrase.
export const readFrames = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(Math.max(1.2, words * 0.3) * FPS);
};
