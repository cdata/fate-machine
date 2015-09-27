(function () {
  'use strict';

  let renderer = new Renderer();
  let canvas = renderer.canvas;

  document.body.appendChild(canvas);

  class TriangleGeometry extends Geometry {
    allocateVertices () {
      return glMatrix.ARRAY_TYPE.from([
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
      ]);
    }
  }

  class Triangle extends SceneNode {
    constructor () {
      super();

      this.addComponent(new Transform());
      this.addComponent(new TriangleGeometry());
      this.addComponent(new SolidColorMaterial(255, 0, 0, 0));
      this.addComponent(new Graphics());
    }
  }

  class Cube extends SceneNode {
    constructor () {
      super();

      this.addComponent(new Transform());
      this.addComponent(new BoxGeometry(2, 2, 2));
      this.addComponent(new Material());
      this.addComponent(new Graphics());
    }
  }

  class MyScene extends Scene {
    constructor () {
      super(new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000));

      this.frame = 0;
      this.triangle = new Triangle();
      this.cube = new Cube();

      this.addChild(this.triangle);
      this.addChild(this.cube);
    }

    update () {
      vec3.set(
        this.camera.getComponent('transform').position,
        0, 0, 5
      );
      /*vec3.set(
        this.camera.getComponent('transform').position,
        0.0, 0.0, Math.sin(Math.PI * this.frame / 100) / 5 + 2.0
      );*/

      quat.rotateZ(
        this.triangle.getComponent('transform').rotation,
        this.triangle.getComponent('transform').rotation,
        0.005
      );

      quat.rotateZ(
        this.cube.getComponent('transform').rotation,
        this.cube.getComponent('transform').rotation,
        0.001
      );

      quat.rotateY(
        this.cube.getComponent('transform').rotation,
        this.cube.getComponent('transform').rotation,
        0.005
      );

      this.frame++;
    }
  }

  let scene = new MyScene();

  (function render () {
    scene.update();
    renderer.render(scene);

    window.requestAnimationFrame(render);
  })();

  window.scene = scene;
  window.renderer = renderer;
})();
