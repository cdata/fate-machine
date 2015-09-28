(function () {
  'use strict';

  const interstitialMatrix = mat4.create();
  const interstitialVector = vec3.create();

  class PerspectiveCamera extends SceneNode {
    constructor (fov, aspectRatio, near, far) {
      super();

      this.fov = fov;
      this.aspectRatio = aspectRatio;
      this.near = near;
      this.far = far;

      this.addComponent(new Transform());
    }

    applyTo (perspectiveMatrix, modelViewMatrix) {
      let transform = this.getComponent('transform');

      vec3.negate(interstitialVector, transform.position);
      mat4.fromRotationTranslation(
        modelViewMatrix,
        transform.rotation,
        interstitialVector
      );
      //mat4.translate(modelViewMatrix, modelViewMatrix, interstitialVector);
      mat4.multiply(modelViewMatrix, modelViewMatrix, interstitialMatrix);

      mat4.perspective(perspectiveMatrix, this.fov, this.aspectRatio, this.near, this.far);
    }
  }

  window.PerspectiveCamera = PerspectiveCamera;
})();
