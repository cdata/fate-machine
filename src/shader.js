(function () {
  'use strict';

  const source = Symbol('source');
  const type = Symbol('type');
  const selectGlType = Symbol('selectGlType');

  const types = {
    VERTEX: 0,
    FRAGMENT: 1
  };

  class Shader {
    static get types () {
      return types;
    }

    get type () {
      return this[type];
    }

    get source () {
      return this[source];
    }

    constructor (_type, _source) {
      this[type] = _type;
      this[source] = _source;
    }

    compile (gl) {
      let shader = gl.createShader(this[selectGlType](gl));

      gl.shaderSource(shader, this[source]);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        throw new Error('Failed to compile shader source.');
      }

      return shader;
    }

    [selectGlType] (gl) {
      return this.type === Shader.types.VERTEX ?
        gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    }
  }

  window.Shader = Shader;
})();
