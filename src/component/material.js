(function () {
  'use strict';

  let program = Symbol('program');

  class Material extends Component {
    get type () {
      return 'material';
    }

    get program () {
      return this[program];
    }

    get geometry () {
      return this.getSiblingComponent('geometry');
    }

    get canApply () {
      return !!(this.geometry);
    }

    constructor (_program) {
      super();
      this[program] = _program || new Program();
    }

    applyIfAble (gl, perspectiveMatrix, modelViewMatrix) {
      if (!this.canApply) {
        return;
      }

      this.apply(gl, perspectiveMatrix, modelViewMatrix);
    }

    apply (gl, perspectiveMatrix, modelViewMatrix) {
      let program = this.program.link(gl);
      let vertexPositionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');
      let perspectiveMatrixUniformLocation = gl.getUniformLocation(program, 'perspectiveMatrix');
      let modelViewMatrixUniformLocation = gl.getUniformLocation(program, 'modelViewMatrix');

      gl.useProgram(program);

      gl.vertexAttribPointer(vertexPositionAttributeLocation, this.geometry.size, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionAttributeLocation); // ?????

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.createIndexBuffer(gl));

      gl.uniformMatrix4fv(perspectiveMatrixUniformLocation, false, perspectiveMatrix);
      gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    }
  }

  window.Material = Material;

})();
