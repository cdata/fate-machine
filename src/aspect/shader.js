import { Aspect } from '../aspect';

class Shader {
  static get type () {
    return 'shader';
  }

  get fragment () {
    return `
precision mediump float;

void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;
  }

  get vertex () {
    return `
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}`;
  }
}

export { Shader };
