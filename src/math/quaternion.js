class Quaternion {
  constructor (x, y, z, w) {
    this.elements = new Float32Array(4);
    this.set(x, y, z, w !== undefined ? w : 1);
  }

  destroy () {
    buffer.free(this.elements);
    this.elements = null;
  }

  get x () {
    return this.elements[0];
  }

  set x (value) {
    this.set(
      value,
      this.y,
      this.z,
      this.w
    );
  }

  get y () {
    return this.elements[1];
  }

  set y (value) {
    this.set(
      this.x,
      value,
      this.z,
      this.w
    );
  }

  get z () {
    return this.elements[2];
  }

  set z (value) {
    this.set(
      this.x,
      this.y,
      value,
      this.w
    );
  }

  get w () {
    return this.elements[3];
  }

  set w (value) {
    this.set(
      this.x,
      this.y,
      this.z,
      value
    );
  }

  get length () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  set (x, y, z, w) {
    let e = this.elements;

    e[0] = x || 0;
    e[1] = y || 0;
    e[2] = z || 0;
    e[3] = w || 0;

    return this;
  }

  clone () {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  copy (other) {
    return this.set(other.x, other.y, other.z, other.w);
  }

  equals (other) {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }

  conjugate () {
    this.set(
      this.x * -1,
      this.y * -1,
      this.z * -1,
      this.w
    );

    return this;
  }

  normalize () {
    let length = this.length;

    if (length === 0) {
      return this.set(0, 0, 0, 1);
    }

    length = 1 / length;
    return this.set(this.x * length, this.y * length, this.z * length, this.w * length);
  }

  inverse () {
    return this.conjugate().normalize();
  }
}

export { Quaternion };
