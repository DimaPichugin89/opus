// Image manifest. Swap a bottle's `src` here when studio cutouts arrive.
import {Oil} from './theme';

export type BottleAsset = {src: string; w: number; h: number; oil: Oil};

export const BOTTLES = {
  sun: {src: 'cut/sun_life.png', w: 205, h: 804, oil: 'sun'},
  pumpkin: {src: 'cut/pump_life.png', w: 209, h: 817, oil: 'pumpkin'},
  hemp: {src: 'cut/hemp_life.png', w: 209, h: 816, oil: 'hemp'},
} satisfies Record<string, BottleAsset>;

// Lifestyle photos arrive as oval crops (566x1009) with transparent corners.
export const PHOTOS = {
  sunField: 'photo/podsol_1.webp',
  pumpkin: 'photo/pupm_site_img.webp',
  hemp: 'photo/kana_site_img.webp',
};
export const PHOTO_ASPECT = 566 / 1009;

export const LOGO = {
  black: 'logo/logo_black.png',
  yellow: 'logo/logo_yellow.png',
  cream: 'logo/logo_cream.png',
  aspect: 700 / 277,
};
