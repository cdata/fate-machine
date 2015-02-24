import { Transform } from '../../aspect/transform';
import { Behavior } from '../../behavior';

class ToilsInDocument extends Behavior {
  static get requiredAspects () {
    return {
      transform: Transform,
      domNode: DomNode
    };
  }

  update (delta) {
    this.domNode.style = {
      transform: `translate3d(${this.transform.position.x}px, ${this.transform.position.y}px, 0)
                  scale3d(${this.transform.scale.x}, ${this.transform.scale.y}, 1)`
    };
  }
}

class DomNode {
  constructor () {
    this.element = document.createElement('div');
    this.element.className = "sound-machine dom-node";

    document.body.appendChild(this.element);
  }

  get randomRgb () {
    return 0|(Math.random() * 255);
  }

  set style (styles) {
    for (var property in styles) {
      this.element.style[property] = styles[property];
    }
  }
}

export { DomNode, ToilsInDocument };
