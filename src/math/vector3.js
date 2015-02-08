
class Vector3 {
  constructor (x, y, z) {
    this.elements = new Float32Array(3);

    this.set(x, y, z);
  }

  destroy () {
    buffer.free(this.elements);
    this.elements = null;
  }

  get x () {
    return this.elements[0];
  }

  set x (value) {
    this.elements[0] = value;
  }

  get y () {
    return this.elements[1];
  }

  set y (value) {
    this.elements[1] = value;
  }

  get z () {
    return this.elements[2];
  }

  set z (value) {
    this.elements[2] = value;
  }

  get length () {
    Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  set (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  round () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  floor () {
    this.x |= 0;
    this.y |= 0;
    this.z |= 0;

    return this;
  }

  dot (other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross (other) {
    this.x = this.y * other.z - this.z * other.y;
    this.y = this.z * other.x - this.x * other.z;
    this.z = this.x * other.y - this.y * other.x;

    return this;
  }

  divide (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;

    return this;
  }

  multiply (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  }

  subtract (other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;

    return this;
  }

  add (other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
  }

  normalize () {
    return this.divide(this.length());
  }

  distanceTo (other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  equals (other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  clone () {
    return new Vector3(this.x, this.y, this.z);
  }

  copy (other) {
    this.set(other.x, other.y, other.z);
    return this;
  }
}

export { Vector3 };
