// General 5. Why pressed to order: pressed after the order, shipped within 2 days, date on every bottle.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {Grow} from '../../illus/kit';
import {OrderToPress, PressDate, ShipIn2Days} from '../../illus/order';
import {lead, sub} from './text';

const T = sceneTimes([5.0, 5.0, 6.0]);
export const G5_FRAMES = 480;

export const G5: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('Масло отжимают', 8, true), lead('только после заказа', 13)]} />
      <Grow cy={1100}>
        <OrderToPress cx={540} cy={1100} at={10} />
      </Grow>
    </Scene>
    <Scene at={T[1]}>
      <KineticText top={290} lines={[lead('И отправляют не позже', 16, true), lead('чем через 2 дня', 21)]} />
      <Grow cy={1100}>
        <ShipIn2Days cx={540} cy={1100} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[2]} last>
      <KineticText top={290} lines={[lead('Дата отжима', 16, true), lead('на каждой бутылке', 21), sub('к вам приходит свежее масло,', 70), sub('а не со склада', 76)]} />
      <Grow cy={1140} s={1.05}>
        <PressDate cx={540} cy={1140} at={12} date="20.10" />
      </Grow>
    </Scene>
  </Stage>
);
