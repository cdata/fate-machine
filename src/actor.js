import { Signal } from './signal.js';

let signalNames = [
  'parentChanged',
  'childAdded',
  'childRemoved',
  'stateAdded',
  'stateRemoved'
];

class Actor {
  get signalNames () {
    return signalNames;
  }

  constructor (machine) {
    this.machine = machine;

    this.states = new Map();

    this.children = [];
    this.parent = null;

    this.signalNames.forEach(function (signalName) {
      this[signalName] = new Signal();
    }, this);

    this.create();

    this.machine.addActor(this);
  }

  create () {}

  destroy () {
    this.signalNames.forEach(function (signalName) {
      this[signalName].destroy();
    }, this);
    this.states = null;
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

  addState (State) {
    let state;

    if (this.states.has(State)) {
      return;
    }

    state = new State(this);

    this.states.set(State, state);
    this.stateAdded.emit(state, this);
  }

  removeState (State) {
    if (!this.states.has(State)) {
      return;
    }

    this.states.delete(State);
    this.stateRemoved.emit(state, this);
  }
}
