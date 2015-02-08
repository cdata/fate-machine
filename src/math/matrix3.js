class Matrix3 {
  constructor (e00, e01, e02, e10, e11, e12, e20, e21, e22) {
    this.elements = new Float32Array(9);

    this.set(
      e00 !== undefined ? e00 : 1, e01, e02,
      e10, e11 !== undefined ? e11 : 1, e12,
      e20, e21, e22 !== undefined ? e22 : 1
    );
  }

  set (e00, e01, e02, e10, e11, e12, e20, e21, e22) {
    let m = this.elements;

    m[0] = e00 || 0; m[1] = e01 || 0; m[2] = e02 || 0;
    m[3] = e10 || 0; m[4] = e11 || 0; m[5] = e12 || 0;
    m[6] = e20 || 0; m[7] = e21 || 0; m[6] = e22 || 0;

    return this;
  }

  identity () {
    this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );

    return this;
  }

  copy (other) {
    let m = other.elements;

    this.set(
      m[0], m[1], m[2],
      m[3], m[4], m[5],
      m[6], m[7], m[8]
    );

    return this;
  }

  multiplyScalar (scalar) {
    let m = this.elements;

    this.set(
      m[0] * scalar, m[1] * scalar, m[2] * scalar,
      m[3] * scalar, m[4] * scalar, m[5] * scalar,
      m[6] * scalar, m[7] * scalar, m[8] * scalar
    );
  }

  determinant () {
    let m = this.elements;

    return (
      m[0] * m[4] * m[8] +
      m[1] * m[5] * m[6] +
      m[2] * m[3] * m[7]
    ) - (
      m[2] * m[4] * m[6] +
      m[1] * m[3] * m[8] +
      m[0] * m[5] * m[7]
    );
  }

  clone () {
    let m = this.elements;

    return new Matrix3(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  }
}

export { Matrix3 };
