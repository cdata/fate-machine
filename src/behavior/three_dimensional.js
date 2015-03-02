import { Behavior } from '../behavior';
import { Shader } from '../aspect/shader';
import { CompiledShader } from '../aspect/shader/compiled';

import { Transform } from '../aspect/transform';
import { Geometry } from '../aspect/geometry';
import { Material } from '../aspect/material';
import { Shader } from '../aspect/shader';

class ThreeDimensionalBehavior extends Behavior {
  static get expectedAspects () {
    return [
      Transform,
      Shader,
      Geometry,
      Material,
    ];
  }

  create () {
    let gl = this.fate.context;
    let vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices), gl.STATIC_DRAW);

    this.vertexBuffer = vertexBuffer;
    this.compiledShader = new CompiledShader(this.shader, gl);
    this.vertexPositionAttribute = gl.getAttribLocation(this.compiledShader.program, 'aVertexPosition');
  }

  update (delta) {
    this.fate.pushTransform(this.transform);
    this.draw();
    this.fate.popTransform();
  }

  draw () {
    let gl = this.fate.context;

    gl.useProgram(this.compiledShader.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.uniformMatrix4fv(this.compiledShader.perspectiveUniform, false, this.fate.perspectiveMatrix.elements);
    gl.uniformMatrix4fv(this.compiledShader.modelViewUniform, false, this.fate.modelViewMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export { ThreeDimensionalBehavior };
