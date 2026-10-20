// General 4. What it gives the body: vitamin E, omega-3 and 6, heart, vessels and brain.
import React from 'react';
import {KineticText} from '../../components/KineticText';
import {Scene, sceneTimes} from '../../components/Scene';
import {Stage} from '../../components/Stage';
import {DropLand, OmegaPlate, Organs, VitaminE} from '../../illus/benefit';
import {Grow} from '../../illus/kit';
import {lead, sub} from './text';

const T = sceneTimes([3.0, 5.0, 5.0, 5.0]);
export const G4_FRAMES = 540;

export const G4: React.FC = () => (
  <Stage>
    <Scene at={T[0]} first>
      <KineticText top={290} lines={[lead('Что даёт', 8, true), lead('сыродавленное масло', 13)]} />
      <Grow cy={1100}>
        <DropLand cx={540} cy={1100} at={0} />
      </Grow>
    </Scene>
    <Scene at={T[1]}>
      <KineticText top={290} lines={[lead('Витамин E', 16, true), sub('защищает клетки', 40)]} />
      <Grow cy={1100} s={1.05}>
        <VitaminE cx={540} cy={1100} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[2]}>
      <KineticText top={290} lines={[lead('Омега-3 и омега-6', 16, true), sub('организм не делает их сам,', 40), sub('они приходят только с едой', 46)]} />
      <Grow cy={1150} s={1.05}>
        <OmegaPlate cx={540} cy={1150} at={12} />
      </Grow>
    </Scene>
    <Scene at={T[3]} last>
      <KineticText top={290} lines={[lead('Эти жиры нужны', 16, true), lead('сердцу, сосудам и мозгу', 21)]} />
      <Grow cy={1080} s={1.05}>
        <Organs cx={540} cy={1080} at={20} />
      </Grow>
    </Scene>
  </Stage>
);
