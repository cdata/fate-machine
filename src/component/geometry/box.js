(function () {
  'use strict';

  const dimensions = Symbol('dimensions');
  const nextVertex = vec3.create();
  const boxIndices = new Uint16Array([
    0,  1,  2,    0,  2,  7, // Front face
    1,  4,  3,    1,  3,  2, // Right face
    4,  5,  6,    4,  6,  3, // Back face
    5,  0,  7,    5,  7,  6, // Left face
    7,  2,  3,    7,  3,  6, // Top face
    5,  4,  1,    5,  1,  0  // Bottom face
  ]);

  class BoxGeometry extends Geometry {
    get dimensions () {
      return this[dimensions];
    }

    get width () {
      return this[dimensions][0];
    }

    get height () {
      return this[dimensions][1];
    }

    get depth () {
      return this[dimensions][2];
    }

    constructor (width, height, depth) {
      let _dimensions = vec3.fromValues(width, height, depth);

      super(_dimensions);

      this[dimensions] = _dimensions;
    }

    allocateVertices (dimensions) {
      let vertices = new glMatrix.ARRAY_TYPE(8 * this.size);

      vec3.scale(nextVertex, dimensions, 0.5);
      nextVertex[0] *= -1;
      nextVertex[1] *= -1;

      for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 2; ++j) {
          let index = i * 2 + j;

          for (let k = 0; k < 3; ++k) {
            vertices[index * 3 + k] = nextVertex[k];
          }

          if (index === 7) {
            continue;
          }

          let component = 1;

          if (index % 4 === 0) {
            component = 0;
          } else if (index % 2 === 0) {
            component = 2;
          }

          nextVertex[component] *= -1;
        }
      }

      return vertices;
    }

    allocateIndices () {
      return boxIndices;
    }
  }

  window.BoxGeometry = BoxGeometry;
})();
