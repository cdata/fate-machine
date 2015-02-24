class Behavior {
  static get expectedAspects () {
    return {};
  }

  static isExhibitedBy (actor) {
    return !!this.collectExpectedAspectsFrom(actor);
  }

  static collectExpectedAspectsFrom (actor) {
    let aspects = new WeakMap();

    Object.keys(this.expectedAspects).forEach((property) => {
      let Aspect = this.expectedAspects[property];

      if (!actor.aspects.has(Aspect)) {
        return;
      }

      aspects.set(Aspect, actor.aspects.get(Aspect));
    });

    return aspects;
  }

  constructor (actor) {
    this.actor = actor;
    this.aspects = this.constructor.collectExpectedAspectsFrom(actor);

    Object.keys(this.constructor.expectedAspects).forEach((property) => {
      let Aspect = this.constructor.expectedAspects[property];
      let aspect = this.aspects.get(Aspect);

      Object.defineProperty(this, property, {
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
