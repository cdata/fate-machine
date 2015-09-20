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

    draw (gl, perspectiveMatrix, modelViewMatrix) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.createVertexBuffer(gl));

      this.material.applyIfAble(gl, perspectiveMatrix, modelViewMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, this.geometry.length);
    }
  }

  window.Graphics = Graphics;
})();
