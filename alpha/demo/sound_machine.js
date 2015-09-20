import { Machine } from '../machine';
import { OscillatingCanvasNode } from './sound_machine/actor/oscillating_canvas_node';
import { AudioSource, Oscillates } from './sound_machine/sound';
import { TwoDimensional } from './sound_machine/canvas';
import { Render } from './sound_machine/webgl';
import { Sound } from './sound_machine/sound';

let machine = new Machine();
let nodeCount = 1024;

machine.addFate(Oscillates);
machine.addFate(TwoDimensional);
machine.addFate(Render);

for (let i = 0; i < nodeCount; ++i) {
  machine.addActor(new OscillatingCanvasNode('solstice-sub.mp3', i, nodeCount));
}

machine.start();

document.body.appendChild(machine.fates.get(TwoDimensional).canvas);
document.body.appendChild(machine.fates.get(Render).canvas);

AudioSource.getGlobalAudioSource('solstice-sub.mp3').play(30);

window.machine = machine;
