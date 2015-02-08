import { Signal } from './signal';
import { Clock } from './clock';
import { Mainspring } from './mainspring';

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
    this.actors = new Set();

    this.clock = new Clock(60);
    this.mainspring = new Mainspring();

    this.signalNames.forEach((signalName) => {
      this[signalName] = new Signal();
    });
  }

  start () {
    this.clock.start();
    this.mainspring.drive(this.update.bind(this));
  }

  stop () {
    this.clock.stop();
    this.mainspring.exhaust();
  }

  update () {
    for (let [Fate, fate] of this.fates) {
      fate.update(this.clock.ticks);
    }

    this.clock.split();
  }

  addActor (actor) {
    if (this.actors.has(actor)) {
      return;
    }

    this.actors.add(actor);

    actor.childAdded.await(this.addActor, this);
    actor.willBeDestroyed.await(this.removeActor, this);

    this.actorAdded.emit(actor, this);
  }

  removeActor (actor) {
    if (!this.actors.has(actor)) {
      return;
    }

    this.actors.delete(actor);
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

export { Machine };
