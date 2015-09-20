(function () {
  'use strict';

  let components = Symbol('components');
  let children = Symbol('children');
  let parent = Symbol('parent');

  class SceneNode extends Evented {
    get components () {
      return this[components];
    }

    get children () {
      return this[children];
    }

    get parent () {
      return this[parent];
    }

    constructor () {
      super();

      this[children] = [];
      this[components] = {};
      this[parent] = null;
    }

    addComponent (component) {
      this[components][component.type] = component;
      component.sceneNode = this;
    }

    removeComponent (type) {
      this[components][type] = null;
      component.sceneNode = null;
    }

    getComponent (type) {
      return this[components][type];
    }

    addChild (node) {
      if (node[parent] != null) {
        node[parent].removeChild(node);
      }

      this[children].push(node);
      node[parent] = this;
    }

    removeChild (node) {
      let index = this[children].indexOf(node);

      if (index < 0) {
        return;
      }

      this[children].splice(index, 1);
    }
  }

  window.SceneNode = SceneNode;
})();
