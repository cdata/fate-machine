(function () {
  'use strict';

  const defaultVertexShader = new VertexShader();
  const defaultFragmentShader = new FragmentShader();

  const contextProgramCache = new Map();

  class Program {
    static setCached (gl, Program, linkedProgram) {
      let cache = contextProgramCache.get(gl);

      if (!cache) {
        cache = new Map();
        contextProgramCache.set(gl, cache);
      }

      cache.set(Program, linkedProgram);
    }

    static getCached (gl, Program) {
      let cache = contextProgramCache.get(gl);

      if (!cache) {
        return;
      }

      return cache.get(Program);
    }

    constructor (vertexShader, fragmentShader) {
      this.vertexShader = vertexShader || defaultVertexShader;
      this.fragmentShader = fragmentShader || defaultFragmentShader;
    }

    link (gl) {
      let cachedProgram = Program.getCached(gl, this.constructor);

      if (cachedProgram) {
        return cachedProgram;
      }

      let program = gl.createProgram();
      let vertexShader = this.vertexShader.compile(gl);
      let fragmentShader = this.fragmentShader.compile(gl);

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);

      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Failed to initialize shader program.');
      }

      Program.setCached(gl, this.constructor, program);

      return program;
    }
  }

  window.Program = Program;
})();
