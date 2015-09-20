import { Aspect } from '../aspect';

class Geometry extends Aspect {
  static get type () {
    return 'geometry';
  }

  constructor (vertices) {
    this.vertices = vertices;
  }

  get size () {
    return 0|(this.vertices.length / 3);
  }
}

export { Geometry };
