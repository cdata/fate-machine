(function () {
  'use strict';

  class Graphics extends Component {
    get type () {
      return 'graphics';
    }

    get material () {
      return this.getSiblingComponent('material');
    }

    get geometry () {
      return this.getSiblingComponent('geometry');
    }

    get isDrawable () {
      return !!(this.geometry && this.material);
    }

    drawIfAble (gl, perspectiveMatrix, modelViewMatrix) {
      if (!this.isDrawable) {
        return;
      }

      this.draw(gl, perspectiveMatrix, modelViewMatrix);
    }

    render (gl, perspectiveMatrix, modelViewMatrix) {
      if (this.material.canApply) {
        this.material.apply(gl, perspectiveMatrix, modelViewMatrix);
      }

      if (this.geometry.canDraw) {
        this.geometry.draw(gl, perspectiveMatrix, modelViewMatrix);
      }
    }
  }

  window.Graphics = Graphics;
})();
