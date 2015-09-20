(function () {
  'use strict';

  const defaultSource = `
precision highp float;
precision highp int;

uniform mat4 perspectiveMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 vertexPosition;

void main(void) {
  gl_Position = perspectiveMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
}
`;

  class VertexShader extends Shader {
    constructor (source) {
      source = source || defaultSource;
      super(Shader.types.VERTEX, source);
    }
  }

  window.VertexShader = VertexShader;
})();
