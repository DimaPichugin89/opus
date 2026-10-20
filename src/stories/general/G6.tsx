// General 6. How to use it: a spoon or two a day, only into ready food, not for frying, keep cold.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {Grow} from '../../illus/kit';
import {KeepCold, NoFrying, ReadyDishes, SpoonFill} from '../../illus/usage';
import {lead, sub} from './text';

const T = sceneTimes([4.0, 5.0, 4.5, 4.5]);
export const G6_FRAMES = 540;

export const G6: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('1–2 ложки в день', 8, true)]} />
      <Grow cy={1050}>
        <SpoonFill cx={540} cy={1050} at={4} />
      </Grow>
    </Scene>
    <Scene at={T[1]}>
      <KineticText top={290} lines={[lead('Только в готовое блюдо', 16, true), sub('салаты, каши, овощи, творог', 40)]} />
      <Grow cy={1130} s={1.22}>
        <ReadyDishes cx={540} cy={1130} at={14} />
      </Grow>
    </Scene>
    <Scene at={T[2]}>
      <KineticText top={290} lines={[lead('Не для жарки', 16, true), sub('от нагрева польза уходит', 40)]} />
      <Grow cy={1100}>
        <NoFrying cx={540} cy={1100} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[3]} last>
      <KineticText top={290} lines={[lead('Храните в холоде', 16, true), lead('и темноте', 21), sub('без глютена и лактозы', 50)]} />
      <Grow cy={1140} s={1.0}>
        <KeepCold cx={540} cy={1140} at={12} />
      </Grow>
    </Scene>
  </Stage>
);
