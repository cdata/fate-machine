class Behavior {
  static get expectedAspects () {
    return [];
  }

  static isExhibitedBy (actor) {
    return !!this.collectExpectedAspectsFrom(actor);
  }

  static collectExpectedAspectsFrom (actor) {
    let aspects = new WeakMap();

    this.expectedAspects.forEach((Aspect) => {
      if (!actor.aspects.has(Aspect.type)) {
        return;
      }

      aspects.set(Aspect, actor.aspects.get(Aspect));
    });

    return aspects;
  }

  constructor (actor, fate) {
    this.actor = actor;
    this.fate = fate;
    this.aspects = this.constructor.collectExpectedAspectsFrom(actor);

    this.constructor.expectedAspects.forEach((Aspect) => {
      let aspect = this.actor.aspects.get(Aspect.type);

      Object.defineProperty(this, Aspect.type, {
        get: function () {
          return aspect;
        }
      });
    });

    this.create();
  }

  create () {}

  update () {}
}
