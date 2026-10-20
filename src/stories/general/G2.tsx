// General 2. How ordinary refined sunflower oil is made, one step at a time.
import React from 'react';
import {KineticText, TextLine} from '../../components/KineticText';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {Grow} from '../../illus/kit';
import {BleachFlasks, CompareBottles, HeatTray, ShelfBottleArt, SolventPour, SteamTank} from '../../illus/shelf';
import {COLORS} from '../../theme';
import {lead, sub} from './text';

const T = sceneTimes([3.5, 3.2, 3.3, 3.0, 3.2, 3.8]);
export const G2_FRAMES = 600;

const step = (n: number): TextLine => ({text: `шаг ${n} из 4`, at: 14, role: 'sub', color: COLORS.inkSoft});

export const G2: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('А как делают обычное', 8, true), lead('подсолнечное?', 14)]} />
      <Grow cy={1110}>
        <ShelfBottleArt cx={540} cy={1110} at={4} />
      </Grow>
    </Scene>
    <Scene at={T[1]}>
      <KineticText top={290} lines={[step(1), lead('Семена прогревают', 20)]} />
      <Grow cy={1100}>
        <HeatTray cx={540} cy={1100} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[2]}>
      <KineticText top={290} lines={[step(2), lead('Остатки масла', 20), lead('вытягивают', 25), lead('растворителем', 30)]} />
      <Grow cy={1140}>
        <SolventPour cx={540} cy={1140} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[3]}>
      <KineticText top={290} lines={[step(3), lead('Очищают', 20), lead('и отбеливают', 25)]} />
      <Grow cy={1080}>
        <BleachFlasks cx={540} cy={1080} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[4]}>
      <KineticText top={290} lines={[step(4), lead('Пропаривают', 20), lead('при 200 °C и выше', 25), sub('чтобы убрать запах', 46)]} />
      <Grow cy={1150}>
        <SteamTank cx={540} cy={1150} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[5]} last>
      <KineticText top={290} lines={[lead('Масло без вкуса', 14, true), lead('и запаха', 19), sub('вместе с запахом уходит', 44), sub('часть пользы', 48)]} />
      <Grow cy={1130}>
        <CompareBottles cx={540} cy={1130} at={10} />
      </Grow>
    </Scene>
  </Stage>
);
