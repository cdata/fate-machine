import { Machine } from '../machine';
import { Actor } from '../actor';
import { Behavior } from '../behavior';
import { Fate } from '../fate';
import { Transform } from '../aspect/transform';

let machine = new Machine();

let pulsateAspects = Object.freeze([
  Transform
]);

class Pulsates extends Behavior {
  static get requiredAspects () {
    return pulsateAspects;
  }

  get transform () {
    return this.aspects.get(Transform);
  }

  update (delta) {
    let scale;

    this.t0 = this.t0 || 0;
    this.t0 += delta;

    scale = Math.sin(this.t0 / 100);

    this.transform.position.x = Math.cos(this.t0 / 100 + Math.PI / 2) * 100 + 100;
    this.transform.position.y = Math.cos(this.t0 / 100) * 100 + 100;

    this.transform.rotation.z = Math.sin(this.t0 / 100) * 360;

    this.transform.scale.set(
      scale,
      scale,
      scale
    );
  }
}

class Pulsate extends Fate {
  get Behavior () {
    return Pulsates;
  }
}

class DomNode {
  constructor () {
    this.element = document.createElement('div');
    this.element.className = "sound-machine dom-node";

    document.body.appendChild(this.element);
  }

  set style (styles) {
    for (var property in styles) {
      this.element.style[property] = styles[property];
    }
  }
}

let existsInDocumentAspects = Object.freeze([
  Transform,
  DomNode
]);

class ToilsInDocument extends Behavior {
  static get requiredAspects () {
    return existsInDocumentAspects;
  }

  update (delta) {
    this.domNode.style = {
      transform: `translate(${this.transform.position.x}px, ${this.transform.position.y}px)
                  scale(${this.transform.scale.x}, ${this.transform.scale.y})
                  rotate(${this.transform.rotation.z}deg)`
    };
  }

  get domNode () {
    return this.aspects.get(DomNode);
  }

  get transform () {
    return this.aspects.get(Transform);
  }
}

class DomToil extends Fate {
  get Behavior () {
    return ToilsInDocument;
  }
}

class PulsatingDomNode extends Actor {
  create () {
    this.addAspect(Transform);
    this.addAspect(DomNode);
  }
}

machine.addFate(Pulsate);
machine.addFate(DomToil);

machine.addActor(new PulsatingDomNode());

machine.start();
