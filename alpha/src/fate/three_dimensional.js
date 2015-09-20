import { Matrix4 } from '../math/matrix4';
import { Fate } from '../fate';
import { ThreeDimensionalBehavior } from '../behavior/three_dimensional';

class ThreeDimensional extends Fate {
  get Behavior () {
    return ThreeDimensionalBehavior;
  }

  create (width, height) {
    this.boundWebGLContextLost = this.onWebGLContextLost.bind(this);
    this.boundWebGLContextRestored = this.onWebGLContextRestored.bind(this);

    this.transformStack = [];

    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('webglcontextlost', this.boundWebGLContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.boundWebGLContextRestored, false);

    this.setViewportSize(width, height);

    this.glSetup();
    this.glClear();
    this.glSetFeatures();
  }

  setViewportSize (width, height) {
    this.width = width * this.pixelRatio;
    this.height = height * this.pixelRatio;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width / this.pixelRatio + 'px';
    this.canvas.style.height = this.height / this.pixelRatio + 'px';
  }

  get pixelRatio () {
    return window.devicePixelRatio;
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
      throw new Error('WebGL not supported.');
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
    //let shader = new Shader(this.context);

    //gl.useProgram(shader.program);

    gl.colorMask(true, true, true, false);
    gl.viewport(0, 0, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.modelViewMatrix = new Matrix4();
    this.perspectiveMatrix = new Matrix4();
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

export { ThreeDimensional };
