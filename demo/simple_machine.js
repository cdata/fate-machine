import { Machine } from '../machine';
import { ThreeDimensional } from '../fate/three_dimensional';
import { Actor } from '../actor';
import { Transform } from '../aspect/transform';
import { Geometry } from '../aspect/geometry';
import { Material } from '../aspect/material';
import { Shader } from '../aspect/shader';

class Cube extends Actor {
  create () {
    this.addAspect(Transform);
    this.addAspect(Geometry, [
      1, 1, 0,
      0, 1, 0,
      1, 0, 0,
      0, 0, 0
    ]);
    this.addAspect(Material);
    this.addAspect(Shader);

    this.aspects.get(Transform.type).position.z = -100;
  }
}

let machine = window.machine = new Machine();

machine.addFate(ThreeDimensional, 400, 400);

machine.addActor(new Cube());

document.body.appendChild(
  machine.fates.get(ThreeDimensional).canvas
);

machine.start();
