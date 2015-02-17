import { Machine } from '../machine';
import { PulsatingDomNode } from './sound_machine/actor/pulsating_dom_node';
import { OscillatingDomNode } from './sound_machine/actor/oscillating_dom_node';
import { ToilsInDocument } from './sound_machine/dom';
import { Pulsates } from './sound_machine/pulsate';
import { AudioSource, Oscillates } from './sound_machine/sound';


import { Sound } from './sound_machine/sound';

let machine = new Machine();
let nodeCount = 512;

machine.addFateForBehavior(ToilsInDocument);
machine.addFateForBehavior(Oscillates);

for (let i = 0; i < nodeCount; ++i) {
  machine.addActor(new OscillatingDomNode('solstice-sub.mp3', i / nodeCount));
}

machine.start();

AudioSource.getGlobalAudioSource('solstice-sub.mp3').play(30);

window.machine = machine;
