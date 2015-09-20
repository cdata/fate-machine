import { Machine } from '../machine';
import { ThreeDimensional } from '../fate/three_dimensional';
import { Actor } from '../actor';
import { Transform } from '../aspect/transform';
import { Geometry } from '../aspect/geometry';
import { Material } from '../aspect/material';
import { Shader } from '../aspect/shader';

class Visible extends Actor {
  create () {
    this.addAspect(Transform);
    this.addAspect(Geometry);
    this.addAspect(Material);
    this.addAspect(Shader);

    this.getAspect(Transform).position.z = -10;
  }
}

class Cube extends Visible {
  create () {
    super.create();

    this.getAspect(Geometry).vertices = new Float32Array([
      //1, 1, 0,
      //0, 1, 0,
      //1, 0, 0,
      //0, 0, 0
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,

       1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, -1.0, 1.0

      //-1.0,  1.0,  1.0,

      // Back face
      //-1.0, -1.0, -1.0,
      //-1.0,  1.0, -1.0,
       //1.0,  1.0, -1.0,
       //1.0, -1.0, -1.0,

      // Top face
      //-1.0,  1.0, -1.0,
      //-1.0,  1.0,  1.0,
       //1.0,  1.0,  1.0,
       //1.0,  1.0, -1.0,

      // Bottom face
      //-1.0, -1.0, -1.0,
       //1.0, -1.0, -1.0,
       //1.0, -1.0,  1.0,
      //-1.0, -1.0,  1.0,

      // Right face
       //1.0, -1.0, -1.0,
       //1.0,  1.0, -1.0,
       //1.0,  1.0,  1.0,
       //1.0, -1.0,  1.0,

      // Left face
      //-1.0, -1.0, -1.0,
      //-1.0, -1.0,  1.0,
      //-1.0,  1.0,  1.0,
      //-1.0,  1.0, -1.0,
    ]);

    this.aspects.get(Transform.type).position.x = -2;
  }
}

class Triangle extends Visible {
  create () {
    super.create();

    this.getAspect(Geometry).vertices = new Float32Array([
      0.5, 1, 0,
      0,   0, 0,
      1,   0, 0,
      0,   0, 0
    ]);

    this.aspects.get(Transform.type).position.x = 1;
  }
}

let machine = window.machine = new Machine();
let cube = new Cube();
let triangle = new Triangle();

machine.addFate(ThreeDimensional, 400, 400);

machine.addActor(cube);
machine.addActor(triangle)

document.body.appendChild(
  machine.fates.get(ThreeDimensional).canvas
);

machine.start();
