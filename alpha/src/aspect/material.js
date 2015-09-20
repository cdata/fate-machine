import { Aspect } from '../aspect';

class Material extends Aspect {
  static get type () {
    return 'material';
  }

  constructor () {
    this.sides = 1;
    this.opacity = 1;
    this.visible = true;
  }
}

export { Material };
