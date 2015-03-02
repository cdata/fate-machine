import { Aspect } from '../aspect';

class Geometry extends Aspect {
  static get type () {
    return 'geometry';
  }

  constructor (vertices) {
    this.vertices = vertices;
  }
}

export { Geometry };
