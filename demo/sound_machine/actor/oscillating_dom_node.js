import { DomNode } from '../dom';
import { Transform } from '../../../aspect/transform';
import { Sound, Frequency } from '../sound';
import { Actor } from '../../../actor';

class OscillatingDomNode extends Actor {
  create (soundFile, index, total) {
    this.addAspect(Transform);
    this.addAspect(DomNode);
    this.addAspect(Sound, soundFile);
    this.addAspect(Frequency, index, total);
  }
}

export { OscillatingDomNode };
