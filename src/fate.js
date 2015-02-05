import { Behavior } from './behavior.js';
import { Signal } from './signal.js';

class Fate {
  get Behavior () {
    return Behavior;
  }

  constructor (machine) {
    this.machine = machine;
    this.behaviors = new Set();
    this.behaviorsByActor = new WeakMap();

    this.behaviorAdded = new Signal();
    this.behaviorRemoved = new Signal();

    Object.values(this.machine.actors)
      .forEach(this.observeActor.bind(this));

    machine.actorAdded.await(this.observeActor, this);
    machine.actorRemoved.await(this.forgetActor, this);
  }

  observeActor (actor) {
    actor.stateAdded.await(this.considerActor, this);
    actor.stateRemoved.await(this.considerActor, this);

    this.considerActor(actor);
  }

  forgetActor (actor) {
    actor.stateAdded.forget(this.considerActor, this);
    actor.stateRemoved.forget(this.considerActor, this);

    this.removeBehaviorFor(actor);
  }

  considerActor (actor) {
    if (this.Behavior.isExhibitedBy(actor)) {
      this.addBehaviorFor(actor);
    } else {
      this.removeBehaviorFor(actor);
    }
  }

  addBehaviorFor (actor) {
    let behavior;

    if (this.behaviorsByActor.has(actor)) {
      return;
    }

    behavior = new this.Behavior(actor);

    this.behaviors.add(behavior);
    this.behaviorsByActor.set(actor, behavior);

    this.behaviorAdded.emit(behavior, this);
  }

  removeBehaviorFor (actor) {
    let behavior;

    if (!this.behaviorsByActor.has(actor)) {
      return;
    }

    behavior = this.behaviorsByActor.get(actor);

    this.behaviors.delete(behavior);
    this.behaviorsByActor.delete(actor);

    this.behaviorRemoved.emit(behavior, this);
  }
}
