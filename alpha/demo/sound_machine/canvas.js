import { Fate, Behavior } from '../../fate';
import { Transform } from '../../aspect/transform';

class TwoDimensionalBehavior extends Behavior {
  static get expectedAspects () {
    return {
      transform: Transform
    };
  }

  update (delta, fate) {
    fate.context.save();
    fate.context.fillStyle = '#000';
    fate.context.fillRect(
      this.transform.position.x,
      this.transform.position.y,
      this.transform.scale.x,
      this.transform.scale.y
    );
    fate.context.restore();
  }
}

class TwoDimensional extends Fate {
  get Behavior () {
    return TwoDimensionalBehavior;
  }

  create () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 2048;
    this.canvas.height = 400;
    this.context = this.canvas.getContext('2d');
  }

  update (delta) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    super.update(delta);
  }
}

export { TwoDimensional };
