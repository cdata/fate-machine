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
      transform: `translate(${this.transform.position.x}px, ${this.transform.position.y}px)
                  scale(${this.transform.scale.x}, ${this.transform.scale.y})
                  rotate(${this.transform.rotation.z}deg)`
    };
  }
}

class DomNode {
  constructor () {
    this.element = document.createElement('div');
    this.element.className = "sound-machine dom-node";

    document.body.appendChild(this.element);

    //this.style = {
      //backgroundColor: `rgba(${this.randomRgb},${this.randomRgb},${this.randomRgb},0.75)`
    //};
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
