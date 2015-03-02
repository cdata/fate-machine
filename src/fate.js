import { Behavior } from './behavior';
import { Signal } from './signal';

class Fate {
  get Behavior () {
    return Behavior;
  }

  get expectedAspects () {
    return [];
  }

  constructor (machine, ...args) {
    this.machine = machine;

    this.actors = new Set();
    this.behaviors = new Map();

    this.machine.actors.forEach(this.observeActor.bind(this));

    machine.actorAdded.await(this.observeActor, this);
    machine.actorRemoved.await(this.forgetActor, this);

    this.actorGoverned = new Signal();
    this.actorUngoverned = new Signal();

    this.create(...args);
  }

  create () {}

  observeActor (actor) {
    actor.aspectAdded.await(this.considerActor, this);
    actor.aspectRemoved.await(this.considerActor, this);

    this.considerActor(actor);
  }

  unobserveActor (actor) {
    actor.aspectAdded.forget(this.considerActor, this);
    actor.aspectRemoved.forget(this.considerActor, this);

    this.ungovernActor(actor);
  }

  considerActor (actor) {
    if (this.shouldGovernActor(actor)) {
      this.governActor(actor);
    } else {
      this.ungovernActor(actor);
    }
  }

  shouldGovernActor (actor) {
    return this.Behavior.isExhibitedBy(actor);
  }

  governActor (actor) {
    if (this.actors.has(actor)) {
      return;
    }

    this.actors.add(actor);
    this.behaviors.set(actor, new this.Behavior(actor, this));

    this.actorGoverned.emit(actor, this);
  }

  ungovernActor (actor) {
    if (!this.actors.has(actor)) {
      return;
    }

    this.actors.remove(actor);
    this.behaviors.delete(actor);

    this.actorUngoverned.emit(actor, this);
  }

  update (delta) {
    for (let actor of this.actors) {
      this.behaviors.get(actor).update(delta, this);
    }
  }
}

export { Fate };
export { Behavior } from './behavior';
