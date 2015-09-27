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
      let program = this.material.program.link(gl);
      let vertexPositionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');

      gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.createVertexBuffer(gl));

      gl.vertexAttribPointer(vertexPositionAttributeLocation, this.geometry.size, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionAttributeLocation); // ?????

      this.material.applyIfAble(gl, perspectiveMatrix, modelViewMatrix);

      if (this.geometry.rawIndices.length) {
        gl.drawElements(gl.TRIANGLES, this.geometry.rawIndices.length, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.length);
      }
    }
  }

  window.Graphics = Graphics;
})();
