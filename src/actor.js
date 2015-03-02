import { Signal } from './signal';

let signalNames = [
  'aspectAdded',
  'aspectRemoved',
  'willBeDestroyed'
];

class Actor {
  get signalNames () {
    return signalNames;
  }

  constructor (...args) {
    this.aspects = new Map();

    this.signalNames.forEach((signalName) => {
      this[signalName] = new Signal();
    });

    this.create(...args);
  }

  create () {}

  destroy () {
    this.willBeDestroyed.emit(this);

    this.signalNames.forEach((signalName) => {
      this[signalName].destroy();
    });
    this.aspects = null;
  }

  addAspect (Aspect, ...args) {
    let aspect;

    if (this.aspects.has(Aspect.type)) {
      return;
    }

    aspect = new Aspect(...args);

    this.aspects.set(Aspect.type, aspect);
    this.aspectAdded.emit(aspect, this);
  }

  removeAspect (Aspect) {
    if (!this.aspects.has(Aspect.type)) {
      return;
    }

    this.aspects.delete(Aspect.type);
    this.aspectRemoved.emit(aspect, this);
  }
}

export { Actor };
