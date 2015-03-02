import { Fate, Behavior } from '../../fate';

import { Transform } from '../../aspect/transform';
import { Matrix4 } from '../../math/matrix4';
import { Vector3 } from '../../math/vector3';

class Shader {
  constructor (gl) {
    this.gl = gl;
    this.linkProgram();
  }

  linkProgram () {
    let gl = this.gl;
    let program = gl.createProgram();

    gl.attachShader(program, this.compileVertexShader());
    gl.attachShader(program, this.compileFragmentShader());

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw 'Failed to initialize shader program.';
    }

    this.program = program;
    this.perspectiveUniform = gl.getUniformLocation(program, "uPMatrix");
    this.modelViewUniform = gl.getUniformLocation(program, "uMVMatrix");
  }

  compileFragmentShader () {
    let gl = this.gl;
    let shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(shader, this.fragment);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw 'Failed to compile fragment shader source.';
    }

    return shader;
  }

  compileVertexShader () {
    let gl = this.gl;
    let shader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(shader, this.vertex);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw 'Failed to compile vertex shader source.';
    }

    return shader;
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

class Pixel {
  constructor () {
    this.vertices = [
      1, 1, 0,
      0, 1, 0,
      1, 0, 0,
      0, 0, 0
    ];
  }
}


class RenderBehavior extends Behavior {
  static get expectedAspects () {
    return {
      transform: Transform,
      pixel: Pixel
    }
  }

  create () {
    let gl = this.fate.context;
    let vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pixel.vertices), gl.STATIC_DRAW);

    this.vertexBuffer = vertexBuffer;
  }

  update (delta) {
    this.transform.position.z = -100;
    this.fate.pushTransform(this.transform);
    this.draw();
    this.fate.popTransform();
  }

  draw () {
    let gl = this.fate.context;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)

    gl.vertexAttribPointer(this.fate.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.uniformMatrix4fv(this.fate.shader.perspectiveUniform, false, this.fate.perspectiveMatrix.elements);
    gl.uniformMatrix4fv(this.fate.shader.modelViewUniform, false, this.fate.modelViewMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class Render extends Fate {
  get Behavior () {
    return RenderBehavior;
  }
  create () {
    this.boundWebGLContextLost = this.onWebGLContextLost.bind(this);
    this.boundWebGLContextRestored = this.onWebGLContextRestored.bind(this);

    this.vertexBuffers = new WeakMap();
    this.transformStack = [];

    this.width = 1024;
    this.height = 400;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.addEventListener('webglcontextlost', this.boundWebGLContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.boundWebGLContextRestored, false);

    this.glSetup();
    this.glClear();
    this.glSetFeatures();
  }

  get context () {
    let gl = this.gl;
    let options;

    if (gl) {
      return gl;
    }

    options = {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      stencil: true
    };

    try {
      gl = this.canvas.getContext('experimental-webgl', options);
    } catch (e) {}

    if (!gl) {
      try {
        gl = this.canvas.getContext('webgl', options);
      } catch (e) {}
    }

    if (!gl) {
      throw 'WebGL not supported.';
    }

    return this.gl = gl;
  }

  update (delta) {
    let gl = this.context;

    // Set camera details here..
    this.perspectiveMatrix.perspective(45, this.width / this.height, 0.1, 100.0);
    this.modelViewMatrix.identity();

    gl.viewport(0, 0, this.width, this.height);

    // Clear the context..
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all scenes..
    super.update(delta);
  }

  pushTransform (transform) {
    this.transformStack.push(this.modelViewMatrix);

    this.modelViewMatrix = this.modelViewMatrix
      .clone()
      .translate(transform.position)
      .rotate(transform.rotation.quaternion);
  }

  popTransform () {
    if (!this.transformStack.length) {
      return;
    }

    this.modelViewMatrix = this.transformStack.pop();
  }

  glSetup () {
    let gl = this.context;
    let shader = new Shader(this.context);

    gl.useProgram(shader.program);

    gl.colorMask(true, true, true, false);
    gl.viewport(0, 0, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.modelViewMatrix = new Matrix4();
    this.perspectiveMatrix = new Matrix4();
    this.vertexPositionAttribute = gl.getAttribLocation(shader.program, "aVertexPosition")
    this.shader = shader;
  }

  glClear () {
    let gl = this.context;

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.clearStencil(0);
  }

  glSetFeatures () {
    let gl = this.context;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //gl.frontFace(gl.CCW);
    //gl.cullFace(gl.BACK);
    //gl.enable(gl.CULL_FACE);
  }

  onWebGLContextLost () {
    console.log('WEBGL CONTEXT LOST');
  }

  onWebGLContextRestored () {
    console.log('WEBGL CONTEXT RESTORED');
  }
}

export { Render, Pixel };
