var cache = new WeakMap();

class CompiledShader {
  static get type () {
    return 'compiledShader';
  }

  static get cache () {
    return cache;
  }

  constructor (shader, gl) {
    this.gl = gl;
    this.source = shader;
    this.linkProgram();
  }

  getProgramFromCache () {
    if (CompiledShader.cache.has(this.source.constructor)) {
      return CompiledShader.cache.get(this.source.constructor);
    }
  }

  linkProgram () {
    let gl = this.gl;
    let program = this.getProgramFromCache()

    if (!program) {
      program = gl.createProgram();

      gl.attachShader(program, this.compileVertexShader());
      gl.attachShader(program, this.compileFragmentShader());

      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Failed to initialize shader program.');
      }

      CompiledShader.cache.set(this.source.constructor, program);
    }

    this.program = program;
    this.perspectiveUniform = gl.getUniformLocation(program, "uPMatrix");
    this.modelViewUniform = gl.getUniformLocation(program, "uMVMatrix");
  }

  compileFragmentShader () {
    let gl = this.gl;
    let shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, this.source.fragment);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Failed to compile fragment shader source.');
    }

    return shader;
  }

  compileVertexShader () {
    let gl = this.gl;
    let shader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(shader, this.source.vertex);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Failed to compile vertex shader source.');
    }

    return shader;
  }
}

export { CompiledShader };
