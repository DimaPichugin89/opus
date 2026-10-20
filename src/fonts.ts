import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT} from './theme';

const FACES: [string, string, string][] = [
  [FONT.black, 'InterDisplay-Black.otf', '900'],
  [FONT.bold, 'InterDisplay-Bold.otf', '700'],
  [FONT.semi, 'InterDisplay-SemiBold.otf', '600'],
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    FACES.map(async ([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight});
      document.fonts.add(await face.load());
    }),
  ).then(() => continueRender(handle));
};
