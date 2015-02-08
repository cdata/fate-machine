import { Signal } from './signal';

let signalNames = [
  'parentChanged',
  'childAdded',
  'childRemoved',
  'aspectAdded',
  'aspectRemoved',
  'willBeDestroyed'
];

class Actor {
  get signalNames () {
    return signalNames;
  }

  constructor () {
    this.aspects = new Map();

    this.children = [];
    this.parent = null;

    this.signalNames.forEach((signalName) => {
      this[signalName] = new Signal();
    });

    this.create();
  }

  create () {}

  destroy () {
    this.willBeDestroyed.emit(this);

    this.signalNames.forEach((signalName) => {
      this[signalName].destroy();
    });
    this.aspects = null;
    this.children = null;
  }

  addChild (actor) {
    if (actor.parent === this) {
      return;
    }

    actor.parent = this;
    actor.parentChanged.emit(this, actor);

    this.children.push(actor);
    this.childAdded.emit(actor, this);
  }

  removeChild (actor) {
    if (actor.parent !== this) {
      return;
    }

    this.children.splice(
      this.children.indexOf(actor),
      1
    );

    actor.parent = null;
    actor.parentChanged.emit(null, actor);

    this.childRemoved.emit(actor, this);
  }

  addAspect (Aspect) {
    let aspect;

    if (this.aspects.has(Aspect)) {
      return;
    }

    aspect = new Aspect(this);

    this.aspects.set(Aspect, aspect);
    this.aspectAdded.emit(aspect, this);
  }

  removeAspect (Aspect) {
    if (!this.aspects.has(Aspect)) {
      return;
    }

    this.aspects.delete(Aspect);
    this.aspectRemoved.emit(aspect, this);
  }
}

export { Actor };
