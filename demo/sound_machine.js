import { Machine } from '../machine';
import { PulsatingDomNode } from './sound_machine/actor/pulsating_dom_node';
import { ToilsInDocument } from './sound_machine/dom';
import { Pulsates } from './sound_machine/pulsate';

let machine = new Machine();

machine.addFateForBehavior(Pulsates);
machine.addFateForBehavior(ToilsInDocument);

for (let i = 0; i < 100; ++i) {
  machine.addActor(new PulsatingDomNode());
}

machine.start();
