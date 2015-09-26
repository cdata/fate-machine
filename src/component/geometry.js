(function () {
  'use strict'

  const rawVertices = Symbol('vertices');
  const rawIndices = Symbol('rawIndices');
  const vertexBuffer = Symbol('vertexBuffer');
  const indexBuffer = Symbol('indexBuffer');
  const isDirty = Symbol('isDirty');

  class Geometry extends Component {
    get type () {
      return 'geometry';
    }

    get rawVertices () {
      return this[rawVertices];
    }

    get rawIndices () {
      return this[rawIndices];
    }

    get length () {
      return Math.floor(this.rawVertices.length / this.size);
    }

    get size () {
      return 3;
    }

    constructor () {
      super();
      this[rawVertices] = this.allocateVertices.apply(this, arguments);
      this[rawIndices] = this.allocateIndices.apply(this, arguments);
      this.update();
    }

    vertexAt (index) {
      return new glMatrix.ARRAY_TYPE(
        this.rawVertices.buffer,
        this.size * glMatrix.ARRAY_TYPE.BYTES_PER_ELEMENT * index,
        this.size
      );
    }

    allocateVertices () {
      return new glMatrix.ARRAY_TYPE([]);
    }

    allocateIndices () {
      return new glMatrix.ARRAY_TYPE([]);
    }

    update () {
      this[isDirty] = true;
    }

    createVertexBuffer (gl) {
      if (!this[vertexBuffer]) {
        this[vertexBuffer] = gl.createBuffer();
      }

      if (this[isDirty]) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this[vertexBuffer]);
        gl.bufferData(gl.ARRAY_BUFFER, this.rawVertices, gl.STATIC_DRAW);

        this[isDirty] = false;
      }

      return this[vertexBuffer];
    }

    createIndexBuffer (gl) {
      if (!this[indexBuffer]) {
        this[indexBuffer] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this[indexBuffer]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.rawIndices, gl.STATIC_DRAW);
      }

      return this[indexBuffer];
    }

    * [Symbol.iterator] () {
      let length = this.length;

      for (let index = 0; index < length; ++index) {
        yield this.vertexAt(index);
      }
    }
  }

  window.Geometry = Geometry;
})();
