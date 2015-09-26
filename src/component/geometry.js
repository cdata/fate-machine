(function () {
  'use strict'

  const rawVertices = Symbol('vertices');
  const vertexBuffer = Symbol('vertexBuffer');
  const isDirty = Symbol('isDirty');

  class Geometry extends Component {
    get type () {
      return 'geometry';
    }

    get rawVertices () {
      return this[rawVertices];
    }

    get length () {
      return Math.floor(this.rawVertices.length / this.size);
    }

    get size () {
      return 3;
    }

    constructor () {
      super();
      this[rawVertices] = this.allocateVertices();
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

    * [Symbol.iterator] () {
      let length = this.length;

      for (let index = 0; index < length; ++index) {
        yield this.vertexAt(index);
      }
    }
  }

  window.Geometry = Geometry;
})();
