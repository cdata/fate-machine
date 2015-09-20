import { Aspect } from '../aspect';
import { Vector3 } from '../math/vector3';
import { Quaternion } from '../math/quaternion';
import { EulerRotation } from '../math/quaternion/euler_rotation';

class Transform extends Aspect {
  static get type () {
    return 'transform';
  }

  constructor () {
    this.position = new Vector3();
    this.rotation = new EulerRotation(new Quaternion());
    this.scale = new Vector3(1, 1, 1);
  }
}

export { Transform };
