(function () {
  'use strict';

  let camera = Symbol('camera');

  class Scene extends SceneNode {

    get camera () {
      return this[camera];
    }

    constructor (_camera) {
      super();
      this[camera] = _camera;
    }
  }

  window.Scene = Scene;
})();
