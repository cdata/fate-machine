(function () {
  'use strict'

  let vertices = Symbol('vertices');
  let createVertexBuffer = Symbol('createVertexBuffer');

  let geometryVertexBufferCache = new Map();

  class Geometry extends Component {
    get type () {
      return 'geometry';
    }

    get vertices () {
      return this[vertices];
    }

    get length () {
      return 0|(this.vertices.length / this.size);
    }

    get size () {
      return 3;
    }

    constructor (_vertices) {
      super();

      this[vertices] = _vertices;
    }

    createVertexBuffer (gl) {
      if (!geometryVertexBufferCache.has(this.constructor)) {
        geometryVertexBufferCache.set(this.constructor, this[createVertexBuffer](gl));
      }

      return geometryVertexBufferCache.get(this.constructor);
    }

    [createVertexBuffer] (gl) {
      let vertexBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

      return vertexBuffer;
    }
  }

  window.Geometry = Geometry;
})();
