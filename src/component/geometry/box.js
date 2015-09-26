(function () {
  'use strict';
  // Based on https://github.com/mrdoob/three.js/blob/master/src/extras/geometries/BoxGeometry.js

  const buildPlane = Symbol('buildPlane');
  const wForUAndV = Symbol('wForUAndV');

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
      this[width] = _width;
      this[height] = _height;
      this[depth] = _depth;

      super();
    }

    allocateVertices () {
      let widthHalf = width / 2;
      let heightHalf = height / 2;
      let depthHalf = depth / 2;
      let vertices = new glMatrix.ARRAY_TYPE(24);

      this[buildPlane](vertices, 'z', 'y', -1, -1, depth, height, widthHalf, 0);
      this[buildPlane](vertices, 'z', 'y',  1, -1, depth, height, -widthHalf, 1);
      this[buildPlane](vertices, 'x', 'z',  1,  1, width, depth, heightHalf, 2);
      this[buildPlane](vertices, 'x', 'z',  1, -1, width, depth, -heightHalf, 3);
      this[buildPlane](vertices, 'x', 'y',  1, -1, width, height, depthHalf, 4);
      this[buildPlane](vertices, 'x', 'y', -1, -1, width, height, depthHalf, 5);

      console.log(vertices);

      return vertices;
    }

    [buildPlane] (vertices, u, v, uDir, vDir, width, height, depth, index) {
      let w = this[wForUAndV](u, v);
      let widthHalf = width / 2;
      let heightHalf = height / 2;
      let offset = index * this.size * 4;

      for (let y = 0; y < 2; ++y) {
        for (let x = 0; x < 2; ++x) {
          vertices[offset] = (x * width - halfWidth) * uDir;
          vertices[offset + 1] = (y * height - halfHeight) * vDir;
          vertices[offset + 2] = depth;
        }
      }
    }

    [wForUAndV] (u, v) {
      if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {
        return 'z';
      } else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
        return 'y';
      } else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
        return 'w';
      }
    }
  }

  window.BoxGeometry = BoxGeometry;
})();
