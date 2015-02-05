import { Signal } from './signal.js';

let signalNames = [
  'actorAdded',
  'actorRemoved',
  'fateAdded',
  'fateRemoved',
  'tick'
];

class Machine {
  get signalNames () {
    return signalNames;
  }

  constructor () {
    this.fates = new Map();
    this.actors = {};

    this.signalNames.forEach(function (signalName) {
      this[signalName] = new Signal();
    });
  }

  addActor (actor) {
    if (this.actors[actor.id]) {
      return;
    }

    this.actors[actor.id] = actor;
    this.actorAdded.emit(actor, this);
  }

  removeActor (actor) {
    if (!this.actors[actor.id]) {
      return;
    }

    this.actors[actor.id] = null;
    this.actorRemoved.emit(actor, this);
  }

  addFate (Fate) {
    let fate;

    if (this.fates.has(Fate)) {
      return;
    }

    fate = new Fate(this);
    this.fates.set(Fate, fate);

    this.fateAdded.emit(fate, this);
  }

  removeFate (Fate) {
    let fate;

    if (!this.fates.has(Fate)) {
      return;
    }

    fate = this.fates.get(Fate);
    this.fates.delete(Fate);

    this.fateRemoved.emit(fate, this);
  }
}
