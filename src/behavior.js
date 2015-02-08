let requiredAspects = Object.freeze([]);

class Behavior {
  static get requiredAspects () {
    return requiredAspects;
  }

  static isExhibitedBy (actor) {
    return !!this.collectRequiredAspectsFrom(actor);
  }

  static collectRequiredAspectsFrom (actor) {
    let aspects = new WeakMap();

    for (let Aspect of this.requiredAspects) {
      if (!actor.aspects.has(Aspect)) {
        return;
      }

      aspects.set(Aspect, actor.aspects.get(Aspect));
    }

    return aspects;
  }

  constructor (actor) {
    this.actor = actor;
    this.aspects = this.constructor.collectRequiredAspectsFrom(actor);
  }

  update () {}
}
