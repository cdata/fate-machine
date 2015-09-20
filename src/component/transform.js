(function () {
  'use strict';

  let position = Symbol('position');
  let scale = Symbol('scale');
  let rotation = Symbol('rotation');

  class Transform extends Component {
    get type () {
      return 'transform';
    }

    get position () {
      return this[position];
    }

    get scale () {
      return this[scale];
    }

    get rotation () {
      return this[rotation];
    }

    constructor () {
      super();

      this[position] = vec3.create();
      this[scale] = vec3.create();
      this[rotation] = quat.create();
      this.reset();
    }

    reset () {
      vec3.set(this[position], 0, 0, 0);
      vec3.set(this[scale], 1, 1, 1);
      quat.identity(this[rotation]);
    }
  }

  window.Transform = Transform;
})();
