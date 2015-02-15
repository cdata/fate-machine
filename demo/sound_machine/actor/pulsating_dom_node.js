import { DomNode } from '../dom';
import { Transform } from '../../../aspect/transform';
import { Actor } from '../../../actor';

class PulsatingDomNode extends Actor {
  create () {
    this.addAspect(Transform);
    this.addAspect(DomNode);
  }
}

export { PulsatingDomNode };
