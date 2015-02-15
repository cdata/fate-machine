import { Behavior } from './behavior';
import { Signal } from './signal';

class Fate {
  static forBehavior (Behavior) {
    return class DynamicFate extends Fate {
      get Behavior () {
        return Behavior;
      }
    };
  }

  get Behavior () {
    return Behavior;
  }

  constructor (machine) {
    this.machine = machine;
    this.behaviors = new Set();
    this.behaviorArray = [];
    this.behaviorsByActor = new WeakMap();

    this.behaviorAdded = new Signal();
    this.behaviorRemoved = new Signal();

    this.machine.actors.forEach(this.observeActor.bind(this));

    machine.actorAdded.await(this.observeActor, this);
    machine.actorRemoved.await(this.forgetActor, this);
  }

  observeActor (actor) {
    actor.aspectAdded.await(this.considerActor, this);
    actor.aspectRemoved.await(this.considerActor, this);

    this.considerActor(actor);
  }

  forgetActor (actor) {
    actor.aspectAdded.forget(this.considerActor, this);
    actor.aspectRemoved.forget(this.considerActor, this);

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
    this.behaviorArray.push(behavior);

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
    this.behaviorArray.splice(this.behaviorArray.indexOf(behavior), 1);

    this.behaviorRemoved.emit(behavior, this);
  }

  update (delta) {
    this.behaviorArray.forEach((behavior) => {
      behavior.update(delta, this.behaviors);
    });
  }
}

export { Fate };
