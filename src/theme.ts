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
  linen: '#4B57D6',
  sesame: '#EDE4D2',
  pumpkin: '#E0612B',
  hemp: '#1F7A3F',
  mustard: '#C5CF3A',
  camelina: '#9DB83C',
  almond: '#9C9893',
  peanut: '#F2C230',
  thistle: '#B46FC2',
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
  lead: {font: 'medium', size: 84, lineHeight: 1.06, tracking: -0.025},
  body: {font: 'regular', size: 90, lineHeight: 1.04, tracking: -0.02},
  sub: {font: 'regular', size: 56, lineHeight: 1.18, tracking: -0.01},
  para: {font: 'medium', size: 72, lineHeight: 1.12, tracking: -0.02}, // connected sentences, up to ~23 chars a line
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
