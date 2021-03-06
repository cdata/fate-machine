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

    apply (gl, perspectiveMatrix, modelViewMatrix) {
      let program = this.program.link(gl);
      let perspectiveMatrixUniformLocation = gl.getUniformLocation(program, 'perspectiveMatrix');
      let modelViewMatrixUniformLocation = gl.getUniformLocation(program, 'modelViewMatrix');

      gl.useProgram(program);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.createIndexBuffer(gl));

      gl.uniformMatrix4fv(perspectiveMatrixUniformLocation, false, perspectiveMatrix);
      gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    }
  }

  window.Material = Material;

})();
