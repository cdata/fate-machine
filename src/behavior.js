let requiredStates = Object.freeze([]);

class Behavior () {
  static get requiredStates () {
    return requiredStates;
  }

  static isExhibitedBy (actor) {
    return !!this.collectRequiredStatesFrom(actor);
  }

  static collectRequiredStatesFrom (actor) {
    let states = new WeakMap();

    this.requiredStates.reduce(function (states, RequiredState) {
      if (actor.states.has(RequiredState)) {
        states.set(RequiredState, actor.states.get(requiredState));
      }

      return states;
    });

    if (states.length === this.requiredStateslength) {
      return states;
    }
  }

  constructor (actor) {
    this.actor = actor;
    this.states = this.constructor.collectRequiredStatesFrom(actor);
  }
}
