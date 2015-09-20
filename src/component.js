(function () {
  'use strict';

  class Component {
    get type () {
      return 'no_type';
    }

    constructor () {
      this.sceneNode = null;
    }

    getSiblingComponent (type) {
      return this.sceneNode && this.sceneNode.getComponent(type);
    }
  }

  window.Component = Component;
})();
