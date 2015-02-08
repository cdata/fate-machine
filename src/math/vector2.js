class Vector2 {
  constructor (x, y) {
    this.elements = new Float32Array(2);

    this.set(x, y);
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

  get length () {
    return Math.sqrt(this.dot(this));
  }

  reset () {
    this.set(0, 0);
  }

  round () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  floor () {
    this.x |= 0;
    this.y |= 0;

    return this;
  }

  set (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  dot (other) {
    return this.x * other.x + this.y * other.y;
  }

  divide (scalar) {
    this.x /= scalar;
    this.y /= scalar;

    return this;
  }

  multiply (scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  subtract (other) {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  }

  add (other) {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  normalize () {
    return this.divide(this.length());
  }

  distanceTo (other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  equals (other) {
    return !!other && this.x === other.x && this.y === other.y;
  }

  clone () {
    return new Vector2(this.x, this.y);
  }

  copy (other) {
    this.set(other.x, other.y);
    return this;
  }
}

export { Vector2 };
