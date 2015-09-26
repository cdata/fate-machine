(function() {
  'use strict';

  const options = Symbol('options');
  const canvas = Symbol('canvas');
  const gl = Symbol('gl');

  const useCamera = Symbol('useCamera');
  const setupGl = Symbol('setupGl');
  const configureGl = Symbol('configureGl');
  const renderSceneGraph = Symbol('renderSceneGraph');

  const perspectiveMatrix = mat4.create();
  const modelViewMatrix = mat4.create();
  const intermediateMatrix = mat4.create();

  class Renderer {
    get gl () {
      return this[gl];
    }

    get canvas () {
      return this[canvas];
    }

    get options () {
      return this[options];
    }

    get glOptions () {
      let glOptions = {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        stencil: false
      };
      let userGlOptions = this.options.glOptions || {};

      for (let option in userGlOptions) {
        glOptions[option] = userGlOptions[option];
      }

      return glOptions;
    }

    get pixelRatio () {
      return this.options.pixelRatio || window.devicePixelRatio;
    }

    get viewportWidth () {
      return document.documentElement.clientWidth ||
        window.innerWidth;
    }

    get viewportHeight () {
      return document.documentElement.clientHeight ||
        window.innerHeight;
    }

    get width () {
      return this.canvas.width;
    }

    get height () {
      return this.canvas.height;
    }

    constructor (_options) {
      this[options] = _options || { glOptions: {} };
      this[canvas] = document.createElement('canvas');

      this.resetDimensions();
      this.resetGl();
    }

    resetDimensions () {
      this[canvas].width = this.viewportWidth;
      this[canvas].height = this.viewportHeight;
      this[canvas].style.width = this.canvas.width + 'px';
      this[canvas].style.height = this.canvas.height + 'px';
    }

    resetGl () {
      let options = this.glOptions;
      let _gl;

      try {
        _gl = this.canvas.getContext('experimental-webgl', options);
      } catch (e) {}

      if (!_gl) {
        try {
          _gl = this.canvas.getContext('webgl', options);
        } catch (e) {}
      }

      if (!_gl) {
        throw new Error('WebGL not supported.');
      }

      this[gl] = _gl;
    }

    resetWorld () {
      mat4.identity(perspectiveMatrix);
      mat4.identity(modelViewMatrix);

      this.gl.viewport(0, 0, this.width, this.height);
    }

    clear () {
      this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    render (scene) {
      this.resetWorld();
      this.clear();

      scene.camera.applyTo(perspectiveMatrix, modelViewMatrix);

      this[renderSceneGraph](scene);
    }

    [setupGl] () {
      this.gl.colorMask(true, true, true, false);
      this.gl.viewport(0, 0, this.width, this.height);
      this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    [configureGl] () {
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);

      this.gl.enable(this.gl.BLEND);
      this.gl.blendEquation(this.gl.FUNC_ADD);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clearDepth(1);
      this.gl.clearStencil(0);

      this.gl.enableVertexAttribArray(0); // ?????
    }

    [renderSceneGraph] (sceneNode) {
      let transform = sceneNode.getComponent('transform');
      let graphics = sceneNode.getComponent('graphics');

      if (transform) {
        mat4.fromRotationTranslation(
          intermediateMatrix,
          transform.rotation,
          transform.position
        );

        mat4.scale(
          intermediateMatrix,
          intermediateMatrix,
          transform.scale
        );

        mat4.multiply(modelViewMatrix, modelViewMatrix, intermediateMatrix);
      }

      if (graphics) {
        graphics.draw(this.gl, perspectiveMatrix, modelViewMatrix);
      }

      for (let i = 0; i < sceneNode.children.length; ++i) {
        this[renderSceneGraph](sceneNode.children[i]);
      }

      if (transform) {
        mat4.fromRotationTranslation(
          intermediateMatrix,
          transform.rotation,
          transform.position
        );

        mat4.invert(intermediateMatrix, intermediateMatrix);

        mat4.multiply(modelViewMatrix, modelViewMatrix, intermediateMatrix);
      }
    }
  }

  window.Renderer = Renderer;
})();
