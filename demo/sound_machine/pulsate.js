import { Transform } from '../../aspect/transform';
import { Behavior } from '../../behavior';
import { Fate } from '../../fate';

class Pulsates extends Behavior {
  static get requiredAspects () {
    return {
      transform: Transform
    };
  }

  create () {
    this.xOrigin = Math.random() * 100;
    this.yOrigin = Math.random() * 100;
  }

  update (delta) {
    let denominator = 20;
    let scale;

    this.t0 = this.t0 || Math.random() * 100;
    this.t0 += delta;

    scale = Math.sin(this.t0 / denominator);

    this.transform.position.x = this.xOrigin + Math.cos(this.t0 / denominator + Math.PI / 2) * 100 + 100;
    this.transform.position.y = this.yOrigin + Math.cos(this.t0 / denominator) * 100 + 100;

    this.transform.rotation.z = Math.sin(this.t0 / denominator) * 360;

    this.transform.scale.set(
      scale,
      scale,
      scale
    );
  }
}

export { Pulsates };
