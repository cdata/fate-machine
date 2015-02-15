class Behavior {
  static get requiredAspects () {
    return {};
  }

  static isExhibitedBy (actor) {
    return !!this.collectRequiredAspectsFrom(actor);
  }

  static collectRequiredAspectsFrom (actor) {
    let aspects = new WeakMap();

    Object.keys(this.requiredAspects).forEach((property) => {
      let Aspect = this.requiredAspects[property];

      if (!actor.aspects.has(Aspect)) {
        return;
      }

      aspects.set(Aspect, actor.aspects.get(Aspect));
    });

    return aspects;
  }

  constructor (actor) {
    this.actor = actor;
    this.aspects = this.constructor.collectRequiredAspectsFrom(actor);

    Object.keys(this.constructor.requiredAspects).forEach((property) => {
      let Aspect = this.constructor.requiredAspects[property];
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
