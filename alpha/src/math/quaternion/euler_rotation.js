class EulerRotation {
  constructor (quaternion) {
    this.quaternion = quaternion;
    this.elements = new Float32Array(3);
  }

  get x () {
    return this.elements[0];
  }

  set x (value) {
    this.elements[0] = value;
    this.pushToQuaternion();
  }

  get y () {
    return this.elements[1];
  }

  set y (value) {
    this.elements[1] = value;
    this.pushToQuaternion();
  }

  get z () {
    return this.elements[2];
  }

  set z (value) {
    this.elements[2] = value;
    this.pushToQuaternion();
  }

  pullFromQuaternion () {
    let q = this.quaternion;
    let e = this.elements;

    let xx = q.x * q.x;
    let yy = q.y * q.y;
    let zz = q.z * q.z;
    let ww = q.w * q.w;

    e[0] = Math.atan2(2 * (q.x * q.w - q.y * q.z), (ww - xx - yy + zz));
    e[1] = Math.asin(Math.min(Math.max(-1, 2 * (q.x * q.z + q.y * q.w))));
    e[2] = Math.atan2(2 * (q.z * q.w - q.x * q.y), (ww + xx - yy - zz));
  }

  pushToQuaternion () {
    let e = this.elements;
    let qe = this.quaternion.elements;

    let c1 = Math.cos(e[0]/2);
    let c2 = Math.cos(e[1]/2);
    let c3 = Math.cos(e[2]/2);
    let s1 = Math.sin(e[0]/2);
    let s2 = Math.sin(e[1]/2);
    let s3 = Math.sin(e[2]/2);

    qe[0] = s1 * c2 * c3 + c1 * s2 * s3;
    qe[1] = c1 * s2 * c3 - s1 * c2 * s3;
    qe[2] = c1 * c2 * s3 + s1 * s2 * c3;
    qe[3] = c1 * c2 * c3 - s1 * s2 * s3;
  }
}

export { EulerRotation };
