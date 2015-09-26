(function () {
  'use strict';
  // Based on https://github.com/mrdoob/three.js/blob/master/src/extras/geometries/BoxGeometry.js

  const buildPlane = Symbol('buildPlane');

  const width = Symbol('width');
  const height = Symbol('height');
  const depth = Symbol('depth');

  class BoxGeometry extends Geometry {
    get width () {
      return this[width];
    }

    get height () {
      return this[height];
    }

    get depth () {
      return this[depth];
    }

    constructor (_width, _height, _depth) {
      super(_width, _height, _depth);

      this[width] = _width;
      this[height] = _height;
      this[depth] = _depth;
    }

    allocateVertices (width, height, depth) {
      let widthHalf = width / 2;
      let heightHalf = height / 2;
      let depthHalf = depth / 2;
      let vertices = new glMatrix.ARRAY_TYPE(6 * 4 * this.size);

      let x = 0;
      let y = 1;
      let z = 2;

      this[buildPlane](vertices, z, y, x, -1, -1, depth, height, widthHalf, 0);
      this[buildPlane](vertices, z, y, x,  1, -1, depth, height, -widthHalf, 1);
      this[buildPlane](vertices, x, z, y,  1,  1, width, depth, heightHalf, 2);
      this[buildPlane](vertices, x, z, y,  1, -1, width, depth, -heightHalf, 3);
      this[buildPlane](vertices, x, y, z,  1, -1, width, height, depthHalf, 4);
      this[buildPlane](vertices, x, y, z, -1, -1, width, height, depthHalf, 5);

      console.log(vertices, vertices.length);

      return vertices;
    }

    [buildPlane] (vertices, u, v, w, uDir, vDir, width, height, depth, index) {
      let halfWidth = width / 2;
      let halfHeight = height / 2;
      let offset = index * 4 * this.size;

      for (let y = 0; y < 2; ++y) {
        for (let x = 0; x < 2; ++x) {
          let index = y * (x + 1) * 3 + offset;

          vertices[index + u] = (x * width - halfWidth) * uDir;
          vertices[index + v] = (y * height - halfHeight) * vDir;
          vertices[index + w] = depth;
          console.log(index, ':', vertices[index], vertices[index + 1], vertices[index + 2]);
        }
      }
    }
  }

  window.BoxGeometry = BoxGeometry;
})();
