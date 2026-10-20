// Short builders for the on-screen copy so every story uses the same roles and colours.
import {TextLine} from '../../components/KineticText';
import {COLORS} from '../../theme';

export const lead = (text: string, at: number, sound = false): TextLine => ({text, at, role: 'lead', sound});
export const sub = (text: string, at: number, sound = false): TextLine => ({text, at, role: 'sub', color: COLORS.inkSoft, sound});
