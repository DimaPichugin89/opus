// General 3. And olive oil? An honest comparison.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {Grow} from '../../illus/kit';
import {BlendBottle, MonthsOnRoad, OliveArt, OmegaJars} from '../../illus/olive';
import {lead, sub} from './text';

const T = sceneTimes([4.5, 5.5, 4.0, 4.0]);
export const G3_FRAMES = 540;

export const G3: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('А оливковое?', 8, true), sub('хорошее Extra Virgin тоже', 34), sub('отжимают без нагрева', 38)]} />
      <Grow cy={1120}>
        <OliveArt cx={540} cy={1120} at={4} />
      </Grow>
    </Scene>
    <Scene at={T[1]}>
      <KineticText top={290} lines={[lead('Омега-3 в оливковом', 16, true), lead('почти нет', 21), sub('в льняном её больше половины', 64)]} />
      <Grow cy={1150} s={1.1}>
        <OmegaJars cx={540} cy={1150} at={20} />
      </Grow>
    </Scene>
    <Scene at={T[2]}>
      <KineticText top={290} lines={[lead('До полки оно едет', 16, true), lead('и хранится месяцами', 21)]} />
      <Grow cy={1120} s={1.1}>
        <MonthsOnRoad cx={540} cy={1120} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[3]} last>
      <KineticText top={290} lines={[lead('Просто «Olive oil»', 16, true), lead('на этикетке', 21), sub('обычно смесь с рафинированным', 44)]} />
      <Grow cy={1150} s={1.05}>
        <BlendBottle cx={540} cy={1150} at={12} />
      </Grow>
    </Scene>
  </Stage>
);
