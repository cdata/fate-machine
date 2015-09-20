import { Transform } from '../../../aspect/transform';
import { Sound, Frequency } from '../sound';
import { Actor } from '../../../actor';
import { Pixel } from '../webgl';

class OscillatingCanvasNode extends Actor {
  create (soundFile, index, total) {
    this.addAspect(Transform);
    this.addAspect(Sound, soundFile);
    this.addAspect(Frequency, index, total);
    this.addAspect(Pixel);
  }
}

export { OscillatingCanvasNode };
