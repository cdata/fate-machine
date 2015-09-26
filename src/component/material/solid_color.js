(function () {
  'use strict';

  const color = Symbol('color');

  class SolidColorProgram extends Program {
    get vertexShader () {
      return new VertexShader(
`
precision highp float;
precision highp int;

uniform mat4 perspectiveMatrix;
uniform mat4 modelViewMatrix;
uniform vec4 color;

attribute vec3 vertexPosition;

varying vec4 vColor;

void main(void) {
  vColor = color;
  gl_Position = perspectiveMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
}
`
      );
    }

    get fragmentShader () {
      return new FragmentShader(
`
precision highp float;
precision highp int;

varying vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`
      );
    }
  }

  class SolidColorMaterial extends Material {
    constructor (r, g, b, a) {
      super(new SolidColorProgram());

      this[color] = vec4.fromValues(r / 255, g / 255, b / 255, a);
    }

    apply (gl, perspectiveMatrix, modelViewMatrix) {
      super.apply(gl, perspectiveMatrix, modelViewMatrix);

      let program = this.program.link(gl);

      gl.uniform4fv(gl.getUniformLocation(program, 'color'), this[color]);
    }
  }

  window.SolidColorMaterial = SolidColorMaterial;
})();
