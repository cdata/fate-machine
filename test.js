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

  class CubeGeometry extends Geometry {
    get size () {
      return 3;
    }

    allocateVertices () {
      return glMatrix.ARRAY_TYPE.from([
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
      ]);
    }

    allocateIndices () {
      return glMatrix.ARRAY_TYPE.from([
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
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
      this.addComponent(new CubeGeometry());
      this.addComponent(new Material());
      this.addComponent(new Graphics());
    }
  }

  class MyScene extends Scene {
    constructor () {
      super(new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100));

      this.frame = 0;
      this.triangle = new Triangle();
      this.cube = new Cube();

      this.addChild(this.triangle);
      this.addChild(this.cube);
    }

    update () {
      vec3.set(
        this.camera.getComponent('transform').position,
        0.0, 0.0, Math.sin(Math.PI * this.frame / 100) / 5 + 2.0
      );

      quat.rotateZ(
        this.triangle.getComponent('transform').rotation,
        this.triangle.getComponent('transform').rotation,
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
