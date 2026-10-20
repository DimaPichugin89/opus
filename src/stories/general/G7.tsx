// General 7. Ten oils, then the logo and where to order.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {LogoPlate} from '../../components/LogoPlate';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {LineupGrid, LineupRow} from '../../illus/lineup';
import {lead, sub} from './text';

const T = sceneTimes([10.0, 8.0]);
export const G7_FRAMES = 540;

export const G7: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('10 масел', 8, true), sub('у каждого свой вкус', 20), sub('и своя польза', 25)]} />
      <LineupGrid at={30} every={22} />
    </Scene>
    <Scene at={T[1]} last>
      <LogoPlate at={14} cy={420} width={640} />
      <KineticText top={600} lines={[sub('Заказывайте на', 30, true), lead('maslarada.ru', 35), sub('отжим под ваш заказ', 60)]} />
      <LineupRow y={1450} at={20} />
    </Scene>
  </Stage>
);
